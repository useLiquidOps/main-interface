import React, { useState } from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { tokens, headerTokensData } from "@/app/data";

interface PositionData {
  collateralValue: number;
  borrowCapacity: number;
  liquidationPoint: number;
  availableToBorrow: number;
  liquidationRisk?: number;
}

const PositionSummary: React.FC<{
  ticker: string;
  extraData?: boolean;
}> = ({ ticker, extraData = false }) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const positionData: PositionData = {
    collateralValue: 9413.37,
    borrowCapacity: 4813.93,
    liquidationPoint: 1470.5,
    availableToBorrow: 2406.51,
    liquidationRisk: 44,
  };

  const getProgressWidth = (value: number): string => {
    const maxBorrow = positionData.collateralValue * 0.75;
    const currentBorrow = maxBorrow - positionData.availableToBorrow;
    return `${(currentBorrow / maxBorrow) * 100}%`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    const maxBorrow = positionData.collateralValue * 0.75;
    const currentBorrow = maxBorrow - positionData.availableToBorrow;
    const currentBorrowPercentage = (currentBorrow / maxBorrow) * 100;
    
    let tooltipText = '';
    if (percentage <= currentBorrowPercentage) {
      tooltipText = `Current Borrow: ${currentBorrowPercentage.toFixed(1)}%`;
    } else {
      tooltipText = `Available to Borrow: ${(100 - currentBorrowPercentage).toFixed(1)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  if (!tokenData) {
    return null;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>Position summary</h2>

        <div className={styles.metricsContainer}>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Collateral Value</p>
              <p
                className={styles.value}
              >{`${formatTMB(positionData.collateralValue)} ${tokenData.ticker}`}</p>
            </div>
            <div className={styles.tokens}>
              {tokens.map((token, index) => (
                <img
                  key={token.symbol}
                  src={token.imagePath}
                  alt={token.symbol}
                  className={styles.token}
                  style={{ zIndex: tokens.length - index }}
                />
              ))}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Borrow Capacity</p>
              <div className={styles.valueContainer}>
                <p
                  className={styles.value}
                >{`${formatTMB(positionData.borrowCapacity)} ${tokenData.ticker}`}</p>
                {extraData && <div className={styles.redDot} />}
              </div>
            </div>
            <div 
              className={styles.progressContainer}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={styles.progressPrimary}
                style={{ width: getProgressWidth(positionData.borrowCapacity) }}
              />
              <div className={styles.progressBackground} />
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Liquidation Point</p>
              <p
                className={styles.value}
              >{`${formatTMB(positionData.liquidationPoint)} ${tokenData.ticker}`}</p>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Available to Borrow</p>
              <p
                className={styles.value}
              >{`${formatTMB(positionData.availableToBorrow)} ${tokenData.ticker}`}</p>
            </div>
          </div>

          {extraData && positionData.liquidationRisk && (
            <div className={styles.metric}>
              <div className={styles.metricInfo}>
                <p className={styles.label}>Liquidation Risk</p>
                <div className={styles.riskContainer}>
                  <p className={styles.value}>{`${positionData.liquidationRisk}%`}</p>
                  <div className={styles.riskProgressContainer}>
                    <div
                      className={styles.riskProgress}
                      style={{ width: `${positionData.liquidationRisk}%` }}
                    />
                    <div className={styles.riskIndicator} style={{ left: `${positionData.liquidationRisk}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default PositionSummary;