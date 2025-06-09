"use client";
import React, { useState, useEffect, useContext } from "react";
import styles from "./Connect.module.css";
import { useClickOutside } from "../utils/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  pendingNotificationVariants,
} from "@/components/DropDown/FramerMotion";
import ProfileDropDown from "../ProfileDropDown/ProfileDropDown";
import { useAOProfile } from "@/hooks/data/useAOProfile";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import WalletModal from "./WalletModal/WalletModal";
import { walletInfo } from "@/utils/Wallets/wallets";
import { useWallet } from "@vela-ventures/aosync-sdk-react";
import { useAccountTab } from "./accountTabContext";
import { shortenAddress } from "@/utils/Wallets/wallets";
import { PendingTxContext } from "../PendingTransactions/PendingTransactions";
import Spinner from "../Spinner/Spinner";

declare global {
  interface Window {
    //@ts-ignore
    arweaveWallet: any;
  }
}

const Connect: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const { isOpen, setAccountTab } = useAccountTab();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]); // disable scroll when profile is visible

  const { data: profile, isLoading: isProfileLoading } = useAOProfile();

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() =>
    setAccountTab(false),
  );

  const copyToClipboard = async (text: string) => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 150);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await window.arweaveWallet.disconnect();
      setConnected(false);
      setAddress(null);
      setAccountTab(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleConnect = () => {
    setIsWalletModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  // Wander connector
  const handleConnectWander = async () => {
    if (typeof window === "undefined" || !window.arweaveWallet) {
      alert(
        `Please ensure you have the Wander wallet and it is properly installed on your device.\n\nFor new users, you can download the wallet by going to wander.app/download`,
      );
      return;
    }

    try {
      await window.arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
        walletInfo,
      );
      const permissions = await window.arweaveWallet.getPermissions();
      if (permissions.length > 0) {
        const addr = await window.arweaveWallet.getActiveAddress();
        setAddress(addr);
        setConnected(true);
      }

      setIsWalletModalOpen(false);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Beacon connector
  const { isConnected, connect } = useWallet();
  const handleConnectBeacon = async () => {
    try {
      const permissions = await window.arweaveWallet.getPermissions();
      if (permissions.length > 0) {
        const addr = await window.arweaveWallet.getActiveAddress();
        setAddress(addr);
        setConnected(true);
      }
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.arweaveWallet) {
        try {
          const permissions = await window.arweaveWallet.getPermissions();
          if (permissions.length > 0) {
            const addr = await window.arweaveWallet.getActiveAddress();
            setAddress(addr);
            setConnected(true);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Handle Beacon wallet connection
  useEffect(() => {
    if (isConnected) {
      handleConnectBeacon();
    }
  }, [isConnected]);

  const [pendingTransactions] = useContext(PendingTxContext);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setAccountTab(false)}
          />
        )}
      </AnimatePresence>
      <div className={styles.connectContainer} ref={dropdownRef}>
        {connected && address ? (
          <div
            className={styles.profileContainer}
            onClick={(e) => {
              e.stopPropagation();
              setAccountTab(!isOpen);
            }}
          >
            <div className={styles.profileSectionContainer}>
              {isProfileLoading ? (
                <SkeletonLoading style={{ width: "60px", height: "15px" }} />
              ) : (
                <p className={styles.profileName}>
                  {!isProfileLoading && profile?.displayName
                    ? `${profile.displayName}`
                    : shortenAddress(address)}
                </p>
              )}

              <Image
                src={"/icons/dropdownUpDown.svg"}
                alt="Dropdown"
                width={7}
                height={7}
                className={styles.dropdownIcon}
              />

              <div className={styles.profileImageWrapper}>
                {isProfileLoading ? (
                  <SkeletonLoading className="h-full w-full rounded-full" />
                ) : (
                  <img
                    src={
                      profile?.thumbnail
                        ? `https://arweave.net/${profile.thumbnail}`
                        : "/icons/user.svg"
                    }
                    alt="Profile image"
                    width={32}
                    height={32}
                    className={styles.connectImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icons/user.svg";
                    }}
                  />
                )}
              </div>
            </div>

            <ProfileDropDown
              isOpen={isOpen}
              onClose={() => setAccountTab(false)}
              address={address}
              isCopied={isCopied}
              onCopy={copyToClipboard}
              onLogout={handleLogout}
              isProfileLoading={isProfileLoading}
              profile={profile}
            />
          </div>
        ) : (
          <button className={styles.connectButton} onClick={handleConnect}>
            Login
          </button>
        )}
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleCloseWalletModal}
        onConnectWander={handleConnectWander}
        onConnectBeacon={connect}
      />
    </>
  );
};

const formatAction = (action: string): string => {
  const actionMap: Record<string, string> = {
    lend: "Lending",
    unlend: "Unlending",
    borrow: "Borrowing",
    repay: "Repaying",
  };
  return actionMap[action];
};

export default Connect;
