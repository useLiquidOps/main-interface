"use client";
import React, { useState, useEffect } from "react";
import styles from "./WithdrawRepay.module.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import PercentagePicker from "../PercentagePicker/PercentagePicker";
import InputBox from "../InputBox/InputBox";
import Image from "next/image";
import { formatMaxAmount } from "../utils/utils";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useLend } from "@/hooks/actions/useLend";
import { useBorrow } from "@/hooks/actions/useBorrow";

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

  const { unlend, isUnlending, unlendError } = useLend();
  const { repay, isRepaying, repayError } = useBorrow();

  // TODO: fill in with real data
  const networkFee = 0;
  const interestOwed = 10;
  const utilizationRate = 0.75;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error" | "pending"
  >("idle");

  // Reset submit status after success or error
  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

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

  const handleSubmit = () => {
    if (!inputValue) return;

    setSubmitStatus("loading");
    const quantityBigInt = BigInt(Math.floor(parseFloat(inputValue) * 1)); // TODO: Add proper decimal handling

    const params = {
      token: ticker.toUpperCase(),
      quantity: quantityBigInt,
    };

    const callbacks = {
      onSuccess: (result: any) => {
        console.log(`LiquidOps ${mode} Response:`, result);

        if (result.status === "pending") {
          setSubmitStatus("pending");
          setInputValue("");
          setTimeout(() => setSubmitStatus("idle"), 2000);
        } else if (result.status === true) {
          setSubmitStatus("success");
          setInputValue("");
          setTimeout(() => setSubmitStatus("idle"), 2000);
        } else {
          setSubmitStatus("error");
          setInputValue("");
          setTimeout(() => setSubmitStatus("idle"), 2000);
        }
      },
      onError: (error: any) => {
        console.error(`LiquidOps ${mode} Error:`, error);
        setSubmitStatus("error");
        setInputValue("");
        setTimeout(() => setSubmitStatus("idle"), 2000);
      },
    };

    if (mode === "withdraw") {
      unlend(params, callbacks);
    } else {
      repay(params, callbacks);
    }
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

      <SubmitButton
        onSubmit={handleSubmit}
        isLoading={mode === "withdraw" ? isUnlending : isRepaying}
        disabled={!inputValue || parseFloat(inputValue) <= 0}
        error={mode === "withdraw" ? unlendError : repayError}
        status={submitStatus}
      />
    </div>
  );
};

export default WithdrawRepay;
