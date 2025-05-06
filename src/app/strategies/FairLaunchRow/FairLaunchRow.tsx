import styles from "./FairLaunchRow.module.css";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { FairLaunchStrategy } from "../adapters/fairLaunch";
import { Prices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";

interface FairLaunchRowProps {
  strategy: FairLaunchStrategy;
  prices: Prices | undefined;
}

export const FairLaunchRow: React.FC<FairLaunchRowProps> = ({
  strategy,
  prices,
}) => {
  const isLoadingStrategy = !strategy;

  const borrowTokenStats = useProtocolStats(
    strategy.borrowToken.ticker.toUpperCase(),
  );

  const geckoId = tickerToGeckoMap[strategy.borrowToken.ticker.toUpperCase()];
  const borrowTokenPrice = new Quantity(0n, 12n).fromNumber(
    prices?.[geckoId]?.usd ?? 0,
  );

  const isLoadingStats = borrowTokenStats.isLoading || !borrowTokenStats.data;

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
          {isLoadingStats ? (
            <>
              <SkeletonLoading style={{ width: "90px", height: "14px" }} />
              <SkeletonLoading style={{ width: "60px", height: "13px" }} />
            </>
          ) : (
            <>
              <p className={styles.metricValue}>
                {formatTMB(borrowTokenStats.data.unLent)}{" "}
                {strategy.borrowToken.ticker}
              </p>
              <p className={styles.metricLabel}>
                $
                {formatTMB(
                  Quantity.__mul(
                    borrowTokenStats.data.unLent,
                    borrowTokenPrice,
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
        <div className={styles.aprInfo}>
          <div className={styles.aprValue}>
            <Image
              src={`/icons/${strategy.apy >= 0 ? "APYStars" : "APRStars"}.svg`}
              alt={`Stars icon`}
              width={10}
              height={10}
            />
            <p className={styles.apr}>{strategy.apy.toFixed(2)}%</p>
          </div>
          <p className={styles.aprLabel}>Total APY</p>
        </div>
      </div>
    </div>
  );
};
