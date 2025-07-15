import React from "react";
import styles from "./NetWorth.module.css";
import Image from "next/image";
import PieChart from "@/components/PieChat/PieChart";
import { useGlobalPosition } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { Quantity } from "ao-tokens-lite";
import { formatTMB } from "@/components/utils/utils";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { TOKEN_COLORS } from "@/utils/tokenMappings";
import { GlobalPositionResult } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { getBaseDenomination } from "@/utils/LiquidOps/getBaseDenomination";

const NetWorth: React.FC = () => {
  const { data: tokenPrices } = usePrices();
  const isLoadingPrices = !tokenPrices;
  const { data: globalPosition } = useGlobalPosition();
  const isLoadingPositions = !globalPosition;

  const netWorth = globalPosition
    ? formatTMB(
        Quantity.__add(
          globalPosition.collateralValueUSD,
          globalPosition.borrowCapacityUSD,
        ),
      )
    : 0;

  const userTokenHoldings = globalPosition
    ? createUserTokenHoldings(globalPosition, tokenPrices)
    : [];

  const netAPY = 11.1;

  return (
    <div className={styles.card}>
      <div className={styles.pieChart}>
        {isLoadingPositions ? (
          <SkeletonLoading className="h-full w-full rounded-2xl" />
        ) : (
          <PieChart
            data={userTokenHoldings.map((token) => ({
              name: token.token,
              value: token.amount,
              color: token.tokenHex,
            }))}
            height={10}
          />
        )}
      </div>

      <div className={styles.balanceContainer}>
        <p className={styles.balanceTitle}>Net worth</p>
        {isLoadingPositions ? (
          <SkeletonLoading style={{ width: "100%", height: "35px" }} />
        ) : (
          <h1 className={styles.balance}>${netWorth}</h1>
        )}

        <div className={styles.netAPYContainer}>
          <p className={styles.apyTitle}>Net APY</p>

          {isLoadingPositions || isLoadingPrices ? (
            <SkeletonLoading style={{ width: "25px", height: "10px" }} />
          ) : (
            <div className={styles.netAPY}>
              <Image
                src={`/icons/${netAPY >= 0 ? "APYStars" : "APRStars"}.svg`}
                alt={`Stars icon`}
                width={10}
                height={10}
              />
              <p className={styles.apyTitle}>{netAPY}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetWorth;

interface TokenHolding {
  token: string;
  tokenHex: string;
  amount: number;
}

function createUserTokenHoldings(
  globalPosition: GlobalPositionResult,
  tokenPrices: any,
): TokenHolding[] {
  const userTokenHoldings: TokenHolding[] = [];

  Object.entries(globalPosition.tokenPositions).forEach(([token, position]) => {
    const ticker = position.ticker;

    const denomination = getBaseDenomination(ticker.toUpperCase());

    const amount = Quantity.__add(
      position.collateralization,
      position.borrowBalance,
    );

    const geckoID = tickerToGeckoMap[ticker.toUpperCase()];
    const tokenPrice = new Quantity(0n, 12n).fromNumber(
      tokenPrices?.[geckoID]?.usd ?? 0,
    );

    if (amount > new Quantity(0n, denomination)) {
      userTokenHoldings.push({
        token: ticker,
        tokenHex: TOKEN_COLORS[ticker.toUpperCase()],
        amount: Number(Quantity.__mul(amount, tokenPrice)),
      });
    }
  });

  return userTokenHoldings;
}
