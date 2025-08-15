"use client";
import styles from "./earn.module.css";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Header from "../../components/Header/Header";

const Earn: React.FC = () => {
  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <p>Earn</p>
      </div>
    </div>
  );
};

export default Earn;
