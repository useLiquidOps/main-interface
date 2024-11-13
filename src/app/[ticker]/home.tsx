"use client";
import React, { useState } from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import AssetDisplay from "./AssetDisplay/AssetDisplay";
import { AssetDisplayData } from "../data";
import WithdrawRepay from "@/components/WithdrawRepay/WithdrawRepay";
import { useModal, ModalProvider } from "./PopUp/PopUp";
import ModalBackDropStyles from "../../components/DropDown/ModalBackdrop.module.css";

const HomeContent = ({
  params,
}: {
  params: { ticker: string; tab: string };
}) => {
  const { modalType, assetData, closeModal } = useModal();
  const [isClosing, setIsClosing] = useState(false);
  const ticker = params.ticker as string;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
      setIsClosing(false);
    }, 300);
  };

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
        <div
          className={`${ModalBackDropStyles.modalOverlay} ${isClosing ? ModalBackDropStyles.closing : ""}`}
        >
          <div
            className={`${ModalBackDropStyles.modalContent} ${isClosing ? ModalBackDropStyles.closing : ""}`}
          >
            <WithdrawRepay
              mode={modalType as "withdraw" | "repay"}
              ticker={assetData?.symbol || ticker}
              onClose={handleClose}
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
