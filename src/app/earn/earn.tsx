"use client";
import styles from "./earn.module.css";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Header from "../../components/Header/Header";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import ActionPanel from "./ActionPanel/ActionPanel";

const Earn: React.FC = () => {
  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.topSection}>
            <div className={styles.titleContainer}>
              <p className={styles.totalDeposits}>
                Total fair launch deposits $1,343,310.33
              </p>
              <h2 className={styles.title}>Choose token to delegate</h2>
              <a
                className={styles.learnMore}
                target="_blank"
                href="https://www.youtube.com/watch?v=PrZpgAP4qNo"
              >
                Learn more
              </a>
            </div>

            <div className={styles.loBalanceContainer}>
              <p className={styles.loBalance}>
                <Image src="/tokens/LQD.svg" alt="LQD" width={20} height={20} />
                <span>1,323,300.00</span>
              </p>
              <p className={styles.loTitle}>Your LQD balance</p>
            </div>
          </div>

          <div className={styles.depositSection}>
            <div className={styles.depositAsset}>
              {/* AR - Active */}
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

              {/* stETH - Coming Soon */}
              <div className={styles.assetSquareContainer}>
                <div
                  className={styles.assetSquare}
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.6,
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
                      <span>LQD per stETH APY</span>
                    </p>
                  </div>
                </div>
                <div className={styles.comingSoonBanner}>Coming Soon</div>
              </div>

              {/* DAI - Coming Soon */}
              <div className={styles.assetSquareContainer}>
                <div
                  className={styles.assetSquare}
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.6,
                  }}
                >
                  <Image
                    src="/tokens/DAI.svg"
                    alt="DAI"
                    height={50}
                    width={50}
                  />
                  <div className={styles.assetSquareDetails}>
                    <p className={styles.assetName}>DAI</p>
                    <p className={styles.assetDetails}>
                      <Image
                        src="/icons/APYStars.svg"
                        alt="Sparkle"
                        height={10}
                        width={10}
                      />
                      <span>LQD per DAI APY</span>
                    </p>
                  </div>
                </div>
                <div className={styles.comingSoonBanner}>Coming Soon</div>
              </div>
            </div>
            <div className={styles.depositAssetPanelContainer}>
              <ActionPanel ticker="wAR" mode="delegate" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Earn;
