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

interface TokenStats {
  ticker: string;
  tvl: Quantity;
  collateral: Quantity;
  borrows: Quantity;
  color: string;
  deprecated?: boolean;
}

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
  const safeTokens = Array.isArray(tokens)
    ? tokens.filter((token) => token && token.ticker)
    : [];

  const warStats = useProtocolStats("WAR");
  const wusdcStats = useProtocolStats("WUSDC");
  const wusdtStats = useProtocolStats("WUSDT");
  const wethStats = useProtocolStats("WETH");
  const usdaStats = useProtocolStats("USDA");
  const varStats = useProtocolStats("VAR");
  const vusdcStats = useProtocolStats("VUSDC");

  // Map the stats to the tokens
  // Note: remember to also update the variable at the bottom of the page
  const statsMap = {
    WAR: warStats,
    WUSDC: wusdcStats,
    WUSDT: wusdtStats,
    WETH: wethStats,
    USDA: usdaStats,
    VAR: varStats,
    VUSDC: vusdcStats,
  };

  // Calculate the totals and token stats
  const { totalCollateral, totalBorrows, tvl, isLoading, tokenStatsArray } =
    useMemo(() => {
      let totalCollateral = new Quantity(0n, 12n);
      let totalBorrows = new Quantity(0n, 12n);
      let tvl = new Quantity(0n, 12n);
      const tokenStatsArray: TokenStats[] = [];
      let isLoading = false;

      // Process each token in our safe tokens list
      safeTokens.forEach((token) => {
        const stats =
          statsMap[token.ticker.toUpperCase() as keyof typeof statsMap];
        const geckoId = tickerToGeckoMap[token.ticker.toUpperCase()];
        const price = new Quantity(0n, 12n).fromNumber(
          prices?.[geckoId]?.usd ?? 0,
        );

        if (!stats || stats.isLoading || !stats.data) {
          isLoading = true;
          return;
        }

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
    }, [
      safeTokens,
      prices,
      showDeprecated,
      warStats,
      wusdcStats,
      wusdtStats,
      wethStats,
      usdaStats,
      varStats,
      vusdcStats,
    ]);

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
