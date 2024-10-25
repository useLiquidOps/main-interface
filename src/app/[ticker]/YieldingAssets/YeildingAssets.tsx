import React, { useState } from "react";
import styles from './YeildingAssets.module.css'
import Image from "next/image";

interface Asset {
  icon: string;
  name: string;
  amount: string;
  symbol: string;
  apr: string;
  change: string;
  isPositive: boolean;
}

const assets: Asset[] = [
  {
    icon: "/tokens/qAR.svg",
    name: "Quantum Arweave",
    amount: "13,579.24",
    symbol: "qAR",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
  },
  {
    icon: "/tokens/DAI.svg",
    name: "Dai",
    amount: "124.5",
    symbol: "DAI",
    apr: "2.03",
    change: "0.17",
    isPositive: false,
  },
  {
    icon: "/tokens/stETH.svg",
    name: "Staked Ethereum",
    amount: "13,579.24",
    symbol: "stETH",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
  },
  {
    icon: "/tokens/qAR.svg",
    name: "Quantum Arweave",
    amount: "13,579.24",
    symbol: "qAR",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
  },
  {
    icon: "/tokens/DAI.svg",
    name: "Dai",
    amount: "124.5",
    symbol: "DAI",
    apr: "2.03",
    change: "0.17",
    isPositive: false,
  },
  {
    icon: "/tokens/stETH.svg",
    name: "Staked Ethereum",
    amount: "13,579.24",
    symbol: "stETH",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
  },
];

const YieldingAssets: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedAssets = showAll ? assets : assets.slice(0, 4);

  const toggleView = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={`${styles.container} ${showAll ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Yielding assets</h2>
        {showAll ? (
          <button onClick={toggleView} className={styles.closeButton}>
            <Image
              src="/icons/close.svg"
              alt="Close"
              width={9}
              height={9}
            />
          </button>
        ) : (
          <button onClick={toggleView} className={styles.viewAll}>
            View all
          </button>
        )}
      </div>

      <div className={styles.assetsList}>
        {displayedAssets.map((asset, index) => (
          <div key={`${asset.name}-${index}`} className={styles.assetRow}>
            <div className={styles.assetInfo}>
              <div className={styles.iconWrapper}>
                <Image
                  src={asset.icon}
                  alt={asset.name}
                  width={40}
                  height={40}
                />
              </div>
              <div className={styles.nameAmount}>
                <p className={styles.name}>{asset.name}</p>
                <p className={styles.amount}>
                  {asset.amount} {asset.symbol}
                </p>
              </div>
            </div>

            <div className={styles.aprInfo}>
              <p className={styles.apr}>APR {asset.apr}%</p>
              <div className={styles.changeInfo}>
                <Image
                  src={
                    asset.isPositive ? "/icons/APRUp.svg" : "/icons/APRDown.svg"
                  }
                  alt="APR change indicator"
                  width={16}
                  height={16}
                />
                <p
                  className={styles.change}
                >
                  {asset.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YieldingAssets;