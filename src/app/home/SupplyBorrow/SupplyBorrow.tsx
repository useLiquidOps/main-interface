import React, { useState } from "react";
import styles from "./SupplyBorrow.module.css";

interface SupplyBorrowProps {}

const SupplyBorrow: React.FC<SupplyBorrowProps> = () => {
  const suppliedAmount = 20230;
  const borrowedAmount = 10230;
  const supplyPercentage = 70;
  const borrowPercentage = 30;

  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const getProgressWidth = (value: number): string => {
    return `${value}%`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const totalWidth = rect.width;

    const totalValue = supplyPercentage + borrowPercentage;
    const suppliedWidth = (supplyPercentage / totalValue) * totalWidth;

    let tooltipText = "";
    if (x <= suppliedWidth) {
      tooltipText = `Available Lent Tokens: ${supplyPercentage.toFixed(1)}%`;
    } else {
      tooltipText = `Total Borrows: ${borrowPercentage.toFixed(1)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(!!tooltipText);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.lendVsBorrows}>
          <div className={styles.lendBorrow}>
            <p className={styles.amount}>${suppliedAmount.toLocaleString()}</p>
            <div className={styles.card2TitleContainer}>
              <div className={styles.indicatorGreen}></div>
              <p>Supplied</p>
            </div>
          </div>
          <div className={styles.lendBorrow}>
            <p className={styles.amount}>${borrowedAmount.toLocaleString()}</p>
            <div className={styles.card2TitleContainer}>
              <div className={styles.indicatorBlue}></div>
              <p>Borrowed</p>
            </div>
          </div>
        </div>

        <div
          className={styles.progressBar}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={styles.progressGreen}
            style={{
              width: getProgressWidth(supplyPercentage),
            }}
          />
          <div
            className={styles.progressBlue}
            style={{
              width: getProgressWidth(borrowPercentage),
            }}
          />
        </div>
      </div>

      {showTooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 25}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </>
  );
};

export default SupplyBorrow;
