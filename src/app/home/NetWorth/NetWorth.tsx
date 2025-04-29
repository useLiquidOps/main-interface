import React from "react";
import styles from "./NetWorth.module.css";
import Image from "next/image";
import PieChart from "@/components/PieChat/PieChart";

interface TokenHolding {
  token: string;
  tokenHex: string;
  amount: number;
}

const NetWorth: React.FC = () => {
  const userTokenHoldings: TokenHolding[] = [
    { token: "wAR", tokenHex: "#ec406d", amount: 10 },
    { token: "wUSDC", tokenHex: "#2775ca", amount: 10 },
  ];

  const netAPY = 11.1;
  const isPositive = netAPY >= 0;
  const starType = isPositive ? "APYStars" : "APRStars";

  return (
    <div className={styles.card}>
      <div className={styles.pieChart}>
        <PieChart
          data={userTokenHoldings.map((token) => ({
            name: token.token,
            value: token.amount,
            color: token.tokenHex,
          }))}
          height={10}
        />
      </div>

      <div className={styles.balanceContainer}>
        <p className={styles.balanceTitle}>Net worth</p>
        <h1 className={styles.balance}>$1,000</h1>

        <div className={styles.netAPYContainer}>
          <p className={styles.apyTitle}>Net APY</p>
          <div className={styles.netAPY}>
            <Image
              src={`/icons/${starType}.svg`}
              alt={`Stars icon`}
              width={10}
              height={10}
            />
            <p className={styles.apyTitle}>{netAPY}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorth;
