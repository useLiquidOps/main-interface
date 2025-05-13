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
import { AOPerAR } from "../getFairlaunchAPY";

interface FairLaunchRowProps {
  strategy: FairLaunchStrategy;
  prices: Prices | undefined;
}

export const FairLaunchRow: React.FC<FairLaunchRowProps> = ({
  strategy,
  prices,
}) => {
  // APY base, deposit the USDC/USDT tokens
  const depositTokenStats = useProtocolStats(
    strategy.depositToken.ticker.toUpperCase(),
  );
  const baseAPY = depositTokenStats.data?.supplyAPR;

  const maxBorrowPercent = Number(depositTokenStats.data?.info.collateralFactor) / 100;

  // APY reward, find the reward for borrowing ar then earning AO or fair launch tokens

  // check if reward has a usd value or is a token reward only
  const rewardTokenGeckoID =
    tickerToGeckoMap[strategy.rewardToken.ticker.toUpperCase()];

  let rewardTokenPrice;
  if (rewardTokenGeckoID === undefined) {
    rewardTokenPrice = false;
  } else {
    rewardTokenPrice = prices?.[rewardTokenGeckoID]?.usd;
  }

  // check if it is a fair launch reward or AO reward
  // find arweave usd price

  const arTokenGeckoID =
    tickerToGeckoMap[strategy.borrowToken.ticker.toUpperCase()];
  const arTokenPrice = new Quantity(0n, 12n).fromNumber(
    prices?.[arTokenGeckoID]?.usd ?? 0,
  );

  const oneARUSD = arTokenPrice.toNumber();

  const fairLaunchPerAO = useFairLaunchAPY(strategy.fairLaunchID).data;

  const oneHundredDollarsWorthOfARInTokens = 100 / oneARUSD;

  let fairLaunchTokenRewardsPerAR;
  if (strategy.rewardToken.ticker === "AO") {
    fairLaunchTokenRewardsPerAR = AOPerAR;
  } else {
    // @ts-ignore
    fairLaunchTokenRewardsPerAR = fairLaunchPerAO * AOPerAR;
  }

  const tokenRewardsPerOneHundredUSD =
    oneHundredDollarsWorthOfARInTokens * fairLaunchTokenRewardsPerAR;

  let fairLaunchRewards: { type: "token" | "apy"; reward: number };
  // fair launch with a price
  if (rewardTokenPrice !== false) {
    // find fair launch apy

    const fairLaunchUSDRewardsPerAR =
        // @ts-ignore
      fairLaunchTokenRewardsPerAR * rewardTokenPrice;

    const fairLaunchAPY = (fairLaunchUSDRewardsPerAR / oneARUSD) * 100;
    const fairLaunchAPYMinusCollateralFactor = fairLaunchAPY * maxBorrowPercent;

    fairLaunchRewards = {
      type: "apy",
      reward: fairLaunchAPYMinusCollateralFactor,
    };

    // fair launch with token amount
  } else {
        // @ts-ignore
    fairLaunchRewards = { type: "token", reward: fairLaunchPerAO };
  }

  // find borrow APR

  const arTokenStats = useProtocolStats(
    strategy.borrowToken.ticker.toUpperCase(),
  );
      // @ts-ignore
  const totalBorrowArAPR = arTokenStats.data.borrowAPR * maxBorrowPercent;

  // final APY

  let maxAPY;
  if (fairLaunchRewards.type === "token") {
    maxAPY = fairLaunchRewards.reward;
  } else {
        // @ts-ignore
    const totalAPY = baseAPY + fairLaunchRewards.reward;
    maxAPY = totalAPY - totalBorrowArAPR;
  }

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
                  Quantity.__mul(arTokenStats.data.unLent, arTokenPrice),
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
          {!maxAPY ? (
            <>
              <SkeletonLoading style={{ width: "90px", height: "14px" }} />
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
                  {fairLaunchRewards.type === "token"
                    ? `No usd price`
                    : `${maxAPY.toFixed(2)}%`}
                </p>
              </div>
              <p className={styles.aprLabel}>
                {tokenRewardsPerOneHundredUSD.toFixed(4)}{" "}
                {strategy.rewardToken.ticker} per $100
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
