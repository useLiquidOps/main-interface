"use client";
import styles from "./liquidations.module.css";
import Header from "../../components/Header/Header";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { liquidationsData, tokens } from "../data";
import DropdownButton from "@/components/DropDown/DropDown";
import { useModal, ModalProvider } from "../[ticker]/PopUp/PopUp";
import LiquidateTab from "./LiquidateTab/LiquidateTab";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import { formatTMB } from "@/components/utils/utils";

interface TokenInfo {
  symbol: string;
  imagePath: string;
}

const calculateLiquidationStats = (liquidations: any[]) => {
  // TODO: correct stats when real data is here
  return liquidations.reduce(
    (acc, liquidation) => {
      return {
        availableLiquidations:
          acc.availableLiquidations + liquidation.toToken.available,
        totalProfit: acc.totalProfit + liquidation.toToken.available,
        markets: new Set([
          ...acc.markets,
          liquidation.fromToken.symbol,
          liquidation.toToken.symbol,
        ]),
      };
    },
    {
      availableLiquidations: 0,
      totalProfit: 0,
      markets: new Set<string>(),
    },
  );
};

const LiquidationsContent = () => {
  const [mounted, setMounted] = useState(false);
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);
  const [showSendDropdown, setShowSendDropdown] = useState(false);
  const [selectedReceiveToken, setSelectedReceiveToken] = useState<TokenInfo>({
    symbol: "All tokens",
    imagePath: "/icons/list.svg",
  });
  const [selectedSendToken, setSelectedSendToken] = useState<TokenInfo>({
    symbol: "All tokens",
    imagePath: "/icons/list.svg",
  });
  const { modalType, assetData, openModal, closeModal } = useModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getConversionRate = (fromPrice: number, toPrice: number) => {
    return fromPrice / toPrice;
  };

  const handleLiquidate = (liquidation: any) => {
    const enhancedLiquidation = {
      ...liquidation,
      conversionRate: getConversionRate(
        liquidation.fromToken.price,
        liquidation.toToken.price,
      ),
    };
    openModal("liquidate", enhancedLiquidation);
  };

  const receiveTokens = useMemo(
    () => [{ symbol: "All tokens", imagePath: "/icons/list.svg" }, ...tokens],
    [],
  );

  const sendTokens = useMemo(
    () => [{ symbol: "All tokens", imagePath: "/icons/list.svg" }, ...tokens],
    [],
  );

  const filteredLiquidations = useMemo(() => {
    return liquidationsData.filter((liquidation) => {
      const receiveMatches =
        selectedReceiveToken.symbol === "All tokens" ||
        liquidation.toToken.symbol === selectedReceiveToken.symbol;
      const sendMatches =
        selectedSendToken.symbol === "All tokens" ||
        liquidation.fromToken.symbol === selectedSendToken.symbol;
      return receiveMatches && sendMatches;
    });
  }, [selectedReceiveToken.symbol, selectedSendToken.symbol]);

  const stats = useMemo(
    () => calculateLiquidationStats(filteredLiquidations),
    [filteredLiquidations],
  );

  const toggleReceiveDropdown = () => {
    setShowReceiveDropdown(!showReceiveDropdown);
    setShowSendDropdown(false);
  };

  const toggleSendDropdown = () => {
    setShowSendDropdown(!showSendDropdown);
    setShowReceiveDropdown(false);
  };

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <AnimatePresence>
        {(showReceiveDropdown || showSendDropdown) && (
          <motion.div
            className={styles.modalOverlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => {
              setShowReceiveDropdown(false);
              setShowSendDropdown(false);
            }}
          />
        )}
      </AnimatePresence>
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.liquidationStats}>
            <div className={styles.liquidationStat}>
              <p className={styles.liquidationStatValue}>
                ${formatTMB(stats.availableLiquidations)}
              </p>
              <p className={styles.liquidationStatTitle}>
                Available liquidations
              </p>
            </div>
            <div className={styles.liquidationStat}>
              <p className={styles.liquidationStatValue}>
                ${formatTMB(stats.totalProfit)}
              </p>
              <p className={styles.liquidationStatTitle}>Total profit</p>
            </div>
            <div className={styles.liquidationStat}>
              <p className={styles.liquidationStatValue}>
                {stats.markets.size}
              </p>
              <p className={styles.liquidationStatTitle}>Markets</p>
            </div>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Send</span>
              <div
                className={styles.dropdownContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSendDropdown();
                }}
              >
                <button className={styles.filterButton}>
                  <Image
                    src={selectedSendToken.imagePath}
                    alt={selectedSendToken.symbol}
                    width={16}
                    height={16}
                  />
                  <span>{selectedSendToken.symbol}</span>
                  <DropdownButton
                    isOpen={showSendDropdown}
                    onToggle={toggleSendDropdown}
                  />
                </button>
                <AnimatePresence>
                  {showSendDropdown && (
                    <motion.div
                      className={styles.dropdown}
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {sendTokens.map((token) => (
                        <div
                          key={token.symbol}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedSendToken(token);
                            setShowSendDropdown(false);
                          }}
                        >
                          <Image
                            src={token.imagePath}
                            alt={token.symbol}
                            width={16}
                            height={16}
                          />
                          <span>{token.symbol}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Receive</span>
              <div
                className={styles.dropdownContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReceiveDropdown();
                }}
              >
                <button className={styles.filterButton}>
                  <Image
                    src={selectedReceiveToken.imagePath}
                    alt={selectedReceiveToken.symbol}
                    width={16}
                    height={16}
                  />
                  <span>{selectedReceiveToken.symbol}</span>
                  <DropdownButton
                    isOpen={showReceiveDropdown}
                    onToggle={toggleReceiveDropdown}
                  />
                </button>
                <AnimatePresence>
                  {showReceiveDropdown && (
                    <motion.div
                      className={styles.dropdown}
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {receiveTokens.map((token) => (
                        <div
                          key={token.symbol}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedReceiveToken(token);
                            setShowReceiveDropdown(false);
                          }}
                        >
                          <Image
                            src={token.imagePath}
                            alt={token.symbol}
                            width={16}
                            height={16}
                          />
                          <span>{token.symbol}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className={styles.liquidationsList}>
            {filteredLiquidations.length > 0 ? (
              filteredLiquidations.map((liquidation, index) => (
                <div key={index} className={styles.liquidationRowWrapper}>
                  <div
                    className={styles.liquidationRow}
                    onClick={() => handleLiquidate(liquidation)}
                  >
                    <div className={styles.tokenInfo}>
                      <div className={styles.iconWrapper}>
                        <Image
                          src={liquidation.fromToken.icon}
                          alt={liquidation.fromToken.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className={styles.nameSymbol}>
                        <h2 className={styles.name}>
                          {liquidation.fromToken.name}
                        </h2>
                        <p className={styles.symbol}>
                          {liquidation.fromToken.symbol}
                        </p>
                      </div>
                    </div>

                    <div className={styles.arrowContainer}>
                      <Image
                        src="/icons/arrow-right.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                      />
                    </div>

                    <div className={styles.tokenInfo}>
                      <div className={styles.iconWrapper}>
                        <Image
                          src={liquidation.toToken.icon}
                          alt={liquidation.toToken.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className={styles.nameSymbol}>
                        <h2 className={styles.name}>
                          {liquidation.toToken.name}
                        </h2>
                        <p className={styles.symbol}>
                          {liquidation.toToken.symbol}
                        </p>
                      </div>
                    </div>

                    <div className={styles.metricBox}>
                      <div className={styles.metricValue}>
                        <p style={{ paddingRight: "2px", margin: "0px" }}>
                          {formatTMB(liquidation.toToken.available)}
                        </p>
                        <p style={{ paddingLeft: "2px", margin: "0px" }}>
                          {liquidation.toToken.symbol}
                        </p>
                      </div>
                      <p className={styles.metricLabel}>Profit</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        <p className={styles.metricValue}>
                          <span style={{ paddingRight: "2px", margin: "0px" }}>
                            {formatTMB(liquidation.toToken.available)}
                          </span>
                          <span style={{ paddingLeft: "2px", margin: "0px" }}>
                            {liquidation.toToken.symbol}
                          </span>
                        </p>
                      </p>
                      <p className={styles.metricLabel}>Available</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        ${formatTMB(liquidation.fromToken.price)}
                      </p>
                      <p className={styles.metricLabel}>Price</p>
                    </div>
                  </div>
                  <button
                    className={styles.liquidateButton}
                    onClick={() => handleLiquidate(liquidation)}
                  >
                    <Image
                      src="/icons/liquidate.svg"
                      alt="Liquidate"
                      width={20}
                      height={20}
                      className={styles.liquidateIcon}
                    />
                    <span>Liquidate</span>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noLiquidations}>
                <p>No liquidations found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalType === "liquidate" && assetData && (
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
              <LiquidateTab
                onClose={closeModal}
                fromToken={assetData.fromToken}
                toToken={assetData.toToken}
                offMarketPrice={assetData.offMarketPrice}
                conversionRate={assetData.conversionRate}
                targetUserAddress={["ADD HERE WHEN KNOWN"]} // TODO: add target user address'
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Liquidations = () => {
  return (
    <ModalProvider>
      <LiquidationsContent />
    </ModalProvider>
  );
};

export default Liquidations;
