"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import AssetDisplay from "./AssetDisplay/AssetDisplay";
import { AssetDisplayData } from "../data";
import WithdrawRepay from "@/components/WithdrawRepay/WithdrawRepay";
import { useModal, ModalProvider } from "./PopUp/PopUp";

const HomeContent = ({
  params,
}: {
  params: { ticker: string; tab: string };
}) => {
  const { modalType, assetData } = useModal();
  const ticker = params.ticker as string;

  return (
    <div className={styles.page}>
      <Header mode="home" currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <ProtocolBalance ticker={ticker} />
          <div className={styles.grid}>
            <Market ticker={ticker} />
            <PositionSummary ticker={ticker} />
            <AssetDisplay
              mode="lend"
              assets={AssetDisplayData}
              maxYield="5.1"
            />
            <AssetDisplay mode="borrow" assets={[]} />
          </div>
        </div>
      </div>
      {modalType && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <WithdrawRepay
              mode={modalType}
              ticker={assetData?.symbol || ticker}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Home = (props: { params: { ticker: string; tab: string } }) => {
  return (
    <ModalProvider>
      <HomeContent {...props} />
    </ModalProvider>
  );
};

export default Home;
