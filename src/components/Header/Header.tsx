"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Connect from "../Connect/Connect";
import { useClickOutside } from "../utils/utils";
import DropdownButton from "../DropDown/DropDown";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants } from "@/components/DropDown/FramerMotion";
import SearchDropDown from "./SearchDropDown";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";

interface HeaderProps {
  currentToken?: string;
  mode?: "home" | "supply" | "borrow" | "faucet";
}

const Header: React.FC<HeaderProps> = ({ currentToken, mode = "home" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });

  const { data: supportedTokens = [] } = useSupportedTokens();

  const sortedTokens = [...supportedTokens].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const filteredTokens = sortedTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setIsMounted(true);
    const basePath = pathname.split("/")[1];
    setActiveLink(basePath ? `/${basePath}` : "/");
  }, [pathname]);

  const selectToken = (token: string) => {
    const tokenLower = token;
    const routes = {
      home: `/${tokenLower}`,
      supply: `/${tokenLower}/supply`,
      borrow: `/${tokenLower}/borrow`,
      faucet: `/faucet/${tokenLower}`,
    };

    router.push(routes[mode]);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isMounted) {
    return null;
  }

  const currentTokenData = currentToken
    ? supportedTokens.find(
        (token) => token.ticker.toLowerCase() === currentToken.toLowerCase(),
      )
    : null;

  const isLinkActive = (path: string) => {
    const firstPathSegment = pathname.split("/")[1];

    if (path === "/") {
      return (
        pathname === "/" ||
        !firstPathSegment ||
        (firstPathSegment &&
          !["markets", "liquidations", "faucet", "supply", "borrow"].includes(
            firstPathSegment,
          ))
      );
    }
    if (path === "/faucet") {
      return pathname.startsWith("/faucet");
    }
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
            {currentToken && (
              <div
                className={styles.tokenDropdown}
                ref={dropdownRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <div className={styles.selectedToken}>
                  /{" "}
                  <Image
                    src={`/tokens/${currentToken.toLowerCase()}.svg`}
                    alt={currentTokenData?.ticker || currentToken}
                    width={24}
                    height={24}
                  />{" "}
                  <p className={styles.ticker}>
                    {currentTokenData?.ticker || currentToken}
                  </p>
                </div>
                <DropdownButton
                  isOpen={isDropdownOpen}
                  onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                />

                <SearchDropDown
                  isOpen={isDropdownOpen}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  filteredTokens={filteredTokens}
                  onTokenSelect={selectToken}
                />
              </div>
            )}
          </div>

          <nav className={styles.navLinks}>
            <Link
              href="/qAR"
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
              href="/liquidations"
              className={isLinkActive("/liquidations") ? styles.activeLink : ""}
            >
              <p>Liquidations</p>
            </Link>
            <Link
              href="/faucet/qAR"
              className={isLinkActive("/faucet") ? styles.activeLink : ""}
            >
              <p>Faucet</p>
            </Link>
            <Link
              href="https://labs.liquidops.io"
              target="_blank"
              className={isLinkActive("/Company") ? styles.activeLink : ""}
            >
              <p>Company</p>
            </Link>
          </nav>
        </div>
        <Connect />
      </header>
    </>
  );
};

export default Header;
