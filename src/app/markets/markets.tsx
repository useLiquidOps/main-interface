"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";
import Image from "next/image";
import Link from "next/link";
import { tokens, headerTokensData } from "../data";
import { useProtocolStats } from "@/hooks/useProtocolStats";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { formatTMB } from "@/components/utils/utils";

const Markets = () => {
  const statsQueries = tokens.map((token) => ({
    symbol: token.symbol,
    stats: useProtocolStats(token.symbol.toUpperCase()),
    icon: token.imagePath,
    headerData: headerTokensData.find((h) => h.ticker === token.symbol),
    price: useTokenPrice(token.symbol.toUpperCase()),
  }));

  const calculateTotals = () => {
    return statsQueries.reduce(
      (acc, { stats, price }) => {
        if (stats.isLoading || !stats.data) return acc;

        const tokenPrice = price?.price || 0;
        const data = stats.data;

        return {
          liquidOpsTVL:
            acc.liquidOpsTVL + Number(data.protocolBalance) * tokenPrice,
          totalCollateral: acc.totalCollateral + Number(data.unLent),
          totalBorrows: acc.totalBorrows + Number(data.borrows),
        };
      },
      {
        liquidOpsTVL: 0,
        totalCollateral: 0,
        totalBorrows: 0,
      },
    );
  };

  const { liquidOpsTVL, totalCollateral, totalBorrows } = calculateTotals();

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.marketStats}>
            <div className={styles.marketStat}>
              <p className={styles.marketStatValue}>
                ${formatTMB(liquidOpsTVL)}
              </p>
              <p className={styles.marketStatTitle}>LiquidOps TVL</p>
            </div>
            <div className={styles.marketStat}>
              <p className={styles.marketStatValue}>
                ${formatTMB(totalCollateral)}
              </p>
              <p className={styles.marketStatTitle}>Total collateral</p>
            </div>
            <div className={styles.marketStat}>
              <p className={styles.marketStatValue}>
                ${formatTMB(totalBorrows)}
              </p>
              <p className={styles.marketStatTitle}>Total borrows</p>
            </div>
          </div>
          <div className={styles.marketsList}>
            {statsQueries.map(({ symbol, stats, icon, headerData, price }) => {
              const isLoading = stats.isLoading || !stats.data || !headerData;
              const data = isLoading
                ? {
                    apr: 0,
                    protocolBalance: 0,
                    unLent: "0",
                    borrows: "0",
                    utilizationRate: 0,
                  }
                : stats.data;

              const tokenPrice = price?.price || 0;

              return (
                <Link
                  href={`/${symbol}`}
                  key={symbol}
                  className={styles.marketLink}
                >
                  <div className={styles.marketRowWrapper}>
                    <div className={styles.marketRow}>
                      <div className={styles.assetInfo}>
                        <div className={styles.iconWrapper}>
                          <Image
                            src={icon}
                            alt={headerData?.name || symbol}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className={styles.nameSymbol}>
                          <h2 className={styles.name}>
                            {headerData?.name || symbol}
                          </h2>
                          <p className={styles.symbol}>{symbol}</p>
                        </div>
                      </div>

                      <div className={styles.aprInfo}>
                        <div className={styles.aprValue}>
                          <p className={styles.apr}>{data.apr.toFixed(2)}%</p>
                          <Image
                            src={
                              isLoading
                                ? "/icons/APRUp.svg"
                                : stats.data.percentChange.outcome
                                  ? "/icons/APRUp.svg"
                                  : "/icons/APRDown.svg"
                            }
                            alt="APR trend"
                            width={16}
                            height={16}
                          />
                        </div>
                        <p className={styles.aprLabel}>APY</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          $
                          {formatTMB(Number(data.protocolBalance) * tokenPrice)}{" "}
                        </p>
                        <p className={styles.metricLabel}>TVL</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          ${formatTMB(Number(data.unLent))}
                        </p>
                        <p className={styles.metricLabel}>Collateral</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          ${formatTMB(Number(data.borrows))}
                        </p>
                        <p className={styles.metricLabel}>Borrowed</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          {data.utilizationRate.toFixed(2)}%
                        </p>
                        <p className={styles.metricLabel}>Utilization</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
