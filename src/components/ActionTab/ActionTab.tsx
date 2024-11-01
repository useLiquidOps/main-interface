import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton/SubmitButton";
import styles from "./ActionTab.module.css";
import {
  formatInputNumber,
  calculateUsdValue,
  formatMaxAmount,
  formatNumberWithCommas,
} from "../utils/utils";

interface ActionTabProps {
  ticker: string;
  mode: "supply" | "borrow";
}

const ActionTab: React.FC<ActionTabProps> = ({ ticker, mode }) => {
  // TODO: get real variables
  const tokenToUsdRate = 15;
  const walletBalance = 4819.93;
  const utilizationRate = 0.75;
  const estimatedApy = 4.33;
  const networkFee = 0.000001;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const calculateMaxAmount = () => {
    if (mode === "supply") {
      return walletBalance;
    } else {
      return walletBalance * utilizationRate;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputNumber(e.target.value);
    setInputValue(formattedValue);
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(formatMaxAmount(maxAmount));
  };

  return (
    <div className={styles.actionTab}>
      <p className={styles.borrowTitle}>
        {mode === "supply" ? "Deposit" : "Borrow"}
      </p>

      <div
        className={`${styles.inputContainer} ${isFocused ? styles.focused : ""}`}
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
              <button className={styles.maxButton} onClick={handleMaxClick}>
                Max
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.infoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              {mode === "supply" ? "Supply" : "Borrow"} APY: {estimatedApy}%
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              Network fee: {networkFee} AO
            </span>
          </div>
        </div>
        <Image
          src="/icons/customise.svg"
          height={14}
          width={14}
          alt="Customise"
          className={styles.customiseIcon}
        />
      </div>

      <SubmitButton />
    </div>
  );
};

export default ActionTab;
