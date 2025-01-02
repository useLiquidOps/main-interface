"use client";
import React, { useState } from "react";
import styles from "./WithdrawRepay.module.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import PercentagePicker from "../PercentagePicker/PercentagePicker";
import InputBox from "../InputBox/InputBox";
import Image from "next/image";
import { formatMaxAmount } from "../utils/utils";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useTokenPrice } from "@/hooks/useTokenPrice";

interface WithdrawRepayProps {
  mode: "withdraw" | "repay";
  ticker: string;
  onClose: () => void;
}

const WithdrawRepay: React.FC<WithdrawRepayProps> = ({
  mode,
  ticker,
  onClose,
}) => {
  const { price: tokenPrice } = useTokenPrice(ticker.toUpperCase());
  const { data: walletBalance, isLoading: isLoadingBalance } = useUserBalance(
    ticker.toUpperCase(),
  );

  // TODO: fill in with real data
  const networkFee = 0;
  const interestOwed = 10;
  const utilizationRate = 0.75;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

  const calculateMaxAmount = () => {
    if (isLoadingBalance || !walletBalance) return 0;
    if (mode === "withdraw") {
      return walletBalance;
    } else {
      return walletBalance * utilizationRate;
    }
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(formatMaxAmount(maxAmount));
  };

  const handlePercentageClick = (percentage: number) => {
    const maxAmount = calculateMaxAmount();
    const amount = (maxAmount * percentage) / 100;
    setInputValue(formatMaxAmount(amount));
    setSelectedPercentage(percentage);
  };

  const getCurrentPercentage = () => {
    const maxAmount = calculateMaxAmount();
    if (!inputValue || maxAmount === 0) return 0;

    const numberValue = Number(inputValue.replace(/,/g, ""));
    if (isNaN(numberValue)) return 0;

    const percentage = (numberValue / maxAmount) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const handleInterestClick = () => {
    setInputValue(formatMaxAmount(interestOwed));
    setSelectedPercentage(null);
  };

  return (
    <div className={styles.actionTab}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          {mode === "withdraw" ? "Withdraw" : "Repay loan"}
        </p>
        <button className={styles.close} onClick={onClose}>
          <Image src="/icons/close.svg" height={9} width={9} alt="Close" />
        </button>
      </div>

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

      <PercentagePicker
        mode={mode}
        selectedPercentage={selectedPercentage}
        currentPercentage={getCurrentPercentage()}
        onPercentageClick={handlePercentageClick}
        interestOwed={interestOwed}
        onInterestClick={handleInterestClick}
        walletBalance={isLoadingBalance || !walletBalance ? 0 : walletBalance}
      />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Network fee: {networkFee} AO</span>
      </div>

      <SubmitButton />
    </div>
  );
};

export default WithdrawRepay;
