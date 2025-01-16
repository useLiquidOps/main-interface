"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton/SubmitButton";
import InputBox from "../InputBox/InputBox";
import styles from "./ActionTab.module.css";
import { formatMaxAmount } from "../utils/utils";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { useLend } from "@/hooks/actions/useLend";

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

  const { lend, isLending, lendError } = useLend();

  const utilizationRate = 0.75;
  const networkFee = 0;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  const handleSubmit = () => {
    if (!inputValue || mode !== "supply") return;

    setSubmitStatus("loading");

    const quantityBigInt = BigInt(Math.floor(parseFloat(inputValue) * 1)); // TODO

    lend(
      {
        token: ticker.toUpperCase(),
        quantity: quantityBigInt,
      },
      {
        onSuccess: (result) => {
          // Log the complete LiquidOps response
          console.log("LiquidOps Raw Response:", result);

          if (result.status === "pending") {
            setSubmitStatus("pending");
          } else if (result.status === true) {
            setSubmitStatus("success");
            setInputValue(""); // Clear input on success
          } else {
            setSubmitStatus("error");
          }
        },
        onError: (error) => {
          console.error("LiquidOps Error:", error);
          setSubmitStatus("error");
        },
      },
    );
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

      <SubmitButton
        onSubmit={handleSubmit}
        isLoading={isLending}
        disabled={!inputValue || parseFloat(inputValue) <= 0}
        error={lendError}
        status={submitStatus}
      />
    </div>
  );
};

export default ActionTab;
