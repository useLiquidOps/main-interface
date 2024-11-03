"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./InputBox.module.css";
import {
  formatInputNumber,
  calculateUsdValue,
  formatNumberWithCommas,
} from "../utils/utils";

interface InputBoxProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  ticker: string;
  tokenToUsdRate: number;
  walletBalance: number;
  onMaxClick: () => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  inputValue,
  setInputValue,
  isFocused,
  setIsFocused,
  ticker,
  tokenToUsdRate,
  walletBalance,
  onMaxClick,
}) => {
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputNumber(e.target.value);
    const numberValue = Number(formattedValue.replace(/,/g, ""));

    if (!isNaN(numberValue)) {
      if (numberValue > walletBalance) {
        // Trigger error animation
        setShowError(true);
        setTimeout(() => setShowError(false), 820); // Animation duration + small buffer
      } else {
        setInputValue(formattedValue);
      }
    } else if (formattedValue === "") {
      setInputValue("");
    }
  };

  return (
    <div
      className={`${styles.inputContainer} ${isFocused ? styles.focused : ""} ${showError ? styles.error : ""}`}
    >
      <div className={styles.inputSection}>
        <div className={styles.leftSection}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={styles.amountInput}
            placeholder="0"
          />
          <p className={styles.usdValue}>
            ≈{calculateUsdValue(inputValue, tokenToUsdRate)} USD
          </p>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.tokenSelector}>
            <Image
              src={`/tokens/${ticker}.svg`}
              height={20}
              width={20}
              alt={ticker}
            />
            <span>{ticker}</span>
          </div>
          <div className={styles.walletInfo}>
            <Image
              src="/icons/wallet.svg"
              height={14}
              width={14}
              alt="Wallet"
            />
            <span className={styles.balanceAmount}>
              {formatNumberWithCommas(walletBalance)} {ticker}
            </span>
            <span className={styles.separator}>|</span>
            <button className={styles.maxButton} onClick={onMaxClick}>
              Max
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
