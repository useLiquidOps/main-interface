"use client";
import styles from "./earn.module.css";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Header from "../../components/Header/Header";
import Image from "next/image";

const Earn: React.FC = () => {
  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <h2 className={styles.title}>Choose token to deposit</h2>
          <div className={styles.depositSection}>
            <div className={styles.depositAsset}>
              {/* --- */}
              <div
                className={styles.assetSquare}
                style={{
                  cursor: "default",
                  border: "4px solid var(--primary-palatinate-blue)",
                }}
              >
                <Image src="/tokens/AR.svg" alt="AR" height={50} width={50} />
                <div className={styles.assetSquareDetails}>
                  <p className={styles.assetName}>AR</p>
                  <p className={styles.assetDetails}>
                    <Image
                      src="/icons/APYStars.svg"
                      alt="Sparkle"
                      height={10}
                      width={10}
                    />
                    <span>7 LQD per AR APY</span>
                  </p>
                </div>
              </div>
              {/* --- */}
              <div
                className={styles.assetSquare}
                style={{
                  cursor: "not-allowed",
                }}
              >
                <Image
                  src="/tokens/stETH.svg"
                  alt="stETH"
                  height={50}
                  width={50}
                />
                <div className={styles.assetSquareDetails}>
                  <p className={styles.assetName}>stETH</p>
                  <p className={styles.assetDetails}>
                    <Image
                      src="/icons/APYStars.svg"
                      alt="Sparkle"
                      height={10}
                      width={10}
                    />
                    <span>7 LQD per stETH APY</span>
                  </p>
                </div>
              </div>
              {/* --- */}
              <div
                className={styles.assetSquare}
                style={{
                  cursor: "not-allowed",
                }}
              >
                <Image src="/tokens/DAI.svg" alt="DAI" height={50} width={50} />
                <div className={styles.assetSquareDetails}>
                  <p className={styles.assetName}>DAI</p>
                  <p className={styles.assetDetails}>
                    <Image
                      src="/icons/APYStars.svg"
                      alt="Sparkle"
                      height={10}
                      width={10}
                    />
                    <span>7 LQD per DAI APY</span>
                  </p>
                </div>
              </div>
              {/* --- */}
            </div>
            <div className={styles.depositAssetPanelContainer}>
              <div>Deposit panel placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;
