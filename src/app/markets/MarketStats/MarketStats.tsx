"use client";
import styles from "./MarketStats.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens-lite";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import PieChart from "@/components/PieChat/PieChart";
import { TOKEN_COLORS } from "@/utils/tokenMappings";
import { useMemo } from "react";

interface Token {
  ticker: string;
  name: string;
  icon: string;
  deprecated?: boolean;
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
  deprecated?: boolean;
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
  showDeprecated: boolean;
}

export const MarketStats: React.FC<MarketStatsProps> = ({
  tokens,
  prices,
  showDeprecated,
}) => {
  // Safety check: ensure tokens is always an array
  const safeTokens = Array.isArray(tokens) ? tokens : [];

  // ALWAYS call useTokenStats for ALL tokens to maintain stable hook calls
  const allTokenStats = safeTokens.map((token) => useTokenStats(token, prices));

  // Then filter and calculate based on showDeprecated flag
  const { totalCollateral, totalBorrows, tvl, isLoading, tokenStatsArray } =
    useMemo(() => {
      let totalCollateral = new Quantity(0n, 12n);
      let totalBorrows = new Quantity(0n, 12n);
      let tvl = new Quantity(0n, 12n);
      const tokenStatsArray: TokenStats[] = [];
      let isLoading = false;

      // Process all token stats but only include non-deprecated ones in calculations if showDeprecated is false
      allTokenStats.forEach((tokenStats, index) => {
        const token = safeTokens[index];
        if (!token) return; // Safety check

        const { stats, price, isLoading: tokenIsLoading } = tokenStats;

        // If any token is loading, set isLoading true
        if (tokenIsLoading) {
          isLoading = true;
        } else if (stats.data) {
          const tokenCollateral = Quantity.__mul(stats.data.unLent, price);
          const tokenBorrows = Quantity.__mul(stats.data.borrows, price);
          const tokenTvl = Quantity.__add(tokenCollateral, tokenBorrows);

          // Always store the stats for all tokens
          const tokenStat: TokenStats = {
            ticker: token.ticker,
            tvl: tokenTvl,
            collateral: tokenCollateral,
            borrows: tokenBorrows,
            color: TOKEN_COLORS[token.ticker.toUpperCase()] || "#808080",
            deprecated: token.deprecated,
          };

          tokenStatsArray.push(tokenStat);

          // Only add to totals if we should show this token
          if (showDeprecated || !token.deprecated) {
            totalCollateral = Quantity.__add(totalCollateral, tokenCollateral);
            totalBorrows = Quantity.__add(totalBorrows, tokenBorrows);
          }
        }
      });

      // Calculate total TVL as sum of collateral and borrows
      tvl = Quantity.__add(totalCollateral, totalBorrows);

      // Also consider loading if prices aren't available yet
      if (!prices) {
        isLoading = true;
      }

      return {
        totalCollateral,
        totalBorrows,
        tvl,
        isLoading,
        tokenStatsArray,
      };
    }, [allTokenStats, safeTokens, prices, showDeprecated]);

  // Filter token stats for pie charts based on showDeprecated flag
  const visibleTokenStats = useMemo(() => {
    return showDeprecated
      ? tokenStatsArray
      : tokenStatsArray.filter((token) => !token.deprecated);
  }, [tokenStatsArray, showDeprecated]);

  // Create data for pie charts using filtered token stats
  const tvlHoldings = visibleTokenStats.map((token) => ({
    token: token.ticker,
    tokenHex: token.color,
    amount: token.tvl.toNumber(),
  }));

  const availableHoldings = visibleTokenStats.map((token) => ({
    token: token.ticker,
    tokenHex: token.color,
    amount: token.collateral.toNumber(),
  }));

  const borrowedHoldings = visibleTokenStats.map((token) => ({
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
