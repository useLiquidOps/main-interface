"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Connect from "../Connect/Connect";
import Input from "../Input/Input";
import { useClickOutside } from "../utils/utils";

interface HeaderProps {
  home?: boolean;
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

const Header: React.FC<HeaderProps> = ({ home = false }) => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState("qAR");
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
    setActiveLink(pathname);
  }, [pathname]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectToken = (token: string) => {
    setSelectedToken(token);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.titleAndDropdown}>
          <button
            className={styles.pageTitleContainer}
            onClick={() => window.location.reload()}
          >
            <Image
              src="/favicon.svg"
              alt="LiquidOps Logo"
              width={30}
              height={30}
              className={styles.favicon}
            />
            <h2 className={styles.pageTitle}>LiquidOps</h2>
          </button>
          {home && (
            <div className={styles.tokenDropdown} ref={dropdownRef}>
              <div className={styles.selectedToken}>
                /{" "}
                <Image
                  src={`/tokens/${selectedToken.toLowerCase()}.svg`}
                  alt={selectedToken}
                  width={24}
                  height={24}
                />{" "}
                {selectedToken}
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
            className={activeLink === "/" ? styles.activeLink : ""}
          >
            <p>Home</p>
          </Link>
          <Link
            href="/markets"
            className={activeLink === "/markets" ? styles.activeLink : ""}
          >
            <p>Markets</p>
          </Link>
          <Link
            href="/liquidations"
            className={activeLink === "/liquidations" ? styles.activeLink : ""}
          >
            <p>Liquidations</p>
          </Link>
          <Link
            href="/faucet"
            className={activeLink === "/faucet" ? styles.activeLink : ""}
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
