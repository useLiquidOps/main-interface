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

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.marketsList}>
            {statsQueries.map(({ symbol, stats, icon, headerData, price }) => {
              if (stats.isLoading) return null;
              if (!stats.data || !headerData) return null;

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
                            alt={headerData.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className={styles.nameSymbol}>
                          <h2 className={styles.name}>{headerData.name}</h2>
                          <p className={styles.symbol}>{symbol}</p>
                        </div>
                      </div>

                      <div className={styles.aprInfo}>
                        <div className={styles.aprValue}>
                          <p className={styles.apr}>{stats.data.apr}%</p>
                          <Image
                            src={
                              headerData.percentChange.outcome
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
                          {formatTMB(
                            Number(stats.data.protocolBalance) * price.price,
                          )}{" "}
                          USD
                        </p>
                        <p className={styles.metricLabel}>
                          {formatTMB(Number(stats.data.protocolBalance))}{" "}
                          {symbol} TVL
                        </p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          {formatTMB(Number(stats.data.available))} USD
                        </p>
                        <p className={styles.metricLabel}>Available</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          {formatTMB(Number(stats.data.lent))} USD
                        </p>
                        <p className={styles.metricLabel}>Borrowed</p>
                      </div>

                      <div className={styles.metricBox}>
                        <p className={styles.metricValue}>
                          {stats.data.utilizationRate.toFixed(2)}%
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
