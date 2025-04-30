import React from "react";
import styles from "./Strategies.module.css";
import Image from "next/image";
import Link from "next/link";

interface Strategy {
  id: string;
  APY: number;
  baseTicker: string;
  borrowTicker: string;
  rewardTicker: string;
}

const Strategies: React.FC = () => {
  const strategies: Strategy[] = [
    {
      id: "wUSDC-wAR",
      APY: 2.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "AO",
    },
    {
      id: "wUSDC-wAR",
      APY: 1.7,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "APUS",
    },
    {
      id: "wUSDC-wAR",
      APY: 1.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "BOTG",
    },
    {
      id: "wUSDC-wAR",
      APY: 0.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "PL",
    },
    {
      id: "wUSDC-wAR",
      APY: 3.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "ARIO",
    },
    {
      id: "wUSDC-wAR",
      APY: 0.1,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "ACTION",
    },
    {
      id: "wUSDC-wAR",
      APY: 1,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "PIXL",
    },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.strategyTitleContainer}>
        <p>Strategy</p>
        <p>Reward token</p>
        <p>APY</p>
      </div>
      <div className={styles.strategiesContainer}>
        {strategies.map((strategy, index) => (
          <Link
            href={`/strategies/${strategy.id}`}
            className={styles.strategy}
            key={index}
          >
            <div className={styles.strategyContainer}>
              <div className={styles.strategyPairContainer}>
                <Image
                  src={`/tokens/${strategy.baseTicker}.svg`}
                  alt={`${strategy.baseTicker}`}
                  width={15}
                  height={15}
                  style={{ position: "relative", zIndex: 1 }}
                />

                <Image
                  src={`/tokens/${strategy.borrowTicker}.svg`}
                  alt={`${strategy.borrowTicker}`}
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
                {strategy.baseTicker} / {strategy.borrowTicker}
              </p>
            </div>

            <div className={styles.rewardContainer}>
              <Image
                src={`/tokens/${strategy.rewardTicker}.svg`}
                alt={`${strategy.rewardTicker}`}
                width={15}
                height={15}
              />
              <p>{strategy.rewardTicker}</p>
            </div>

            <div className={styles.APYContainer}>
              <Image
                src={`/icons/APYStars.svg`}
                alt={`Stars icon`}
                width={10}
                height={10}
              />
              <p className={styles.strategyAPY}>{strategy.APY}%</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Strategies;
