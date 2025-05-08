import styles from "./FairLaunchRow.module.css";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { FairLaunchStrategy } from "../adapters/fairLaunches/fairLaunch";
import { Prices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { useFairLaunchAPY } from "@/hooks/strategies/useFairLaunchAPY";

interface FairLaunchRowProps {
  strategy: FairLaunchStrategy;
  prices: Prices | undefined;
}

export const FairLaunchRow: React.FC<FairLaunchRowProps> = ({
  strategy,
  prices,
}) => {


const rewardTokenGeckoID = tickerToGeckoMap[strategy.rewardToken.ticker.toUpperCase()];
let rewardTokenPrice
if (rewardTokenGeckoID) {
  rewardTokenPrice = prices?.[rewardTokenGeckoID]?.usd ?? 0
} else {
  rewardTokenPrice = false
}

  const AOPerAR = 0.016

  // deposit the USDC/USDT tokens

  const depositTokenStats = useProtocolStats(
    strategy.depositToken.ticker.toUpperCase(),
  );

  const depositTokensAPY = depositTokenStats.data?.supplyAPR

  // now borrow qAR/wAR and find the reward APY and borrow APY cost


  const arTokenGeckoID = tickerToGeckoMap[strategy.borrowToken.ticker.toUpperCase()];
  const arTokenPrice = new Quantity(0n, 12n).fromNumber(
    prices?.[arTokenGeckoID]?.usd ?? 0,
  );

  const arBorrowAmountUSD = 100
  const arBorrowAmount = arBorrowAmountUSD / arTokenPrice.toNumber()

  const maxRewardAmount = arBorrowAmount * AOPerAR

  if (maxRewardAmountUSD !== false) {
    
  }

  const maxRewardAmountUSD = maxRewardAmount * rewardTokenPrice

  const maxARBorrowPercentage = Number(depositTokenStats.data?.info.collateralFactor) / 100
  const rewardAPY = ((maxRewardAmountUSD / arBorrowAmountUSD) * 100) * maxARBorrowPercentage

  const arTokenStats = useProtocolStats(
    strategy.borrowToken.ticker.toUpperCase(),
  );

    // @ts-ignore
  const totalBorrowArAPR = (arTokenStats.data?.borrowAPR * maxARBorrowPercentage)
  // @ts-ignore
  const maxAPY = (depositTokensAPY + rewardAPY) - totalBorrowArAPR

  let strategyAPY;
  if (strategy.fairLaunchID) {
    strategyAPY = useFairLaunchAPY(strategy.fairLaunchID).data;
  } else if (strategy.rewardToken.ticker === "AO") {
    strategyAPY = AOPerAR;
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
                  Quantity.__mul(
                    arTokenStats.data.unLent,
                    arTokenPrice,
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
          {!strategyAPY ? (
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
                <p className={styles.apr}>{maxAPY.toFixed(2)}%</p>
              </div>
              <p className={styles.aprLabel}>
              {maxRewardAmount.toFixed(2)} {strategy.rewardToken.ticker} per {arBorrowAmountUSD} {strategy.depositToken.ticker}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
