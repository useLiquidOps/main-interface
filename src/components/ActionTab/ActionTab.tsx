"use client";
import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton/SubmitButton";
import InputBox from "../InputBox/InputBox";
import styles from "./ActionTab.module.css";
import { formatMaxAmount } from "../utils/utils";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";

interface ActionTabProps {
  ticker: string;
  mode: "supply" | "borrow";
}

const ActionTab: React.FC<ActionTabProps> = ({ ticker, mode }) => {
  const { price: tokenPrice } = useTokenPrice(ticker.toUpperCase());
  const { data: protocolStats, isLoading: isLoadingProtocolStats } =
    useProtocolStats(ticker.toUpperCase());
  const { data: walletBalance, isLoading: isLoadingBalance } = useUserBalance(
    ticker.toUpperCase(),
  );

  const utilizationRate = 0.75; // TODO: get real value when known
  const networkFee = 0; // TODO: when fee structure is known

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const calculateMaxAmount = () => {
    if (isLoadingBalance || !walletBalance) return 0;
    if (mode === "supply") {
      return walletBalance;
    } else {
      return walletBalance * utilizationRate;
    }
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(formatMaxAmount(maxAmount));
  };

  return (
    <div className={styles.actionTab}>
      <p className={styles.borrowTitle}>
        {mode === "supply" ? "Deposit" : "Borrow"}
      </p>

      <InputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        ticker={ticker}
        tokenPrice={tokenPrice}
        walletBalance={isLoadingBalance || !walletBalance ? 0 : walletBalance}
        onMaxClick={handleMaxClick}
      />

      <div className={styles.infoContainer}>
        <div className={styles.infoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              {mode === "supply" ? "Supply" : "Borrow"} APY:{" "}
              {isLoadingProtocolStats ? "0.00" : protocolStats?.apr}%
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              Network fee: {networkFee} AO
            </span>
          </div>
        </div>
        <Image
          src="/icons/customise.svg"
          height={14}
          width={14}
          alt="Customise"
          className={styles.customiseIcon}
        />
      </div>

      <SubmitButton />
    </div>
  );
};

export default ActionTab;
