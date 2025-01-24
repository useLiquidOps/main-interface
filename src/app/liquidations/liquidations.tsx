"use client";
import styles from "./liquidations.module.css";
import Header from "../../components/Header/Header";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { liquidationsData } from "../data";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import DropdownButton from "@/components/DropDown/DropDown";
import { useModal, ModalProvider } from "../[ticker]/PopUp/PopUp";
import LiquidateTab from "../../components/LiquidateTab/LiquidateTab";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/hooks/data/useTokenPrice";
import Banner from "@/components/Banner/Banner";

interface TokenInfo {
  ticker: string;
  icon: string;
}

const calculateLiquidationStats = (liquidations: any[]) => {
  return liquidations.reduce(
    (acc, liquidation) => {
      return {
        availableLiquidations: Quantity.__add(
          acc.availableLiquidations,
          liquidation.toToken.available,
        ),
        totalProfit: Quantity.__add(
          acc.totalProfit,
          liquidation.toToken.available,
        ),
        markets: new Set([
          ...acc.markets,
          liquidation.fromToken.symbol,
          liquidation.toToken.symbol,
        ]),
      };
    },
    {
      availableLiquidations: new Quantity(0n, 12n),
      totalProfit: new Quantity(0n, 12n),
      markets: new Set<string>(),
    },
  );
};

const LiquidationsContent = () => {
  const [mounted, setMounted] = useState(false);
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);
  const [showSendDropdown, setShowSendDropdown] = useState(false);
  const [selectedReceiveToken, setSelectedReceiveToken] = useState({
    ticker: "All tokens",
    icon: "/icons/list.svg",
  });
  const [selectedSendToken, setSelectedSendToken] = useState({
    ticker: "All tokens",
    icon: "/icons/list.svg",
  });
  const { modalType, assetData, openModal, closeModal } = useModal();
  const { data: supportedTokens = [] } = useSupportedTokens();
  const { data: prices } = usePrices();

  const getTokenPrice = (symbol: string) => {
    const geckoId = tickerToGeckoMap[symbol.toUpperCase()];
    return new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLiquidate = (liquidation: any) => {
    const fromPrice = getTokenPrice(liquidation.fromToken.symbol);
    const toPrice = getTokenPrice(liquidation.toToken.symbol);

    const enhancedLiquidation = {
      ...liquidation,
      fromToken: {
        ...liquidation.fromToken,
        price: fromPrice,
      },
      toToken: {
        ...liquidation.toToken,
        price: toPrice,
      },
      conversionRate: fromPrice.toNumber() / toPrice.toNumber(),
    };
    openModal("liquidate", enhancedLiquidation);
  };

  const receiveTokens = useMemo(
    () => [
      { ticker: "All tokens", icon: "/icons/list.svg" },
      ...supportedTokens,
    ],
    [supportedTokens],
  );

  const sendTokens = useMemo(
    () => [
      { ticker: "All tokens", icon: "/icons/list.svg" },
      ...supportedTokens,
    ],
    [supportedTokens],
  );

  const filteredLiquidations = useMemo(() => {
    return liquidationsData.filter((liquidation) => {
      const receiveMatches =
        selectedReceiveToken.ticker === "All tokens" ||
        liquidation.toToken.symbol === selectedReceiveToken.ticker;
      const sendMatches =
        selectedSendToken.ticker === "All tokens" ||
        liquidation.fromToken.symbol === selectedSendToken.ticker;
      return receiveMatches && sendMatches;
    });
  }, [selectedReceiveToken.ticker, selectedSendToken.ticker, liquidationsData]);

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
      <Banner />
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
                    src={selectedSendToken.icon}
                    alt={selectedSendToken.ticker}
                    width={16}
                    height={16}
                  />
                  <span>{selectedSendToken.ticker}</span>
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
                          key={token.ticker}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedSendToken(token);
                            setShowSendDropdown(false);
                          }}
                        >
                          <Image
                            src={token.icon}
                            alt={token.ticker}
                            width={16}
                            height={16}
                          />
                          <span>{token.ticker}</span>
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
                    src={selectedReceiveToken.icon}
                    alt={selectedReceiveToken.ticker}
                    width={16}
                    height={16}
                  />
                  <span>{selectedReceiveToken.ticker}</span>
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
                          key={token.ticker}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setSelectedReceiveToken(token);
                            setShowReceiveDropdown(false);
                          }}
                        >
                          <Image
                            src={token.icon}
                            alt={token.ticker}
                            width={16}
                            height={16}
                          />
                          <span>{token.ticker}</span>
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
                        $
                        {getTokenPrice(
                          liquidation.fromToken.symbol,
                        ).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
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
                targetUserAddress={[""]}
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
