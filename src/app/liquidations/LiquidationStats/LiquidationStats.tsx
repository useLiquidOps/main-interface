import React from 'react';
import styles from './LiquidationStats.module.css';
import { formatTMB } from '@/components/utils/utils';
import { Quantity } from 'ao-tokens';

interface LiquidationStatsProps {
  stats: {
    availableLiquidations: Quantity;
    totalProfit: Quantity;
    markets: Set<string>;
  };
}

const LiquidationStats: React.FC<LiquidationStatsProps> = ({ stats }) => {
  return (
    <div className={styles.liquidationStats}>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>
          ${formatTMB(stats.availableLiquidations)}
        </p>
        <p className={styles.liquidationStatTitle}>
          Available liquidations
        </p>
      </div>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>
          ${formatTMB(stats.totalProfit)}
        </p>
        <p className={styles.liquidationStatTitle}>Total profit</p>
      </div>
      <div className={styles.liquidationStat}>
        <p className={styles.liquidationStatValue}>
          {stats.markets.size}
        </p>
        <p className={styles.liquidationStatTitle}>Markets</p>
      </div>
    </div>
  );
};

export default LiquidationStats;