import React from "react";
import styles from "./Market.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { headerTokensData } from "@/app/data";
import Image from "next/image";

const Market: React.FC<{
  ticker: string;
  extraData?: boolean;
}> = ({ ticker, extraData = false }) => {
  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const marketData = {
    totalSupply: 6765000,
    totalSupplyExtraData: 6000,
    availableCollateral: 507370000,
    totalBorrow: 169120000,
    collteralExtraData: 1000,
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
          {extraData && (
            <div className={styles.metric}>
              <p className={styles.label}>APR</p>

              <div className={styles.APRContainer}>
                <div className={styles.flexDisplay}>
                  <p className={styles.value}>{tokenData.APR}%</p>
                  <Image
                    src={
                      tokenData.percentChange.outcome
                        ? "/icons/APRup.svg"
                        : "/icons/APRdown.svg"
                    }
                    alt={
                      tokenData.percentChange.outcome ? "APR Up" : "APR Down"
                    }
                    width={24}
                    height={24}
                  />
                  <p className={styles.extraData}>
                    {tokenData.percentChange.change}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.metric}>
            <p className={styles.label}>Total Supply</p>
            <div className={styles.flexDisplay}>
              <p className={styles.value}>
                {`${formatTMB(marketData.totalSupply)} ${tokenData.ticker}`}
              </p>
              {extraData && (
                <p className={styles.extraData}>
                  +{formatTMB(marketData.totalSupplyExtraData)}{" "}
                  {tokenData.ticker}
                </p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Available Collateral</p>
            <div className={styles.valueWithIndicator}>
              <p className={styles.value}>
                {`${formatTMB(marketData.availableCollateral)} ${tokenData.ticker}`}
              </p>
              <div className={styles.indicatorGreen}></div>
              {extraData && (
                <p className={styles.extraData}>
                  +{formatTMB(marketData.collteralExtraData)} {tokenData.ticker}
                </p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Total Borrow</p>
            <div className={styles.valueWithIndicator}>
              <p className={styles.value}>
                {`${formatTMB(marketData.totalBorrow)} ${tokenData.ticker}`}
              </p>
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
