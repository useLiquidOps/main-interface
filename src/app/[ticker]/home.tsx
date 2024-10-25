"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import YieldingAssets from "./YieldingAssets/YeildingAssets";

const Home = ({ params }: { params: { ticker: string; tab: string } }) => {
  const currentToken = params.ticker as string;

  return (
    <div className={styles.page}>
      <Header home={true} currentToken={currentToken} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <ProtocolBalance />

          <div className={styles.grid}>
            {/* <Market />
            <PositionSummary /> */}
            <YieldingAssets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
