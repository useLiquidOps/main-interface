import styles from "./FairLaunchRow.module.css";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { FairLaunchStrategy } from "../getFairlaunchAPY";
import { Prices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { useFairLaunchAPY } from "@/hooks/strategies/useFairLaunchAPY";
import { getMaxReward } from "./getMaxReward";

interface FairLaunchRowProps {
  strategy: FairLaunchStrategy;
  prices: Prices | undefined;
}

export const FairLaunchRow: React.FC<FairLaunchRowProps> = ({
  strategy,
  prices,
}) => {
  const depositTokenStats = useProtocolStats(
    strategy.depositToken.ticker.toUpperCase(),
  );

  const arTokenGeckoID =
    tickerToGeckoMap[strategy.borrowToken.ticker.toUpperCase()];
  const arTokenPrice = prices?.[arTokenGeckoID]?.usd ?? 0;

  const arTokenStats = useProtocolStats(
    strategy.borrowToken.ticker.toUpperCase(),
  );

  const rewardTokenGeckoID =
    tickerToGeckoMap[strategy.rewardToken.ticker.toUpperCase()];
  let rewardTokenPrice: number | undefined;
  if (rewardTokenGeckoID === undefined) {
    rewardTokenPrice = undefined;
  } else {
    rewardTokenPrice = prices?.[rewardTokenGeckoID]?.usd ?? 0;
  }

  const fairLaunchPerAO = useFairLaunchAPY(strategy.fairLaunchID).data;

  const maxReward = getMaxReward({
    depositTokenStats,
    strategy,
    rewardTokenPrice,
    arTokenPrice,
    fairLaunchPerAO: fairLaunchPerAO || 0,
    arTokenStats,
  });

  const isLoadingArTokenStats = arTokenStats.isLoading || !arTokenStats.data;

  return (
    <div className={styles.fairLaunchRowWrapper}>
      <div className={styles.fairLaunchRow}>
        {/* Collateral asset info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${strategy.depositToken.ticker}.svg`}
              alt={strategy.depositToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{strategy.depositToken.name}</h2>
            <p className={styles.symbol}>{strategy.depositToken.ticker}</p>
          </div>
        </div>

        {/* Borrow asset info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${strategy.borrowToken.ticker}.svg`}
              alt={strategy.borrowToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{strategy.borrowToken.name}</h2>
            <p className={styles.symbol}>{strategy.borrowToken.ticker}</p>
          </div>
        </div>

        {/* Available */}
        <div className={styles.metricBox}>
          {isLoadingArTokenStats ? (
            <>
              <SkeletonLoading style={{ width: "90px", height: "14px" }} />
              <SkeletonLoading style={{ width: "60px", height: "13px" }} />
            </>
          ) : (
            <>
              <p className={styles.metricValue}>
                {formatTMB(arTokenStats.data.unLent)}{" "}
                {strategy.borrowToken.ticker}
              </p>
              <p className={styles.metricLabel}>
                $
                {formatTMB(
                  Quantity.__mul(
                    arTokenStats.data.unLent,
                    new Quantity(0n, 12n).fromNumber(arTokenPrice),
                  ),
                )}
              </p>
            </>
          )}
        </div>

        {/* Reward asset info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${strategy.rewardToken.ticker}.svg`}
              alt={strategy.rewardToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{strategy.rewardToken.name}</h2>
            <p className={styles.symbol}>{strategy.rewardToken.ticker}</p>
          </div>
        </div>

        {/* APY Info */}
        <div className={styles.aprInfo} style={{ width: "205px" }}>
          {!maxReward.maxAPY ? (
            <>
              <SkeletonLoading style={{ width: "60px", height: "14px" }} />
              <SkeletonLoading style={{ width: "90px", height: "13px" }} />
            </>
          ) : (
            <>
              <div className={styles.aprValue}>
                <Image
                  src={`/icons/APYStars.svg`}
                  alt={`Stars icon`}
                  width={10}
                  height={10}
                />
                <p className={styles.apr}>
                  {maxReward.type === "token"
                    ? `No token price`
                    : `${maxReward.maxAPY.toFixed(2)}%`}
                </p>
              </div>
              <p className={styles.aprLabel}>
                {maxReward.tokenRewardsPerOneHundredUSD.toFixed(4)}{" "}
                {strategy.rewardToken.ticker} per $100
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
