"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/components/DropDown/FramerMotion";
import styles from "./Connect.module.css";
import { useUserBalance } from "@/hooks/useUserBalance";

interface TokenInfo {
  symbol: string;
  icon: string;
}

interface ProfileDropdownProps {
  isOpen: boolean;
  address: string;
  tokens: TokenInfo[];
  isCopied: boolean;
  onCopy: (text: string) => void;
  onLogout: () => void;
}

const TokenBalance: React.FC<{ token: TokenInfo }> = ({ token }) => {
  const { data: balance } = useUserBalance(token.symbol.toUpperCase());

  const formatBalance = (balance: number) =>
    balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className={styles.balance}>
      <Image src={token.icon} alt={token.symbol} width={24} height={24} />
      <span>
        {formatBalance(balance ?? 0)} {token.symbol}
      </span>
    </div>
  );
};

const ProfileDropDown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  address,
  tokens,
  isCopied,
  onCopy,
  onLogout,
}) => {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 3)}...${addr.slice(-3)}`;

  return (
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
              onClick={() => onCopy(address)}
            >
              <Image
                src={isCopied ? "/icons/copyActive.svg" : "/icons/copy.svg"}
                alt="Copy"
                width={14}
                height={14}
              />
            </button>
          </div>

          {tokens.map((token, index) => (
            <TokenBalance key={index} token={token} />
          ))}

          <div className={styles.logoutButtonContainer}>
            <button className={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropDown;
