"use client";
import React, { useState, useEffect } from "react";
import styles from "./Connect.module.css";
import { useClickOutside } from "../utils/utils";
import DropdownButton from "../DropDown/DropDown";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";

interface TokenInfo {
  symbol: string;
  balance: number;
  icon: string;
}

declare global {
  interface Window {
    arweaveWallet: any;
  }
}

const Connect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() =>
    setIsOpen(false),
  );

  const tokens: TokenInfo[] = [
    { symbol: "DAI", balance: 1736.55, icon: "/tokens/DAI.svg" },
    { symbol: "qAR", balance: 3745.62, icon: "/tokens/qAR.svg" },
    { symbol: "stETH", balance: 394.11, icon: "/tokens/stETH.svg" },
  ];

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

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 3)}...${addr.slice(-3)}`;

  const formatBalance = (balance: number) =>
    balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
        `Please ensure you have the ArConnect wallet and it is properly installed on your device.\n\nFor new users, you can download the wallet by going to arconnect.io/download`,
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
            <Image
              src="/icons/user.svg"
              alt="Profile image"
              width={32}
              height={32}
              className={styles.connectImage}
            />
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className={styles.dropdown}
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.addressContainer}>
                    <span>{shortenAddress(address)}</span>
                    <button
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(address)}
                    >
                      <Image
                        src={
                          isCopied ? "/icons/copyActive.svg" : "/icons/copy.svg"
                        }
                        alt="Copy"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>

                  {tokens.map((token, index) => (
                    <div key={index} className={styles.balance}>
                      <Image
                        src={token.icon}
                        alt={token.symbol}
                        width={24}
                        height={24}
                      />
                      <span>
                        {formatBalance(token.balance)} {token.symbol}
                      </span>
                    </div>
                  ))}

                  <div className={styles.logoutButtonContainer}>
                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
