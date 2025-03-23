"use client";
import styles from "./MarketStats.module.css";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { tickerToGeckoMap } from "@/hooks/data/useTokenPrice";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

interface Token {
  ticker: string;
  name: string;
  icon: string;
}

interface PriceData {
  [geckoId: string]: {
    usd: number;
  };
}

interface StatsHookResult {
  stats: ReturnType<typeof useProtocolStats>;
  price: Quantity;
}

const useTokenStats = (
  token: Token,
  prices: PriceData | undefined,
): StatsHookResult => {
  const stats = useProtocolStats(token.ticker.toUpperCase());
  const geckoId = tickerToGeckoMap[token.ticker.toUpperCase()];
  const price = new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0);
  return { stats, price };
};

interface MarketStatsProps {
  tokens: Token[];
  prices: PriceData | undefined;
}

export const MarketStats: React.FC<MarketStatsProps> = ({ tokens, prices }) => {
  // Track loading state
  let isLoading = false;
  let totalTVL = new Quantity(0n, 12n);
  let totalCollateral = new Quantity(0n, 12n);
  let totalBorrows = new Quantity(0n, 12n);

  // Check if any token's stats are still loading
  tokens.forEach((token) => {
    const { stats, price } = useTokenStats(token, prices);

    // Only set isLoading if stats are actually loading
    if (stats.isLoading) {
      isLoading = true;
    } else if (stats.data) {
      totalTVL = Quantity.__add(
        totalTVL,
        Quantity.__mul(stats.data.protocolBalance, price),
      );
      totalCollateral = Quantity.__add(
        totalCollateral,
        Quantity.__mul(stats.data.unLent, price),
      );
      totalBorrows = Quantity.__add(
        totalBorrows,
        Quantity.__mul(stats.data.borrows, price),
      );
    }
  });

  // Render skeleton only for values if loading
  if (isLoading) {
    return (
      <div className={styles.marketStats}>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>LiquidOps TVL</p>
        </div>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>Total collateral</p>
        </div>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>Total borrows</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marketStats}>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(totalTVL)}</p>
        <p className={styles.marketStatTitle}>LiquidOps TVL</p>
      </div>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(totalCollateral)}</p>
        <p className={styles.marketStatTitle}>Total collateral</p>
      </div>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(totalBorrows)}</p>
        <p className={styles.marketStatTitle}>Total borrows</p>
      </div>
    </div>
  );
};
