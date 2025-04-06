"use client";
import styles from "./MarketStats.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
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
  isLoading: boolean;
}

const useTokenStats = (
  token: Token,
  prices: PriceData | undefined,
): StatsHookResult => {
  const stats = useProtocolStats(token.ticker.toUpperCase());
  const geckoId = tickerToGeckoMap[token.ticker.toUpperCase()];
  const price = new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0);

  // Consider data loading if stats.data isn't available yet
  const isLoading = !stats.data;

  return { stats, price, isLoading };
};

interface MarketStatsProps {
  tokens: Token[];
  prices: PriceData | undefined;
}

export const MarketStats: React.FC<MarketStatsProps> = ({ tokens, prices }) => {
  let totalCollateral = new Quantity(0n, 12n);
  let totalBorrows = new Quantity(0n, 12n);
  let tvl = new Quantity(0n, 12n);

  // Check if any token's stats are still loading
  let isLoading = false;

  for (const token of tokens) {
    const {
      stats,
      price,
      isLoading: tokenIsLoading,
    } = useTokenStats(token, prices);

    // If any token is loading, set isLoading true
    if (tokenIsLoading) {
      isLoading = true;
    } else if (stats.data) {
      totalCollateral = Quantity.__add(
        totalCollateral,
        Quantity.__mul(stats.data.unLent, price),
      );
      totalBorrows = Quantity.__add(
        totalBorrows,
        Quantity.__mul(stats.data.borrows, price),
      );
      tvl = Quantity.__add(totalCollateral, totalBorrows);
    }
  }

  // Also consider loading if prices aren't available yet
  if (!prices) {
    isLoading = true;
  }

  // Render skeleton when loading
  if (isLoading) {
    return (
      <div className={styles.marketStats}>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>TVL</p>
        </div>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>Available</p>
        </div>
        <div className={styles.marketStat}>
          <SkeletonLoading className="h-8 w-28 mb-2" />
          <p className={styles.marketStatTitle}>Borrowed</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marketStats}>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(tvl)}</p>
        <p className={styles.marketStatTitle}>TVL</p>
      </div>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(totalCollateral)}</p>
        <p className={styles.marketStatTitle}>Available</p>
      </div>
      <div className={styles.marketStat}>
        <p className={styles.marketStatValue}>${formatTMB(totalBorrows)}</p>
        <p className={styles.marketStatTitle}>Borrowed</p>
      </div>
    </div>
  );
};
