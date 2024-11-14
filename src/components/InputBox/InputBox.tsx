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

interface TokenConfig {
  [key: string]: number;
  DAI: number;
  stETH: number;
  qAR: number;
}

const DECIMAL_PLACES: TokenConfig = {
  DAI: 2,
  stETH: 4,
  qAR: 3,
};

const useInputValidation = (walletBalance: number) => {
  const [showError, setShowError] = useState(false);

  const validateInput = (numberValue: number) => {
    if (numberValue > walletBalance) {
      setShowError(true);
      setTimeout(() => setShowError(false), 820);
      return false;
    }
    return true;
  };

  return { showError, validateInput };
};

const useTokenFormatting = (ticker: string) => {
  const formatTokenValue = (value: number, isLiquidationMode = false) => {
    if (value === 0 && isLiquidationMode) return "0";
    const decimals = DECIMAL_PLACES[ticker] || 2;
    return value.toLocaleString("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return value;
    const numberValue = parseFloat(value.replace(/,/g, ""));
    return formatTokenValue(numberValue);
  };

  return { formatTokenValue, formatDisplayValue };
};

const useLiquidationCalculations = (
  inputValue: string,
  liquidationDiscount: number = 0,
  formatTokenValue: (value: number) => string,
) => {
  const getBonusAmount = () => {
    if (!inputValue || !liquidationDiscount) return "0";
    const currentValue = parseFloat(inputValue.replace(/,/g, ""));
    const bonusAmount = currentValue * (1 + liquidationDiscount / 100);
    return formatTokenValue(bonusAmount);
  };

  const getProfit = () => {
    if (!inputValue || !liquidationDiscount) return "0";
    const baseAmount = parseFloat(inputValue.replace(/,/g, ""));
    const bonusAmount = parseFloat(getBonusAmount().replace(/,/g, ""));
    return formatTokenValue(bonusAmount - baseAmount);
  };

  return { getBonusAmount, getProfit };
};

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
  const { showError, validateInput } = useInputValidation(walletBalance);
  const { formatTokenValue, formatDisplayValue } = useTokenFormatting(ticker);
  const { getBonusAmount, getProfit } = useLiquidationCalculations(
    inputValue,
    liquidationDiscount,
    (value: number) => formatTokenValue(value, liquidationMode),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const formattedValue = formatInputNumber(e.target.value);
    const numberValue = Number(formattedValue.replace(/,/g, ""));

    if (!isNaN(numberValue)) {
      if (validateInput(numberValue)) {
        setInputValue(formattedValue);
      }
    } else if (formattedValue === "") {
      setInputValue("");
    }
  };

  const renderUsdValue = () => {
    const isLiquidationActive =
      liquidationMode && disabled && inputValue && parseFloat(inputValue) !== 0;

    if (isLiquidationActive) {
      const profit = getProfit();
      return (
        <div className={styles.usdValueContainer}>
          <span className={styles.baseUsdValue}>
            ≈{calculateUsdValue(inputValue, tokenToUsdRate)} USD
          </span>
          <span className={styles.usdValue}>
            ≈{calculateUsdValue(getBonusAmount(), tokenToUsdRate)} USD
          </span>
          <span className={styles.profitValue}>
            (+ {calculateUsdValue(profit, tokenToUsdRate)} USD)
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
    const isLiquidationActive =
      liquidationMode && disabled && inputValue && parseFloat(inputValue) !== 0;

    const inputElement = (
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

    if (isLiquidationActive) {
      return (
        <div className={styles.inputWithPrices}>
          <span className={styles.baseAmount}>
            {formatDisplayValue(inputValue)}
          </span>
          {inputElement}
        </div>
      );
    }

    return inputElement;
  };

  const renderTokenInfo = () => (
    <div className={styles.tokenSelector}>
      <Image
        src={`/tokens/${ticker}.svg`}
        height={20}
        width={20}
        alt={ticker}
      />
      <span>{ticker}</span>
    </div>
  );

  const renderWalletInfo = () =>
    !disabled && (
      <div className={styles.walletInfo}>
        <Image src="/icons/wallet.svg" height={14} width={14} alt="Wallet" />
        <span className={styles.balanceAmount}>
          {formatNumberWithCommas(walletBalance)} {ticker}
        </span>
        <span className={styles.separator}>|</span>
        <button className={styles.maxButton} onClick={onMaxClick}>
          Max
        </button>
      </div>
    );

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
          {renderTokenInfo()}
          {renderWalletInfo()}
        </div>
      </div>
    </div>
  );
};

export default InputBox;
