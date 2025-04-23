"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import AssetDisplay from "../[ticker]/AssetDisplay/AssetDisplay";
import WithdrawRepay from "@/components/WithdrawRepay/WithdrawRepay";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import Footer from "@/components/Footer/Footer";
import { useModal, ModalProvider } from "../[ticker]/PopUp/PopUp";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

function Ticker() {
  const { modalType, assetData, closeModal } = useModal();

  return (
    <ModalProvider>
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
    </ModalProvider>
  );
}

export default Ticker;
