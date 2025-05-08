"use client";
import styles from "./strategies.module.css";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FairLaunchStrategy } from "./adapters/fairLaunches/fairLaunch";
import { FairLaunchRow } from "./FairLaunchRow/FairLaunchRow";
import { useFairLaunches } from "@/hooks/strategies/useFairLaunches";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { useLeverage } from "@/hooks/strategies/useLeverage";
import { LeverageStrategy } from "./adapters/leverage/leverage";
import { LeverageRow } from "./LeverageRow/LeverageRow";

const Markets: React.FC = () => {
  const { data: fairLaunchStrategies = [] } = useFairLaunches(true);
  const { data: leverageStrategies = [] } = useLeverage(true);
  const { data: prices } = usePrices();

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.strategyContainer}>
            <p className={styles.strategyTitle}>Leverage AR tokens</p>
            <div className={styles.strategiesList}>
              <div className={styles.tokenTitleContainer}>
                <p className={styles.tokenTitle}>Type</p>
                <p className={styles.tokenTitle}>Leverage token</p>
                <p className={styles.tokenTitle}>Collateral token</p>
                <p className={styles.tokenTitle}>
                  Max simple/recursive leverage
                </p>
                <p className={styles.tokenTitle}>Borrow token</p>
                <p className={styles.tokenTitle}>Available</p>
                <p className={styles.tokenTitle}>APY</p>
              </div>
              {/* {(leverageStrategies as LeverageStrategy[]).map((leverage) => (
                <LeverageRow leverage={leverage} prices={prices} />
              ))} */}
            </div>
          </div>
          <div className={styles.strategyContainer}>
            <p className={styles.strategyTitle}>
              Deposit USDC/USDT into fair launches
            </p>
            <div className={styles.strategiesList}>
              <div className={styles.tokenTitleContainer}>
                <p className={styles.tokenTitle}>Collateral token</p>
                <p className={styles.tokenTitle}>Borrow token</p>
                <p className={styles.tokenTitle}>Available borrow token</p>
                <p className={styles.tokenTitle}>Reward token</p>
                <p className={styles.tokenTitle}>Average APY / reward ratio</p>
              </div>
              {(fairLaunchStrategies as FairLaunchStrategy[]).map(
                (strategy) => (
                  <FairLaunchRow strategy={strategy} prices={prices} />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Markets;
