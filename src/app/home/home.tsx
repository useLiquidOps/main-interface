"use client";
import React from "react";
import styles from "./home.module.css";
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

function HomeContent() {
  const { modalType, assetData, closeModal } = useModal();

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
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
