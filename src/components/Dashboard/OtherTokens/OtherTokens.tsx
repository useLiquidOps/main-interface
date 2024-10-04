import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./OtherTokens.module.css";
import { Token } from "@/utils/ao/utils/tokenInfo";
import { APY } from "@/utils/ao/getData/getAllAPYs";
import { liquidityItem } from "@/utils/ao/getData/getAllLiquidity";

interface OtherTokensProps {
  tokenInfo: Token[];
  selectedToken: Token | undefined;
  handleTokenClick: (token: Token) => void;
  linkType: "lend" | "borrow";
  tokenAPYs: APY[];
  allLiquidity: liquidityItem[];
}

const OtherTokens = ({
  tokenInfo,
  selectedToken,
  handleTokenClick,
  linkType,
  tokenAPYs,
  allLiquidity,
}: OtherTokensProps) => {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

  useEffect(() => {
    const filtered = tokenInfo.filter(
      (token) => token.address !== selectedToken?.address,
    );
    setFilteredTokens(filtered);
  }, [tokenInfo, selectedToken, tokenAPYs]);

  const getTokenAPY = (tokenAddress: string) => {
    const tokenAPY = tokenAPYs.find((token) => token.address === tokenAddress);
    return tokenAPY ? tokenAPY.apy : "...";
  };

  const getPoolLiquidity = (poolID: string) => {
    const poolLiquidity = allLiquidity.find((pool) => pool.poolID === poolID);
    return poolLiquidity ? poolLiquidity.liquidity : "...";
  };

  return (
    <div className={`${styles.otherTokens}`}>
      <div className={styles.titleContainer}>
        <p className={styles.poolTitle}>Pool</p>
        <p className={styles.apyTitle}>APY</p>
        <p className={styles.liquidityTitle} style={{ marginRight: "70px" }}>
          Liquidity
        </p>
      </div>
      <div className={styles.tokenPools}>
        {filteredTokens.map((token) => (
          <div key={token.address} className={styles.tokenPool}>
            <div className={styles.tokenInfoContainer}>
              <img
                src={token.iconPath}
                alt={token.name}
                className={`${styles.tokenIcon} ${styles.circularIcon}`}
              />
              <div className={styles.tokenInfo}>
                <p>{token.ticker}</p>
                <p className={styles.tokenName}>{token.name}</p>
              </div>
            </div>
            <div className={styles.apyContainer}>
              <div className={styles.apy}>{getTokenAPY(token.address)}%</div>
            </div>
            <div className={styles.liquidityContainer}>
              <div className={styles.liquidity}>
                ${getPoolLiquidity(token.poolID).toLocaleString()[0]}m
              </div>
            </div>
            <Link href={`/${linkType}/${token.ticker}/deposit`}>
              <button
                className={styles.depositButton}
                onClick={() => handleTokenClick(token)}
              >
                Deposit
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherTokens;
