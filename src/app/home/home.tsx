"use client";
import React, { useState, useEffect } from "react";
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
import { useModal, ModalProvider } from "../../components/PopUp/PopUp";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import { useAccountTab } from "@/components/Connect/accountTabContext";
import NetWorth from "./NetWorth/NetWorth";
import SupplyBorrow from "./SupplyBorrow/SupplyBorrow";
import Strategies from "./Strategies/Strategies";
import { checkConnection } from "@/utils/Wallets/checkConnection";
import { useHighestAPY } from "@/hooks/LiquidOpsData/useHighestAPY";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import Link from "next/link";

function HomeContent() {
  const { modalType, assetData, closeModal } = useModal();
  const { setAccountTab } = useAccountTab();
  const [isConnected, setIsConnected] = useState(false);
  const [triggerConnect, setTriggerConnect] = useState(false);

  const { data: highestAPYData, isLoading: isApyLoading } = useHighestAPY();

  const highestAPY = highestAPYData?.highestAPY;
  const highestTicker = highestAPYData?.highestTicker;

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsConnected(false);
      }
    };

    checkWalletConnection();

    // Check connection status periodically
    const interval = setInterval(checkWalletConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenAccountTab = async () => {
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.length > 0) {
      setAccountTab(true);
    } else {
      alert("Please connect your wallet by logging in.");
    }
  };

  const handleWalletConnected = () => {
    setIsConnected(true);
  };

  const handleConnectClick = () => {
    // Trigger the connect modal in the header
    setTriggerConnect(true);
    // Reset the trigger after a short delay
    setTimeout(() => setTriggerConnect(false), 100);
  };

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header
        triggerConnect={triggerConnect}
        onWalletConnected={handleWalletConnected}
      />
      <div className={styles.body}>
        {isConnected ? (
          <div className={styles.bodyContainer}>
            <div className={styles.widgetContainer}>
              <div className={styles.widgetLeftContainer}>
                {/* <NetWorth />
              <SupplyBorrow /> */}
                <div></div>
                <div></div>
              </div>

              <div className={styles.widgetRightContainer}>
                {/* <Strategies /> */}
                <div></div>
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
        ) : (
          <div className={styles.connectPrompt}>
            <button
              className={styles.connectButton}
              onClick={handleConnectClick}
            >
              Login
            </button>
            <p className={styles.connectWalletTitle}>
              Please connect your wallet
            </p>
            <div className={styles.highestAPY}>
              <span>Supplying liquidity can</span>

              <div className={styles.highestAPYText}>
                <span>earn you up to</span>
                {isApyLoading ||
                highestAPY === undefined ||
                highestAPY === null ? (
                  <SkeletonLoading style={{ width: "60px", height: "13px" }} />
                ) : (
                  <Link className={styles.apyNumber} href={`/${highestTicker}`}>
                    {highestAPY.toFixed(2)}% APY
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
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
                  ticker={assetData?.cleanTicker}
                  onClose={closeModal}
                />
              )}

              {(modalType === "supply" || modalType === "borrow") && (
                <ActionTab
                  mode={modalType as "supply" | "borrow"}
                  ticker={assetData?.cleanTicker}
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
