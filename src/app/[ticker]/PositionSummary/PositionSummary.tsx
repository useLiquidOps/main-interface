import React from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { tokens, headerTokensData } from "@/app/data";

interface PositionData {
  collateralValue: number;
  borrowCapacity: number;
  liquidationPoint: number;
  availableToBorrow: number;
}

const PositionSummary: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const positionData: PositionData = {
    collateralValue: 9413.37,
    borrowCapacity: 4813.93,
    liquidationPoint: 1470.5,
    availableToBorrow: 2406.51,
  };

  const getProgressWidth = (value: number): string => {
    const maxBorrow = positionData.collateralValue * 0.75;
    const currentBorrow = maxBorrow - positionData.availableToBorrow;
    return `${(currentBorrow / maxBorrow) * 100}%`;
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
              <p
                className={styles.value}
              >{`${formatTMB(positionData.borrowCapacity)} ${tokenData.ticker}`}</p>
            </div>
            <div className={styles.progressContainer}>
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
        </div>
      </div>
    </div>
  );
};

export default PositionSummary;
