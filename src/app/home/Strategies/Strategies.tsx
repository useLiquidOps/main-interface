import React from "react";
import styles from "./Strategies.module.css";
import Image from "next/image";
import Link from "next/link";
import { useFairLaunches } from "@/hooks/strategies/useFairLaunches";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

const Strategies: React.FC = () => {
  const { data: fairLaunches } = useFairLaunches();
  const isLoadingFairLaunches = !fairLaunches;

  return (
    <div className={styles.card}>
      <div className={styles.strategyTitleContainer}>
        <p>Strategy</p>
        <p>Reward token</p>
        {/* <p>APY</p> */}
      </div>
      <div className={styles.strategiesContainer}>
        {isLoadingFairLaunches ? (
          <div>
            <SkeletonLoading
              style={{
                width: "175px",
                height: "13px",
                marginTop: "7.5px",
                marginBottom: "7.5px",
              }}
            />
            <SkeletonLoading
              style={{
                width: "175px",
                height: "13px",
                marginTop: "7.5px",
                marginBottom: "7.5px",
              }}
            />
            <SkeletonLoading
              style={{
                width: "175px",
                height: "13px",
                marginTop: "7.5px",
                marginBottom: "7.5px",
              }}
            />
            <SkeletonLoading
              style={{
                width: "175px",
                height: "13px",
                marginTop: "7.5px",
                marginBottom: "7.5px",
              }}
            />
          </div>
        ) : (
          fairLaunches.map((strategy, index) => (
            <Link href={`/strategies`} className={styles.strategy} key={index}>
              <div className={styles.strategyContainer}>
                <div className={styles.strategyPairContainer}>
                  <Image
                    src={`/tokens/${strategy.depositToken.ticker}.svg`}
                    alt={`${strategy.depositToken.ticker}`}
                    width={15}
                    height={15}
                    style={{ position: "relative", zIndex: 1 }}
                  />
                  <Image
                    src={`/tokens/${strategy.borrowToken.ticker}.svg`}
                    alt={`${strategy.borrowToken.ticker}`}
                    width={15}
                    height={15}
                    style={{
                      position: "relative",
                      marginLeft: "-5px",
                      zIndex: 2,
                    }}
                  />
                </div>
                <p>
                  {strategy.depositToken.ticker} / {strategy.borrowToken.ticker}
                </p>
              </div>
              <div className={styles.rewardContainer}>
                <Image
                  src={`/tokens/${strategy.rewardToken.ticker}.svg`}
                  alt={`${strategy.rewardToken.ticker}`}
                  width={15}
                  height={15}
                />
                <p>{strategy.rewardToken.ticker}</p>
              </div>
              {/* <div className={styles.APYContainer}>
                <Image
                  src={`/icons/${strategy.APY >= 0 ? "APYStars" : "APRStars"}.svg`}
                  alt={`Stars icon`}
                  width={10}
                  height={10}
                />
                <p className={styles.strategyAPY}>{strategy.APY}%</p>
              </div> */}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Strategies;
