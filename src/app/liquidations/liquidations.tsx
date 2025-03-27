"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./liquidations.module.css";
import Header from "../../components/Header/Header";
import { liquidationsData } from "../data";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { useModal, ModalProvider } from "../[ticker]/PopUp/PopUp";
import LiquidateTab from "./LiquidateTab/LiquidateTab";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import { Quantity } from "ao-tokens";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/hooks/data/useTokenPrice";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

// Import components
import LiquidationStats from "./LiquidationStats/LiquidationStats";
import TokenFiltersContainer from "./TokenFilter/TokenFilterContainer/TokenFiltersContainer";
import LiquidationsList from "./LiquidationsList/LiquidationsList";

// Import utils
import { calculateLiquidationStats } from "./calculateLiquidationStats";

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
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <LiquidationStats stats={stats} />

          <TokenFiltersContainer
            receiveTokens={receiveTokens}
            sendTokens={sendTokens}
            selectedReceiveToken={selectedReceiveToken}
            selectedSendToken={selectedSendToken}
            showReceiveDropdown={showReceiveDropdown}
            showSendDropdown={showSendDropdown}
            toggleReceiveDropdown={toggleReceiveDropdown}
            toggleSendDropdown={toggleSendDropdown}
            setSelectedReceiveToken={setSelectedReceiveToken}
            setSelectedSendToken={setSelectedSendToken}
            setShowReceiveDropdown={setShowReceiveDropdown}
            setShowSendDropdown={setShowSendDropdown}
          />

          <LiquidationsList
            liquidations={filteredLiquidations}
            onLiquidate={handleLiquidate}
            getTokenPrice={getTokenPrice}
          />
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
      <Footer />
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
