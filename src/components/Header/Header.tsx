"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Connect from "../Connect/Connect";
import Input from "../Input/Input";
import { useClickOutside } from "../utils/utils";

interface HeaderProps {
  home?: boolean;
  faucet?: boolean;
  currentToken?: string;
}

interface TokenData {
  name: string;
  ticker: string;
  APR: string;
  percentChange: {
    change: string;
    outcome: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({
  home = false,
  faucet = false,
  currentToken,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });

  const tokens: TokenData[] = [
    {
      name: "Quantum Arweave",
      ticker: "qAR",
      APR: "5.2",
      percentChange: {
        change: "1.2",
        outcome: true,
      },
    },
    {
      name: "Dai",
      ticker: "DAI",
      APR: "3.8",
      percentChange: {
        change: "0.2",
        outcome: false,
      },
    },
    {
      name: "Staked Ethereum",
      ticker: "stETH",
      APR: "4.5",
      percentChange: {
        change: "1.2",
        outcome: true,
      },
    },
  ];

  const sortedTokens = [...tokens].sort((a, b) => a.name.localeCompare(b.name));

  const filteredTokens = sortedTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setIsMounted(true);
    const basePath = pathname.split('/')[1];
    setActiveLink(basePath ? `/${basePath}` : '/');
  }, [pathname]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectToken = (token: string) => {
    if (home) {
      router.push(`/${token.toLowerCase()}`);
    } else if (faucet) {
      router.push(`/faucet/${token.toLowerCase()}`);
    }
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isMounted) {
    return null;
  }

  const currentTokenData =
    (home || faucet) && currentToken
      ? tokens.find(
          (token) => token.ticker.toLowerCase() === currentToken.toLowerCase(),
        )
      : null;

  const isLinkActive = (path: string) => {
    const firstPathSegment = pathname.split('/')[1];
    
    if (path === '/') {
      return pathname === '/' || (!firstPathSegment || (firstPathSegment && !['markets', 'liquidations', 'faucet'].includes(firstPathSegment)));
    }
    if (path === '/faucet') {
      return pathname.startsWith('/faucet');
    }
    return '/' + firstPathSegment === path;
  };

  return (
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
          {(home || faucet) && currentToken && (
            <div className={styles.tokenDropdown} ref={dropdownRef}>
              <div className={styles.selectedToken}>
                /{" "}
                <Image
                  src={`/tokens/${currentToken.toLowerCase()}.svg`}
                  alt={currentTokenData?.ticker || currentToken}
                  width={24}
                  height={24}
                />{" "}
                {currentTokenData?.ticker || currentToken}
              </div>
              <button
                className={styles.dropdownButton}
                onClick={toggleDropdown}
              >
                <img
                  src="/icons/dropdown.svg"
                  alt="Dropdown"
                  className={styles.dropdownIcon}
                />
              </button>
              {isDropdownOpen && (
                <div className={styles.tokenDropdownContent}>
                  <Input
                    labelText="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {filteredTokens.map((token) => (
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
                          <p className={styles.tokenTicker}>{token.ticker}</p>
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
                            alt={token.percentChange.outcome ? "Up" : "Down"}
                            width={16}
                            height={16}
                          />
                          <p className={styles.percentChange}>
                            {token.percentChange.change}%
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
            href="/liquidations"
            className={isLinkActive("/liquidations") ? styles.activeLink : ""}
          >
            <p>Liquidations</p>
          </Link>
          <Link
            href="/faucet"
            className={isLinkActive("/faucet") ? styles.activeLink : ""}
          >
            <p>Faucet</p>
          </Link>
        </nav>
      </div>
      <Connect />
    </header>
  );
};

export default Header;