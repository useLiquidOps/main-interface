import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./LandingBody.module.css";
import { tokenInfo, Token } from "@/utils/ao/utils/tokenInfo";
import { getAllAPYs, APY } from "@/utils/ao/getData/getAllAPYs";
import {
  getAllLiquidity,
  liquidityItem,
} from "@/utils/ao/getData/getAllLiquidity";

const LandingBody = () => {
  const [arweaveToken, setArweaveToken] = useState<Token | undefined>();
  const [aoToken, setAOToken] = useState<Token | undefined>();
  const [tokenAPYs, setTokenAPYs] = useState<APY[]>([]);
  const [allLiquidity, setAllLiquidity] = useState<liquidityItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arToken = tokenInfo.find((token) => token.ticker === "tAR");
        setArweaveToken(arToken);

        const aoCredToken = tokenInfo.find(
          (token) => token.ticker === "tAOCRED",
        );
        setAOToken(aoCredToken);

        const apys = await getAllAPYs();
        setTokenAPYs(apys);

        const liquidityData = await getAllLiquidity();
        setAllLiquidity(liquidityData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getTokenAPY = (tokenAddress: string) => {
    const tokenAPY = tokenAPYs.find((token) => token.address === tokenAddress);
    return tokenAPY ? tokenAPY.apy : "...";
  };

  const getPoolLiquidity = (poolID: string) => {
    const poolLiquidity = allLiquidity.find((pool) => pool.poolID === poolID);
    return poolLiquidity ? poolLiquidity.liquidity : "...";
  };

  return (
    <div className={styles.landingPageContent}>
      <div className={styles.topContent}>
        <div className={styles.previousFounders}>
          <p>Founders of</p>
          <Link href="https://arconnect.io" target="_blank">
            <img src="/images/arconnect.svg" alt="ArConnect" />
          </Link>
          <Link href="https://othent.io" target="_blank">
            <img src="/images/othent.svg" alt="Othent" />
          </Link>
          <p>incubated by</p>
          <Link href="https://communitylabs.com" target="_blank">
            <img src="/images/community-labs.svg" alt="Community Labs" />
          </Link>
        </div>
        <h1 className={styles.landingPageTitle}>
          arweave lending and borrowing
        </h1>
        <div className={styles.buttonContainer}>
          <Link href="/lend/tAR/deposit">
            <button className={styles.lendAR}>Lend</button>
          </Link>
          <Link href="/borrow/tAR/borrow">
            <button className={styles.borrowAR}>Borrow</button>
          </Link>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.testnet}>
          <div className={styles.flashingIcon}>
            <div className={styles.innerCircle}></div>
          </div>
          <p>Testnet</p>
        </div>
        <div className={styles.poolsContainer}>
          <div className={styles.poolHeader}>
            <div className={styles.poolTitle} style={{ paddingRight: "20px" }}>
              <p>Pool</p>
            </div>
            <div className={styles.apyTitle} style={{ paddingRight: "20px" }}>
              <p>APY</p>
            </div>
            <div
              className={styles.liquidityTitle}
              style={{ marginRight: "200px" }}
            >
              <p>Liquidity</p>
            </div>
          </div>
          <div>
            {arweaveToken && (
              <div className={styles.poolRow}>
                <div className={styles.poolInfo}>
                  <img src={arweaveToken.iconPath} alt="Arweave" />
                  <div>
                    <p className={styles.assetTicker}>{arweaveToken.ticker}</p>
                    <p className={styles.assetName}>{arweaveToken.name}</p>
                  </div>
                </div>
                <p className={styles.apy}>
                  {getTokenAPY(arweaveToken.address)}%
                </p>
                <p>
                  ${getPoolLiquidity(arweaveToken.poolID).toLocaleString()}m
                </p>
                <Link href="/lend/tAR/deposit">
                  <button className={styles.depositButton}>Deposit</button>
                </Link>
              </div>
            )}
            {aoToken && (
              <div className={styles.poolRow}>
                <div className={styles.poolInfo}>
                  <img src={aoToken.iconPath} alt="AOCRED" />
                  <div>
                    <p className={styles.assetTicker}>{aoToken.ticker}</p>
                    <p className={styles.assetName}>{aoToken.name}</p>
                  </div>
                </div>
                <p className={styles.apy}>{getTokenAPY(aoToken.address)}%</p>
                <p>${getPoolLiquidity(aoToken.poolID).toLocaleString()}m</p>
                <Link href="/lend/tAOCRED/deposit">
                  <button className={styles.depositButton}>Deposit</button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.ao}>
          <p>Powered by</p>
          <Link href="https://ao.arweave.dev" target="_blank">
            <img src="/images/ao.svg" alt="ao the computer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingBody;
