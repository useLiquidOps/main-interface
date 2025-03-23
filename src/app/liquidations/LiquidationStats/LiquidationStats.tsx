import React from "react";
import styles from "./LiquidationStats.module.css";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

interface LiquidationStatsProps {
  stats: {
    availableLiquidations: Quantity;
    totalProfit: Quantity;
    markets: Set<string>;
  };
}

const LiquidationStats: React.FC<LiquidationStatsProps> = ({ stats }) => {
  // Determine loading state based on data
  const isLoading =
    !stats ||
    !stats.availableLiquidations ||
    !stats.totalProfit ||
    !stats.markets ||
    (stats.availableLiquidations.toNumber() === 0 &&
      stats.totalProfit.toNumber() === 0 &&
      stats.markets.size === 0);

  if (isLoading) {
    return (
      <div className={styles.liquidationStats}>
        <div className={styles.liquidationStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.liquidationStatTitle}>Available liquidations</p>
        </div>
        <div className={styles.liquidationStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.liquidationStatTitle}>Total profit</p>
        </div>
        <div className={styles.liquidationStat}>
          <SkeletonLoading className="h-8 w-16 mb-2" />
          <p className={styles.liquidationStatTitle}>Markets</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.liquidationStats}>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>
          ${formatTMB(stats.availableLiquidations)}
        </p>
        <p className={styles.liquidationStatTitle}>Available liquidations</p>
      </div>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>
          ${formatTMB(stats.totalProfit)}
        </p>
        <p className={styles.liquidationStatTitle}>Total profit</p>
      </div>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>{stats.markets.size}</p>
        <p className={styles.liquidationStatTitle}>Markets</p>
      </div>
    </div>
  );
};

export default LiquidationStats;
