"use client";
import styles from "./liquidations.module.css";
import Header from "../../components/Header/Header";

const Liquidations = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>liquidations</div>
    </div>
  );
};

export default Liquidations;
