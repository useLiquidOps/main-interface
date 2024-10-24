import React from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";

interface PositionData {
  collateralValue: number;
  borrowCapacity: number;
  liquidationPoint: number;
  availableToBorrow: number;
}

interface Token {
  symbol: string;
  imagePath: string;
}

const tokens: Token[] = [
  { symbol: "DAI", imagePath: "/tokens/dai.svg" },
  { symbol: "stETH", imagePath: "/tokens/stETH.svg" },
  { symbol: "qAR", imagePath: "/tokens/qAR.svg" },
];

const PositionSummary: React.FC = () => {
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
              >{`${formatTMB(positionData.collateralValue)} qAR`}</p>
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
              >{`${formatTMB(positionData.borrowCapacity)} qAR`}</p>
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
              >{`${formatTMB(positionData.liquidationPoint)} qAR`}</p>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Available to Borrow</p>
              <p
                className={styles.value}
              >{`${formatTMB(positionData.availableToBorrow)} qAR`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionSummary;
