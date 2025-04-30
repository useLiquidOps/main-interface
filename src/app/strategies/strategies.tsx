"use client";
import styles from "./strategies.module.css";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FairLaunchStrategy } from "./adapters/fairLaunch";
import { FairLaunchRow } from "./FairLaunchRow/FairLaunchRow";
import { useFairLaunches } from "@/hooks/strategies/useFairLaunches";

const Markets: React.FC = () => {
  const { data: fairLaunchStrategies = [] } = useFairLaunches();

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.strategyContainer}>
            <p className={styles.strategyTitle}>Fair Launches</p>
            <div className={styles.strategiesList}>
              {(fairLaunchStrategies as FairLaunchStrategy[]).map(
                (strategy) => (
                  <FairLaunchRow strategy={strategy} />
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
