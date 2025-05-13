"use client";
import styles from "./OtherYield.module.css";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import Link from "next/link";
import Image from "next/image";
import { useDuneAOBridge } from "@/hooks/data/useDuneAOBridge";

const OtherYield: React.FC = () => {
  const { price: aoPrice, isLoading: isLoadingAoPrice } = useTokenPrice("AO");
  const { price: arPrice, isLoading: isLoadingArPrice } = useTokenPrice("AR");
  const { price: ethPrice, isLoading: isLoadingEthPrice } =
    useTokenPrice("STETH");
  const { price: daiPrice, isLoading: isLoadingDaiPrice } =
    useTokenPrice("DAI");

  const { data: duneData, isLoading: isLoadingDuneData } = useDuneAOBridge();

  const AOPerAR = aoAPY(aoPrice.toNumber(), arPrice.toNumber());

  const AOPerETH = ethAPY(aoPrice.toNumber(), ethPrice.toNumber(), duneData);

  const AOPerDAI = daiAPY(aoPrice.toNumber(), daiPrice.toNumber(), duneData);

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
            <p className={styles.yieldTitle}>AO airdrop</p>
            <div className={styles.tokenYield}>
              <Image
                src={`/icons/APYStars.svg`}
                alt={`Stars icon`}
                width={10}
                height={10}
              />
              <p>{AOPerAR.APY.toFixed(2)}% APY</p>
            </div>
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
            <p className={styles.yieldTitle}>AO pre-bridge</p>
            <div className={styles.tokenYield}>
              <Image
                src={`/icons/APYStars.svg`}
                alt={`Stars icon`}
                width={10}
                height={10}
              />
              <p>{AOPerETH.APY.toFixed(2)}% APY</p>
            </div>
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
            <p className={styles.yieldTitle}>AO pre-bridge</p>
            <div className={styles.tokenYield}>
              <Image
                src={`/icons/APYStars.svg`}
                alt={`Stars icon`}
                width={10}
                height={10}
              />
              <p>{AOPerDAI.APY.toFixed(2)}% APY</p>
            </div>
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

function ethAPY(aoPrice: number, ethPrice: number, duneData: any) {
  const data = duneData?.stETH;

  const oneUnitMultiplier = 1 / data?.Token_Qty;

  const yearlyProjection = data?.Est_Yearly_AO * oneUnitMultiplier;

  const aoPerToken = yearlyProjection;

  const aoYield = aoPerToken * aoPrice;

  const APY = (aoYield / ethPrice) * 100;

  return { rewardPerToken: aoPerToken, APY };
}

function daiAPY(aoPrice: number, daiPrice: number, duneData: any) {
  const data = duneData?.DAI;

  const yearlyProjection = data?.Est_Yearly_AO / data?.Token_Qty;

  const aoPerToken = yearlyProjection;

  const aoYield = aoPerToken * aoPrice;

  const APY = (aoYield / daiPrice) * 100;

  return { rewardPerToken: aoPerToken, APY };
}
