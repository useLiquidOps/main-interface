"use client";
import React from "react";
import styles from "./PercentagePicker.module.css";

interface PercentagePickerProps {
  mode: "withdraw" | "repay";
  selectedPercentage: number | null;
  currentPercentage: number;
  onPercentageClick: (percentage: number) => void;
}

const PercentagePicker: React.FC<PercentagePickerProps> = ({
  mode,
  selectedPercentage,
  currentPercentage,
  onPercentageClick,
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
          >
            {percentage}%
          </button>
        ))}
        {mode === "repay" && (
          <button className={styles.percentageButton}>Interest</button>
        )}
      </div>
    </>
  );
};

export default PercentagePicker;
