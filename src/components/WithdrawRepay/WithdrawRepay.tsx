"use client";
import React, { useState } from "react";
import styles from "./WithdrawRepay.module.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import PercentagePicker from "../PercentagePicker/PercentagePicker";
import InputBox from "../InputBox/InputBox";
import Image from "next/image";
import { formatMaxAmount, formatNumberWithCommas } from "../utils/utils";
import { headerTokensData } from "@/app/data";

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
  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const tokenToUsdRate = 15;
  const walletBalance = 222122;
  const utilizationRate = 0.75;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

  const calculateMaxAmount = () => {
    if (mode === "withdraw") {
      return walletBalance;
    } else {
      return walletBalance * utilizationRate;
    }
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(formatMaxAmount(maxAmount));
    setSelectedPercentage(100);
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

      <div className={styles.statsContainer}>
        <div className={styles.tokenInfo}>
          <Image
            src={`/tokens/${ticker}.svg`}
            height={35}
            width={35}
            alt={ticker}
          />
          <div className={styles.tokenDetails}>
            <p className={styles.tokenName}>{tokenData?.name}</p>
            <p className={styles.ticker}>
              {formatNumberWithCommas(walletBalance)} {ticker}
            </p>
          </div>
        </div>

        <div className={styles.aprInfo}>
          <p className={styles.apr}>APR {tokenData?.APR}%</p>
          <div className={styles.aprChange}>
            <Image
              src={
                tokenData?.percentChange.outcome
                  ? "/icons/APRUp.svg"
                  : "/icons/APRDown.svg"
              }
              height={15}
              width={15}
              alt={tokenData?.percentChange.outcome ? "APR Up" : "APR Down"}
            />
            <p className={styles.percentageChange}>
              {tokenData?.percentChange.change}%
            </p>
          </div>
        </div>
      </div>

      <InputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        ticker={ticker}
        tokenToUsdRate={tokenToUsdRate}
        walletBalance={walletBalance}
        onMaxClick={handleMaxClick}
      />

      <PercentagePicker
        mode={mode}
        selectedPercentage={selectedPercentage}
        currentPercentage={getCurrentPercentage()}
        onPercentageClick={handlePercentageClick}
      />

      <SubmitButton />
    </div>
  );
};

export default WithdrawRepay;
