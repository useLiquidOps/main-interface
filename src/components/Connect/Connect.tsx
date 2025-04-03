"use client";
import React, { useState, useEffect } from "react";
import styles from "./Connect.module.css";
import { useClickOutside } from "../utils/utils";
import DropdownButton from "../DropDown/DropDown";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants } from "@/components/DropDown/FramerMotion";
import ProfileDropDown from "../ProfileDropDown/ProfileDropDown";
import { useAOProfile } from "@/hooks/data/useAOProfile";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import WalletModal from "./WalletModal/WalletModal";
import { walletInfo } from "@/utils/wallets";
import { useWallet } from "@vela-ventures/aosync-sdk-react";

declare global {
  interface Window {
    //@ts-ignore
    arweaveWallet: any;
  }
}

const Connect: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useAOProfile();

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() =>
    setIsOpen(false),
  );

  const copyToClipboard = async (text: string) => {
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
      setIsOpen(false);
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
    if (
      typeof window === "undefined" ||
      window.arweaveWallet.walletName !== "ArConnect" ||
      "Wander"
    ) {
      // TODO: change to Wander only when Clabs update the window object
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
  useEffect(() => {
    if (isConnected) {
      handleConnectBeacon();
    }
  }, [isConnected]);

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
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className={styles.connectContainer} ref={dropdownRef}>
        {connected && address ? (
          <div
            className={styles.profileContainer}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <DropdownButton
              isOpen={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
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
            <ProfileDropDown
              isOpen={isOpen}
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

export default Connect;
