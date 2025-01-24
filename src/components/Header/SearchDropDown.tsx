"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/components/DropDown/FramerMotion";
import SearchInput from "../SearchInput/SearchInput";
import styles from "./Header.module.css";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";

interface Token {
  name: string;
  ticker: string;
}

interface SearchDropDownProps {
  isOpen: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredTokens: Token[];
  onTokenSelect: (token: string) => void;
}

const TokenItem: React.FC<{ token: Token }> = ({ token }) => {
  const { data: protocolStats } = useProtocolStats(token.ticker.toUpperCase());

  const getOutcomeIcon = () => {
    if (!protocolStats || protocolStats.apr === 0) {
      return "/icons/APRUp.svg";
    }
    return protocolStats.percentChange.outcome
      ? "/icons/APRUp.svg"
      : "/icons/APRDown.svg";
  };

  return (
    <>
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
        <p className={styles.tokenAPR}>
          APR {protocolStats?.apr.toFixed(2) ?? 0.0}%
        </p>
        <div className={styles.percentChangeContainer}>
          <Image
            src={getOutcomeIcon()}
            alt={protocolStats?.percentChange.outcome ? "Up" : "Down"}
            width={16}
            height={16}
          />
          <p className={styles.percentChange}>
            {protocolStats?.percentChange.change ?? "0.00"}%
          </p>
        </div>
      </div>
    </>
  );
};

const SearchDropDown: React.FC<SearchDropDownProps> = ({
  isOpen,
  searchTerm,
  onSearchChange,
  filteredTokens,
  onTokenSelect,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.tokenDropdownContent}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            labelText="Search"
          />
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <button
                key={token.ticker}
                onClick={() => onTokenSelect(token.ticker)}
                className={styles.tokenDropdownItem}
              >
                <TokenItem token={token} />
              </button>
            ))
          ) : (
            <div className={styles.noTokens}>No tokens found</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDropDown;
