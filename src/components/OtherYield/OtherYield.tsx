"use client";
import styles from "./OtherYield.module.css";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import Link from "next/link";
import Image from "next/image";

const OtherYield: React.FC = () => {
  const { price: aoPrice, isLoading: isLoadingAoPrice } = useTokenPrice("AO");
  const { price: arPrice, isLoading: isLoadingArPrice } = useTokenPrice("AR");
  const { price: ethPrice, isLoading: isLoadingEthPrice } =
    useTokenPrice("STETH");
  const { price: daiPrice, isLoading: isLoadingDaiPrice } =
    useTokenPrice("DAI");

  const AOPerAR = aoAPY(aoPrice.toNumber(), arPrice.toNumber());

  const AOPerETH = ethAPY(aoPrice.toNumber(), ethPrice.toNumber());

  const AOPerDAI = daiAPY(aoPrice.toNumber(), daiPrice.toNumber());

  return (
    <div className={styles.container}>
      <p className={styles.title}>AO ecosystem yield</p>
      <div className={styles.cardContainer}>
        <Link
          href="https://mirror.xyz/0x1EE4bE8670E8Bd7E9E2E366F530467030BE4C840/-UWra0q0KWecSpgg2-c37dbZ0lnOMEScEEkabVm9qaQ"
          target="_blank"
          className={styles.card}
        >
          <div className={styles.detailsContainer}>
            <Image src={"/tokens/AR.svg"} alt="AO" width={25} height={25} />
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>1 AR</p>
              <p className={styles.usdAmount}>
                $
                {arPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>
                {AOPerAR.rewardPerToken.toLocaleString()} AO
              </p>
              <p className={styles.usdAmount}>
                $
                {(aoPrice.toNumber() * AOPerAR.rewardPerToken).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  },
                )}
              </p>
            </div>
          </div>
          <div className={styles.yieldTitleContainer}>
            <p className={styles.yieldTitle}>Arweave AO airdrop</p>
            <p className={styles.tokenYield}>+{AOPerAR.APY.toFixed(2)}%</p>
          </div>
        </Link>

        <Link
          href="https://ao.arweave.dev/#/mint/deposits/"
          target="_blank"
          className={styles.card}
        >
          <div className={styles.detailsContainer}>
            <Image src={"/tokens/stETH.svg"} alt="AO" width={30} height={30} />
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>1 stETH</p>
              <p className={styles.usdAmount}>
                $
                {ethPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>
                {AOPerETH.rewardPerToken.toLocaleString()} AO
              </p>
              <p className={styles.usdAmount}>
                $
                {(aoPrice.toNumber() * AOPerETH.rewardPerToken).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>
          </div>
          <div className={styles.yieldTitleContainer}>
            <p className={styles.yieldTitle}>stETH AO pre-bridge</p>
            <p className={styles.tokenYield}>+{AOPerETH.APY.toFixed(2)}%</p>
          </div>
        </Link>

        <Link
          href="https://ao.arweave.dev/#/mint/deposits/"
          target="_blank"
          className={styles.card}
        >
          <div className={styles.detailsContainer}>
            <Image src={"/tokens/DAI.svg"} alt="AO" width={30} height={30} />
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>1 DAI</p>
              <p className={styles.usdAmount}>
                $
                {daiPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.titleContainer}>
              <p className={styles.tokenTitle}>
                {AOPerDAI.rewardPerToken.toLocaleString()} AO
              </p>
              <p className={styles.usdAmount}>
                $
                {(aoPrice.toNumber() * AOPerDAI.rewardPerToken).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  },
                )}
              </p>
            </div>
          </div>
          <div className={styles.yieldTitleContainer}>
            <p className={styles.yieldTitle}>DAI AO pre-bridge</p>
            <p className={styles.tokenYield}>+{AOPerDAI.APY.toFixed(2)}%</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OtherYield;

function aoAPY(aoPrice: number, arPrice: number) {
  const aoPerToken = 0.016;

  const aoYield = aoPerToken * aoPrice;

  const APY = (aoYield / arPrice) * 100;

  return { rewardPerToken: aoPerToken, APY };
}

function ethAPY(aoPrice: number, ethPrice: number) {
  const oneUnitMultiplier = 1 / 0.38896;

  const yearlyProjection = 2.21595 * oneUnitMultiplier;

  const aoPerToken = yearlyProjection;

  const aoYield = aoPerToken * aoPrice;

  const APY = (aoYield / ethPrice) * 100;

  return { rewardPerToken: aoPerToken, APY };
}

function daiAPY(aoPrice: number, daiPrice: number) {
  const yearlyProjection = 8.86382 / 1000;

  const aoPerToken = yearlyProjection;

  const aoYield = aoPerToken * aoPrice;

  const APY = (aoYield / daiPrice) * 100;

  return { rewardPerToken: aoPerToken, APY };
}
