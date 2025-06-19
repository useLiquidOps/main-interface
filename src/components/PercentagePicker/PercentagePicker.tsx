"use client";
import React from "react";
import styles from "./PercentagePicker.module.css";
import { Quantity } from "ao-tokens";

interface PercentagePickerProps {
  mode: "withdraw" | "repay";
  selectedPercentage: number | null;
  currentPercentage: number;
  onPercentageClick: (percentage: number) => void;
  walletBalance: Quantity;
}

const PercentagePicker: React.FC<PercentagePickerProps> = ({
  mode,
  selectedPercentage,
  currentPercentage,
  onPercentageClick,
  walletBalance,
}) => {
  const percentageOptions =
    mode === "withdraw" ? [5, 10, 25, 50, 75, 100] : [10, 25, 50, 75, 100];

  const formatPercentage = (value: number) => {
    if (value >= 1) {
      return value.toFixed(2).replace(/\.00$/, "");
    }
    return value.toFixed(2);
  };

  return (
    <>
      <div className={styles.statusSection}>
        <div className={styles.statusBarContainer}>
          <div
            className={styles.statusBar}
            style={{ width: `${currentPercentage}%` }}
          />
        </div>
        <span className={styles.statusPercentage}>
          {formatPercentage(currentPercentage)}%
        </span>
      </div>

      <div className={styles.percentageButtonsContainer}>
        {percentageOptions.map((percentage) => (
          <button
            key={percentage}
            className={`${styles.percentageButton} ${
              selectedPercentage === percentage ? styles.selected : ""
            }`}
            onClick={() => onPercentageClick(percentage)}
            disabled={!walletBalance}
          >
            {percentage}%
          </button>
        ))}
      </div>
    </>
  );
};

export default PercentagePicker;
