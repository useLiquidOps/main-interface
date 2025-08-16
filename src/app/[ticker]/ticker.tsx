"use client";
import React from "react";
import styles from "./ticker.module.css";
import PositionSummary from "./PositionSummary/PositionSummary";
import { tokens } from "liquidops";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Link from "next/link";
import Image from "next/image";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import APRInfo from "./APRInfo/APRInfo";
import TickerInfo from "./TickerInfo/TickerInfo";
import { useAccountTab } from "@/components/Connect/accountTabContext";
import { ModalProvider } from "@/components/PopUp/PopUp";
import WithdrawRepay from "../home/WithdrawRepay/WithdrawRepay";
import ActionTab from "../home/ActionTab/ActionTab";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import { useModal } from "@/components/PopUp/PopUp";
import MarketDetails from "./MarketDetails/MarketDetails";
import ConnectWalletWall from "@/components/ConnectWalletWall/ConnectWalletWall";

const TickerContent = ({
  params,
}: {
  params: { ticker: string; tab: string };
}) => {
  const ticker = params.ticker as string;

  const { modalType, assetData, closeModal } = useModal();

  const { data: supportedTokens = [] } = useSupportedTokens();
  const tokenData = supportedTokens.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const tokenTickers = Object.keys(tokens);

  if (!tokenTickers.includes(ticker.toUpperCase())) {
    redirect("/404");
  }

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
      <ConnectWalletWall
        customMessage={`Please connect your wallet to view ${tokenData?.name || ticker} details`}
      >
        <div className={styles.body}>
          <div className={styles.bodyContainer}>
            <div className={styles.titleWrapper}>
              <Link href="/" className={styles.titleLink}>
                <Image
                  src="./icons/back.svg"
                  alt="Back"
                  width={24}
                  height={24}
                  className={styles.backIcon}
                />
                <h2 className={styles.title}>{tokenData?.name}</h2>
              </Link>
              <button
                className={styles.viewTxns}
                onClick={handleOpenAccountTab}
              >
                View transactions
              </button>
            </div>

            <div className={styles.topContainer}>
              <TickerInfo ticker={ticker} />
              <APRInfo ticker={ticker} />
            </div>

            <div className={styles.grid}>
              <PositionSummary ticker={ticker} />
              <MarketDetails ticker={ticker} />
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
      </ConnectWalletWall>
      <Footer />
    </div>
  );
};

const Ticker = ({ params }: { params: { ticker: string; tab: string } }) => {
  return (
    <ModalProvider>
      <TickerContent params={params} />
    </ModalProvider>
  );
};

export default Ticker;
