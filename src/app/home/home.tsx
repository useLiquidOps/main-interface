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
import Image from "next/image";
import { useAccountTab } from "@/components/Connect/accountTabContext";
import { useState } from "react";
import Link from "next/link";
import PieChart from "@/components/PieChat/PieChart";

function HomeContent() {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
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

  const getProgressWidth = (value: number): string => {
    return `${value}%`; // find percentage based on the lent + borrows added (user tvl)
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // fix the var widths here
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const totalWidth = rect.width;

    const totalValue = 10;

    const unlentWidth = (5 / totalValue) * totalWidth;

    let tooltipText = "";
    if (x <= unlentWidth) {
      const availablePercentage = 10;
      tooltipText = `Available Lent Tokens: ${availablePercentage.toFixed(1)}%`;
    } else {
      const borrowsPercentage = 5;
      tooltipText = `Total Borrows: ${borrowsPercentage.toFixed(1)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(!!tooltipText);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const strategies = [
    {
      id: "wUSDC-wAR",
      APY: 2.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "AO",
    },
    {
      id: "wUSDC-wAR",
      APY: 1.7,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "APUS",
    },
    {
      id: "wUSDC-wAR",
      APY: 1.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "BOTG",
    },
    {
      id: "wUSDC-wAR",
      APY: 0.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "PL",
    },
    {
      id: "wUSDC-wAR",
      APY: 3.5,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "ARIO",
    },
    {
      id: "wUSDC-wAR",
      APY: 0.1,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "ACTION",
    },
    {
      id: "wUSDC-wAR",
      APY: 1,
      baseTicker: "wUSDC",
      borrowTicker: "wAR",
      rewardTicker: "PIXL",
    },
  ];

  const netAPY = 11.1;
  const isPositive = netAPY >= 0;
  const starType = isPositive ? "APYStars" : "APRStars";

  const userTokenHoldings = [
    { token: "wAR", tokenHex: "#000000", amount: 10 },
    { token: "wUSDC", tokenHex: "#2775ca", amount: 10 },
  ];

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.statsContainer}>
            <div className={styles.cardContainer}>
              <div className={styles.card1}>
                <div className={styles.pieChart}>
                  <PieChart
                    data={userTokenHoldings.map((token) => ({
                      name: token.token,
                      value: token.amount,
                      color: token.tokenHex,
                    }))}
                    height={10}
                  />
                </div>

                <div className={styles.balanceContainer}>
                  <p className={styles.balanceTitle}>Net worth</p>
                  <h1 className={styles.balance}>$1,000</h1>

                  <div className={styles.netAPYContainer}>
                    <p className={styles.apyTitle}>Net APY</p>
                    <div className={styles.netAPY}>
                      <Image
                        src={`/icons/${starType}.svg`}
                        alt={`Stars icon`}
                        width={10}
                        height={10}
                      />
                      <p className={styles.apyTitle}>{netAPY}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card2}>
                <div className={styles.lendVsBorrows}>
                  <div className={styles.lendBorrow}>
                    <p className={styles.amount}>$20,230</p>
                    <p>Supplied</p>
                  </div>
                  <div className={styles.lendBorrow}>
                    <p className={styles.amount}>$10,230</p>
                    <p>Borrowed</p>
                  </div>
                </div>

                <div
                  className={styles.progressBar}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={styles.progressGreen}
                    style={{
                      width: getProgressWidth(70),
                    }}
                  />
                  <div
                    className={styles.progressBlue}
                    style={{
                      width: getProgressWidth(30),
                    }}
                  />
                </div>
              </div>

              <div className={styles.card3}>
                <div className={styles.stratergyTitleContainer}>
                  <p>Strategy</p>
                  <p>Reward token</p>
                  <p>APY</p>
                </div>
                <div className={styles.strategiesContainer}>
                  {strategies.map((stratergy) => (
                    <Link
                      href={`/strategies/${stratergy.id}`}
                      className={styles.stratergy}
                    >
                      <div className={styles.stratergyContainer}>
                        <div className={styles.stratergyPairContainer}>
                          <Image
                            src={`/tokens/${stratergy.baseTicker}.svg`}
                            alt={`${stratergy.baseTicker}`}
                            width={15}
                            height={15}
                            style={{ position: "relative", zIndex: 1 }}
                          />

                          <Image
                            src={`/tokens/${stratergy.borrowTicker}.svg`}
                            alt={`${stratergy.borrowTicker}`}
                            width={15}
                            height={15}
                            style={{
                              position: "relative",
                              marginLeft: "-5px",
                              zIndex: 2,
                            }}
                          />
                        </div>

                        <p>
                          {stratergy.baseTicker} / {stratergy.borrowTicker}
                        </p>
                      </div>

                      <div className={styles.rewardContainer}>
                        <Image
                          src={`/tokens/${stratergy.rewardTicker}.svg`}
                          alt={`${stratergy.rewardTicker}`}
                          width={15}
                          height={15}
                        />
                        <p>{stratergy.rewardTicker}</p>
                      </div>

                      <div className={styles.APYContainer}>
                        <Image
                          src={`/icons/APYStars.svg`}
                          alt={`Stars icon`}
                          width={10}
                          height={10}
                        />
                        <p className={styles.stratergyAPY}>{stratergy.APY}%</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {showTooltip && (
              <div
                className={styles.tooltip}
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y - 25}px`,
                }}
              >
                {tooltipContent}
              </div>
            )}

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
