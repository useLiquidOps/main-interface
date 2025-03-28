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

declare global {
  interface Window {
    //@ts-ignore
    arweaveWallet: any;
  }
}

const Connect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useAOProfile();

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() =>
    setIsOpen(false),
  );

  const checkWalletConnection = async () => {
    if (typeof window === "undefined" || !window.arweaveWallet) {
      setIsLoading(false);
      return;
    }

    try {
      const permissions = await window.arweaveWallet.getPermissions();
      if (permissions.length > 0) {
        const addr = await window.arweaveWallet.getActiveAddress();
        setAddress(addr);
        setConnected(true);
      }
    } catch (error) {
      console.error("Wallet initialization error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

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

  const handleConnect = async () => {
    if (typeof window === "undefined" || !window.arweaveWallet) {
      alert(
        `Please ensure you have the Wander wallet and it is properly installed on your device.\n\nFor new users, you can download the wallet by going to wander.app/download`,
      );
      return;
    }

    try {
      await window.arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
        {
          name: "LiquidOps",
          logo: "https://arweave.net/crrW3xFrtKTdEODVu08XCJB_XPpqhlNDG2f8H8O4iSw",
        },
      );
      await checkWalletConnection();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  if (isLoading) {
    return null;
  }

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
    </>
  );
};

export default Connect;
