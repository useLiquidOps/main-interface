"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Connect from "../Connect/Connect";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants } from "@/components/DropDown/FramerMotion";
import MoreDropdown from "./MoreDropdown/MoreDropdown";

interface HeaderProps {
  currentToken?: string;
  mode?: "ticker" | "supply" | "borrow";
  triggerConnect?: boolean;
  onWalletConnected?: () => void;
}

// Create a ref interface for the Connect component
export interface ConnectRef {
  openWalletModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  triggerConnect,
  onWalletConnected,
}) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const connectRef = useRef<ConnectRef>(null);

  const bridgeItems = [
    { label: "Vento", href: "https://ventoswap.com/?tab=bridge" },
    { label: "AOX", href: "https://aox.xyz/#/bridge" },
  ];

  const moreMenuItems = [
    {
      label: "Docs",
      href: "https://docs.liquidops.io",
    },
    { label: "Blog", href: "https://labs.liquidops.io/blog" },
    { label: "Labs", href: "https://labs.liquidops.io" },
  ];

  // Handle client-side mounting and localStorage
  useEffect(() => {
    setIsClient(true);
    const bannerDismissed = localStorage.getItem("bannerDismissed") === "true";
    setIsBannerVisible(!bannerDismissed);
  }, []);

  const handleBannerDismiss = () => {
    setIsBannerVisible(false);
    localStorage.setItem("bannerDismissed", "true");
  };

  const isLinkActive = (path: string) => {
    const firstPathSegment = pathname.split("/")[1];
    return "/" + firstPathSegment === path;
  };

  // Handle the trigger from Home component
  React.useEffect(() => {
    if (triggerConnect && connectRef.current) {
      connectRef.current.openWalletModal();
    }
  }, [triggerConnect]);

  return (
    <>
      {isClient && isBannerVisible && (
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerText}>
              🚀 The LQD fair launch is now live! Delegate AR tokens{" "}
              <Link href="/earn" style={{ textDecoration: "underline" }}>
                here
              </Link>
            </span>
            <button
              className={styles.bannerCloseButton}
              onClick={handleBannerDismiss}
              aria-label="Dismiss banner"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.titleAndDropdown}>
            <Link href="/" className={styles.pageTitleContainer}>
              <Image
                src="/favicon.svg"
                alt="LiquidOps Logo"
                width={30}
                height={30}
                className={styles.favicon}
              />
              <h2 className={styles.pageTitle}>LiquidOps</h2>
            </Link>
          </div>

          <nav className={styles.navLinks}>
            <Link
              href="/"
              className={isLinkActive("/") ? styles.activeLink : ""}
            >
              <p>Home</p>
            </Link>
            <Link
              href="/markets"
              className={isLinkActive("/markets") ? styles.activeLink : ""}
            >
              <p>Markets</p>
            </Link>
            <Link
              href="/earn"
              className={isLinkActive("/earn") ? styles.activeLink : ""}
            >
              <p>Earn</p>
            </Link>
            <MoreDropdown label="Bridge" items={bridgeItems} />
            <MoreDropdown label="More" items={moreMenuItems} />
          </nav>
        </div>
        <Connect ref={connectRef} onWalletConnected={onWalletConnected} />
      </header>
    </>
  );
};

export default Header;
