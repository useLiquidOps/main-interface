"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import AssetDisplay from "./AssetDisplay/AssetDisplay";
import { AssetDisplayData } from "../data";

const Home = ({ params }: { params: { ticker: string; tab: string } }) => {
  const currentToken = params.ticker as string;

  return (
    <div className={styles.page}>
      <Header home={true} currentToken={currentToken} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <ProtocolBalance />

          <div className={styles.grid}>
            <Market />
            <PositionSummary />

            <AssetDisplay
              mode="lend"
              assets={AssetDisplayData}
              maxYield="5.1"
            />

            <AssetDisplay mode="borrow" assets={AssetDisplayData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
