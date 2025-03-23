import React from "react";
import styles from "./TokenFilter.module.css";
import Image from "next/image";
import DropdownButton from "@/components/DropDown/DropDown";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/components/DropDown/FramerMotion";

interface TokenInfo {
  ticker: string;
  icon: string;
}

interface TokenFilterProps {
  label: string;
  selectedToken: TokenInfo;
  tokens: TokenInfo[];
  showDropdown: boolean;
  toggleDropdown: () => void;
  onSelectToken: (token: TokenInfo) => void;
}

const TokenFilter: React.FC<TokenFilterProps> = ({
  label,
  selectedToken,
  tokens,
  showDropdown,
  toggleDropdown,
  onSelectToken,
}) => {
  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}</span>
      <div
        className={styles.dropdownContainer}
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
      >
        <button className={styles.filterButton}>
          <Image
            src={selectedToken.icon}
            alt={selectedToken.ticker}
            width={16}
            height={16}
          />
          <span>{selectedToken.ticker}</span>
          <DropdownButton isOpen={showDropdown} onToggle={toggleDropdown} />
        </button>
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className={styles.dropdown}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {tokens.map((token) => (
                <div
                  key={token.ticker}
                  className={styles.dropdownItem}
                  onClick={() => {
                    onSelectToken(token);
                  }}
                >
                  <Image
                    src={token.icon}
                    alt={token.ticker}
                    width={16}
                    height={16}
                  />
                  <span>{token.ticker}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenFilter;
