"use client";
import styles from "./MarketStats.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens-lite";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import PieChart from "@/components/PieChat/PieChart";
import { TOKEN_COLORS } from "@/utils/tokenMappings";

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

interface TokenStats {
  ticker: string;
  tvl: Quantity;
  collateral: Quantity;
  borrows: Quantity;
  color: string;
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

  // Create arrays to store data for each token's stats for pie charts
  const tokenStatsArray: TokenStats[] = [];

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
      const tokenCollateral = Quantity.__mul(stats.data.unLent, price);
      const tokenBorrows = Quantity.__mul(stats.data.borrows, price);
      const tokenTvl = Quantity.__add(tokenCollateral, tokenBorrows);

      // Store token specific values
      tokenStatsArray.push({
        ticker: token.ticker,
        tvl: tokenTvl,
        collateral: tokenCollateral,
        borrows: tokenBorrows,
        color: TOKEN_COLORS[token.ticker.toUpperCase()] || "#808080", // Default gray if no color defined
      });

      // Add to totals
      totalCollateral = Quantity.__add(totalCollateral, tokenCollateral);
      totalBorrows = Quantity.__add(totalBorrows, tokenBorrows);
    }
  }

  // Calculate total TVL as sum of collateral and borrows
  tvl = Quantity.__add(totalCollateral, totalBorrows);

  // Also consider loading if prices aren't available yet
  if (!prices) {
    isLoading = true;
  }

  // Create data for pie charts using collected token stats
  const tvlHoldings = tokenStatsArray.map((token) => ({
    token: token.ticker,
    tokenHex: token.color,
    amount: token.tvl.toNumber(),
  }));

  const availableHoldings = tokenStatsArray.map((token) => ({
    token: token.ticker,
    tokenHex: token.color,
    amount: token.collateral.toNumber(),
  }));

  const borrowedHoldings = tokenStatsArray.map((token) => ({
    token: token.ticker,
    tokenHex: token.color,
    amount: token.borrows.toNumber(),
  }));

  // Render skeleton when loading
  if (isLoading) {
    return (
      <div className={styles.marketStats}>
        <div className={styles.marketContainer}>
          <div className={styles.pieChart}>
            <SkeletonLoading className="h-full w-full rounded-2xl" />
          </div>
          <div className={styles.marketStat}>
            <SkeletonLoading className="h-8 w-28 mb-2" />
            <p className={styles.marketStatTitle}>TVL</p>
          </div>
        </div>

        <div className={styles.marketContainer}>
          <div className={styles.pieChart}>
            <SkeletonLoading className="h-full w-full rounded-2xl" />
          </div>
          <div className={styles.marketStat}>
            <SkeletonLoading className="h-8 w-28 mb-2" />
            <p className={styles.marketStatTitle}>Available</p>
          </div>
        </div>

        <div className={styles.marketContainer}>
          <div className={styles.pieChart}>
            <SkeletonLoading className="h-full w-full rounded-2xl" />
          </div>
          <div className={styles.marketStat}>
            <SkeletonLoading className="h-8 w-28 mb-2" />
            <p className={styles.marketStatTitle}>Borrowed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marketStats}>
      <div className={styles.marketContainer}>
        <div className={styles.pieChart}>
          <PieChart
            data={tvlHoldings.map((holding) => ({
              name: holding.token,
              value: holding.amount,
              color: holding.tokenHex,
            }))}
            height={10}
          />
        </div>
        <div className={styles.marketStat}>
          <p className={styles.marketStatValue}>${formatTMB(tvl)}</p>
          <p className={styles.marketStatTitle}>TVL</p>
        </div>
      </div>

      <div className={styles.marketContainer}>
        <div className={styles.pieChart}>
          <PieChart
            data={availableHoldings.map((holding) => ({
              name: holding.token,
              value: holding.amount,
              color: holding.tokenHex,
            }))}
            height={10}
          />
        </div>
        <div className={styles.marketStat}>
          <p className={styles.marketStatValue}>
            ${formatTMB(totalCollateral)}
          </p>
          <p className={styles.marketStatTitle}>Available</p>
        </div>
      </div>

      <div className={styles.marketContainer}>
        <div className={styles.pieChart}>
          <PieChart
            data={borrowedHoldings.map((holding) => ({
              name: holding.token,
              value: holding.amount,
              color: holding.tokenHex,
            }))}
            height={10}
          />
        </div>
        <div className={styles.marketStat}>
          <p className={styles.marketStatValue}>${formatTMB(totalBorrows)}</p>
          <p className={styles.marketStatTitle}>Borrowed</p>
        </div>
      </div>
    </div>
  );
};
