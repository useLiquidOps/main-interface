"use client";
import React, { useState } from "react";
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
}

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const moreMenuItems = [
    {
      label: "Docs",
      href: "https://docs.liquidops.io",
    },
    { label: "Blog", href: "https://labs.liquidops.io/blog" },
    { label: "Company", href: "https://labs.liquidops.io" },
  ];

  const isLinkActive = (path: string) => {
    const firstPathSegment = pathname.split("/")[1];
    return "/" + firstPathSegment === path;
  };

  return (
    <>
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
            <MoreDropdown items={moreMenuItems} />
          </nav>
        </div>
        <Connect />
      </header>
    </>
  );
};

export default Header;
