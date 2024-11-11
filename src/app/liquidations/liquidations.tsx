"use client";
import styles from "./liquidations.module.css";
import Header from "../../components/Header/Header";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { liquidationsData, tokens } from "../data";
import DropdownButton from "@/components/DropDown/DropDown";
import { useModal, ModalProvider } from "../[ticker]/PopUp/PopUp";

interface TokenInfo {
  symbol: string;
  imagePath: string;
}

const Liquidations = () => {
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickOutside = () => {
    setShowReceiveDropdown(false);
    setShowSendDropdown(false);
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

  const toggleReceiveDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReceiveDropdown(!showReceiveDropdown);
    setShowSendDropdown(false);
  };

  const toggleSendDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSendDropdown(!showSendDropdown);
    setShowReceiveDropdown(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ModalProvider>

    
    <div className={styles.page}>
      <Header />
      <div className={styles.body} onClick={handleClickOutside}>
        <div className={styles.bodyContainer}>
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Send</span>
              <div className={styles.dropdownContainer}>
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
                {showSendDropdown && (
                  <div className={styles.dropdown}>
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
                  </div>
                )}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Receive</span>
              <div className={styles.dropdownContainer}>
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
                {showReceiveDropdown && (
                  <div className={styles.dropdown}>
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
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.liquidationsList}>
            {filteredLiquidations.length > 0 ? (
              filteredLiquidations.map((liquidation, index) => (
                <div key={index} className={styles.liquidationRowWrapper}>
                  <div className={styles.liquidationRow}>
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
                      <p className={styles.metricValue}>{liquidation.profit}</p>
                      <p className={styles.metricLabel}>Profit</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        {liquidation.available}
                      </p>
                      <p className={styles.metricLabel}>Available</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>{liquidation.price}</p>
                      <p className={styles.metricLabel}>Price</p>
                    </div>
                  </div>
                  <button className={styles.liquidateButton}>
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
    </div>
    </ModalProvider>
  );
};

export default Liquidations;
