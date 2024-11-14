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
  disabled?: boolean;
  liquidationMode?: boolean;
  liquidationDiscount?: number;
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
  disabled = false,
  liquidationMode = false,
  liquidationDiscount = 0,
}) => {
  const [showError, setShowError] = useState(false);

  const getDecimalPlaces = (ticker: string) => {
    switch (ticker) {
      case "DAI":
        return 2;
      case "stETH":
        return 4;
      case "qAR":
        return 3;
      default:
        return 2;
    }
  };

  const formatTokenValue = (value: number) => {
    const decimals = getDecimalPlaces(ticker);
    return value.toLocaleString("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const formattedValue = formatInputNumber(e.target.value);
    const numberValue = Number(formattedValue.replace(/,/g, ""));

    if (!isNaN(numberValue)) {
      if (numberValue > walletBalance) {
        setShowError(true);
        setTimeout(() => setShowError(false), 820);
      } else {
        setInputValue(formattedValue);
      }
    } else if (formattedValue === "") {
      setInputValue("");
    }
  };

  const getBonusAmount = () => {
    if (!inputValue || !liquidationDiscount) return "0";
    const currentValue = parseFloat(inputValue.replace(/,/g, ""));
    const bonusAmount = currentValue * (1 + liquidationDiscount / 100);
    return formatTokenValue(bonusAmount);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return value;
    const numberValue = parseFloat(value.replace(/,/g, ""));
    return formatTokenValue(numberValue);
  };

  const renderUsdValue = () => {
    if (
      liquidationMode &&
      disabled &&
      inputValue &&
      parseFloat(inputValue) !== 0
    ) {
      return (
        <div className={styles.usdValueContainer}>
          <span className={styles.baseUsdValue}>
            ≈{calculateUsdValue(inputValue, tokenToUsdRate)} USD
          </span>
          <span className={styles.usdValue}>
            ≈{calculateUsdValue(getBonusAmount(), tokenToUsdRate)} USD
          </span>
        </div>
      );
    }

    return (
      <p className={styles.usdValue}>
        ≈{calculateUsdValue(inputValue, tokenToUsdRate)} USD
      </p>
    );
  };

  const renderInput = () => {
    const baseInput = (
      <input
        type="text"
        value={
          liquidationMode && disabled
            ? formatDisplayValue(getBonusAmount())
            : inputValue
        }
        onChange={handleInputChange}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => !disabled && setIsFocused(false)}
        className={styles.amountInput}
        placeholder="0"
        readOnly={disabled}
      />
    );

    if (
      liquidationMode &&
      disabled &&
      inputValue &&
      parseFloat(inputValue) !== 0
    ) {
      return (
        <div className={styles.inputWithPrices}>
          <span className={styles.baseAmount}>
            {formatDisplayValue(inputValue)}
          </span>
          {baseInput}
        </div>
      );
    }

    return baseInput;
  };

  return (
    <div
      className={`${styles.inputContainer} ${isFocused ? styles.focused : ""} ${
        showError ? styles.error : ""
      } ${disabled ? styles.disabled : ""}`}
    >
      <div className={styles.inputSection}>
        <div className={styles.leftSection}>
          {renderInput()}
          <div className={styles.valueSection}>{renderUsdValue()}</div>
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
          {!disabled && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InputBox;
