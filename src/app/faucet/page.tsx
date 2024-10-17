"use client";
import styles from "./faucet.module.css";
import Header from "../../components/Header/Header";

const faucet = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>faucet</div>
    </div>
  );
};

export default faucet;
