"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import AssetDisplay from "./AssetDisplay/AssetDisplay";
import WithdrawRepay from "@/components/WithdrawRepay/WithdrawRepay";
import { useModal, ModalProvider } from "./PopUp/PopUp";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import { tokens } from "liquidops";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

const HomeContent = ({
  params,
}: {
  params: { ticker: string; tab: string };
}) => {
  const { modalType, assetData, closeModal } = useModal();
  const ticker = params.ticker as string;

  const tokenTickers = Object.keys(tokens);

  if (!tokenTickers.includes(ticker.toUpperCase())) {
    redirect("/404");
  }

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header mode="home" currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <ProtocolBalance ticker={ticker} />
          <div className={styles.grid}>
            <Market ticker={ticker} />
            <PositionSummary ticker={ticker} />
            <AssetDisplay mode="lend" />
            <AssetDisplay mode="borrow" />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {modalType && (
          <motion.div
            className={styles.modalOverlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeModal}
          >
            <motion.div
              className={styles.modalContent}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <WithdrawRepay
                mode={modalType as "withdraw" | "repay"}
                ticker={assetData?.ticker || ticker}
                onClose={closeModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
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
