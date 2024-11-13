"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import DropDownBackDropStyles from "../../components/DropDown/DropDownBackdrop.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Connect from "../Connect/Connect";
import { useClickOutside } from "../utils/utils";
import { headerTokensData } from "../../app/data";
import DropdownButton from "../DropDown/DropDown";
import SearchInput from "../SearchInput/SearchInput";

interface HeaderProps {
  currentToken?: string;
  mode?: "home" | "supply" | "borrow" | "faucet";
}

const Header: React.FC<HeaderProps> = ({ currentToken, mode = "home" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() => {
    closeDropdown();
  });

  const closeDropdown = () => {
    setIsClosing(true);
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsClosing(false);
      setIsDropdownVisible(false);
    }, 300);
  };

  const sortedTokens = [...headerTokensData].sort((a, b) =>
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

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownVisible(true);
      setIsDropdownOpen(true);
      setIsClosing(false);
    } else {
      closeDropdown();
    }
  };

  const selectToken = (token: string) => {
    const tokenLower = token;
    const routes = {
      home: `/${tokenLower}`,
      supply: `/${tokenLower}/supply`,
      borrow: `/${tokenLower}/borrow`,
      faucet: `/faucet/${tokenLower}`,
    };

    router.push(routes[mode]);
    closeDropdown();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isMounted) {
    return null;
  }

  const currentTokenData = currentToken
    ? headerTokensData.find(
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
      {isDropdownVisible && (
        <div
          className={`${DropDownBackDropStyles.overlay} ${isClosing ? DropDownBackDropStyles.closing : ""}`}
          onClick={closeDropdown}
        />
      )}
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
                  toggleDropdown();
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
                  onToggle={toggleDropdown}
                />
                {isDropdownVisible && (
                  <div
                    className={`${styles.tokenDropdownContent} ${
                      isDropdownOpen ? styles.fadeIn : styles.fadeOut
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SearchInput
                      value={searchTerm}
                      onChange={handleSearch}
                      labelText="Search"
                    />
                    {filteredTokens.length > 0 ? (
                      filteredTokens.map((token) => (
                        <button
                          key={token.ticker}
                          onClick={() => selectToken(token.ticker)}
                          className={styles.tokenDropdownItem}
                        >
                          <div className={styles.tokenInfo}>
                            <Image
                              src={`/tokens/${token.ticker.toLowerCase()}.svg`}
                              alt={token.name}
                              width={40}
                              height={40}
                            />
                            <div className={styles.tokenNameTicker}>
                              <p className={styles.tokenName}>{token.name}</p>
                              <p className={styles.tokenTicker}>
                                {token.ticker}
                              </p>
                            </div>
                          </div>
                          <div className={styles.tokenMetrics}>
                            <p className={styles.tokenAPR}>APR {token.APR}%</p>
                            <div className={styles.percentChangeContainer}>
                              <Image
                                src={
                                  token.percentChange.outcome
                                    ? "/icons/APRUp.svg"
                                    : "/icons/APRDown.svg"
                                }
                                alt={
                                  token.percentChange.outcome ? "Up" : "Down"
                                }
                                width={16}
                                height={16}
                              />
                              <p className={styles.percentChange}>
                                {token.percentChange.change}%
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className={styles.noTokens}>No tokens found</div>
                    )}
                  </div>
                )}
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
          </nav>
        </div>
        <Connect />
      </header>
    </>
  );
};

export default Header;