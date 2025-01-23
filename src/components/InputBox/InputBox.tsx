"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./InputBox.module.css";
import { formatInputNumber, calculateUsdValue } from "../utils/utils";
import { formatTMB } from "../utils/utils";
import { Quantity } from "ao-tokens";

interface InputBoxProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  ticker: string;
  tokenPrice: Quantity;
  denomination: bigint;
  walletBalance: Quantity;
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

const useInputValidation = (walletBalance: Quantity) => {
  const [showError, setShowError] = useState(false);

  const validateInput = (numberValue: Quantity) => {
    if (Quantity.lt(walletBalance, numberValue)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 820);
      return false;
    }
    return true;
  };

  return { showError, validateInput };
};

const useTokenFormatting = (ticker: string) => {
  const formatTokenValue = (value: Quantity, isLiquidationMode = false) => {
    if (value.raw === 0n && isLiquidationMode) return "0";
    const decimals = DECIMAL_PLACES[ticker] || 2;
    return value.toLocaleString("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    } as BigIntToLocaleStringOptions);
  };

  const formatDisplayValue = (value: string, denomination: bigint) => {
    if (!value) return value;
    return formatTokenValue(new Quantity(0n, denomination).fromString(value));
  };

  return { formatTokenValue, formatDisplayValue };
};

const useLiquidationCalculations = (
  inputValue: string,
  liquidationDiscount: number = 0,
  formatTokenValue: (value: Quantity) => string,
  denomination: bigint,
) => {
  const getBonusAmount = () => {
    if (!inputValue || !liquidationDiscount) return "0";
    const currentValue = new Quantity(0n, denomination).fromString(inputValue);
    const bonusAmount = Quantity.__mul(
      currentValue,
      new Quantity(0n, denomination).fromNumber(1 + liquidationDiscount / 100),
    );
    return formatTokenValue(bonusAmount);
  };

  const getProfit = () => {
    if (!inputValue || !liquidationDiscount) return "0";
    const baseAmount = new Quantity(0n, denomination).fromString(inputValue);
    const bonusAmount = new Quantity(0n, denomination).fromString(
      getBonusAmount(),
    );
    return formatTokenValue(Quantity.__sub(bonusAmount, baseAmount));
  };

  return { getBonusAmount, getProfit };
};

const InputBox: React.FC<InputBoxProps> = ({
  inputValue,
  setInputValue,
  isFocused,
  setIsFocused,
  ticker,
  tokenPrice,
  walletBalance,
  onMaxClick,
  disabled = false,
  liquidationMode = false,
  liquidationDiscount = 0,
  denomination,
}) => {
  const { showError, validateInput } = useInputValidation(walletBalance);
  const { formatTokenValue, formatDisplayValue } = useTokenFormatting(ticker);
  const { getBonusAmount, getProfit } = useLiquidationCalculations(
    inputValue,
    liquidationDiscount,
    (value: Quantity) => formatTokenValue(value, liquidationMode),
    denomination,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const formattedValue = formatInputNumber(e.target.value);
    const numberValue = Number(formattedValue.replace(/,/g, ""));

    if (!isNaN(numberValue)) {
      if (
        validateInput(new Quantity(0n, denomination).fromString(formattedValue))
      ) {
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
            ≈{calculateUsdValue(inputValue, tokenPrice)} USD
          </span>
          <span className={styles.usdValue}>
            ≈{calculateUsdValue(getBonusAmount(), tokenPrice)} USD
          </span>
          <span className={styles.profitValue}>
            (+ {calculateUsdValue(profit, tokenPrice)} USD)
          </span>
        </div>
      );
    }

    return (
      <p className={styles.usdValue}>
        ≈{calculateUsdValue(inputValue, tokenPrice)} USD
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
            ? formatDisplayValue(getBonusAmount(), denomination)
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
            {formatDisplayValue(inputValue, denomination)}
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
          {Quantity.eq(walletBalance, new Quantity(0n, denomination))
            ? "0.00"
            : formatTMB(walletBalance)}{" "}
          {ticker}
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
