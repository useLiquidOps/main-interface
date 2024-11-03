import React from "react";
import styles from "./Market.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { headerTokensData } from "@/app/data";

interface MarketData {
  totalSupply: number;
  availableCollateral: number;
  totalBorrow: number;
}

const Market: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const marketData: MarketData = {
    totalSupply: 676500000,
    availableCollateral: 507370000,
    totalBorrow: 169120000,
  };

  const getProgressWidth = (value: number): string => {
    return `${(value / marketData.totalSupply) * 100}%`;
  };

  if (!tokenData) {
    return null;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>{tokenData.name} Market</h2>

        <div className={styles.metricsContainer}>
          <div className={styles.metric}>
            <p className={styles.label}>Total Supply</p>
            <p
              className={styles.value}
            >{`${formatTMB(marketData.totalSupply)} ${tokenData.ticker}`}</p>
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Available Collateral</p>
            <div className={styles.valueWithIndicator}>
              <p
                className={styles.value}
              >{`${formatTMB(marketData.availableCollateral)} ${tokenData.ticker}`}</p>
              <div className={styles.indicatorGreen}></div>
            </div>
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Total Borrow</p>
            <div className={styles.valueWithIndicator}>
              <p
                className={styles.value}
              >{`${formatTMB(marketData.totalBorrow)} ${tokenData.ticker}`}</p>
              <div className={styles.indicatorBlue}></div>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressGreen}
              style={{
                width: getProgressWidth(marketData.availableCollateral),
              }}
            />
            <div
              className={styles.progressBlue}
              style={{ width: getProgressWidth(marketData.totalBorrow) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
