"use client";
import React from "react";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import AssetDisplay from "./AssetDisplay/AssetDisplay";
import WithdrawRepay from "./WithdrawRepay/WithdrawRepay";
import ActionTab from "./ActionTab/ActionTab";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import Footer from "@/components/Footer/Footer";
import { useModal, ModalProvider } from "./PopUp/PopUp";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import { useAccountTab } from "@/components/Connect/accountTabContext";
import NetWorth from "./NetWorth/NetWorth";
import SupplyBorrow from "./SupplyBorrow/SupplyBorrow";
import Strategies from "./Strategies/Strategies";

function HomeContent() {
  const { modalType, assetData, closeModal } = useModal();
  const { setAccountTab } = useAccountTab();

  const handleOpenAccountTab = async () => {
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.length > 0) {
      setAccountTab(true);
    } else {
      alert("Please connect your wallet by logging in.");
    }
  };

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.statsContainer}>
            <div className={styles.cardContainer}>
              <NetWorth />
              <SupplyBorrow />
              <Strategies />
            </div>

            <div className={styles.txnContainer}>
              <button
                className={styles.viewTxns}
                onClick={handleOpenAccountTab}
              >
                View transactions
              </button>
            </div>
          </div>

          <div className={styles.grid}>
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
              {(modalType === "withdraw" || modalType === "repay") && (
                <WithdrawRepay
                  mode={modalType}
                  ticker={assetData?.ticker}
                  onClose={closeModal}
                />
              )}

              {(modalType === "supply" || modalType === "borrow") && (
                <ActionTab
                  mode={modalType as "supply" | "borrow"}
                  ticker={assetData?.ticker}
                  onClose={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function Home() {
  return (
    <ModalProvider>
      <HomeContent />
    </ModalProvider>
  );
}

export default Home;
