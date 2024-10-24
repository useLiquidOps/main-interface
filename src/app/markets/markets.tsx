"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";

const Markets = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>markets</div>
    </div>
  );
};

export default Markets;
