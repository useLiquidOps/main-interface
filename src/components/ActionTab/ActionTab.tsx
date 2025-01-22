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
import { useBorrow } from "@/hooks/actions/useBorrow";
import { Quantity } from "ao-tokens";

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
  const { borrow, isBorrowing, borrowError } = useBorrow();

  const utilizationRate = new Quantity(75, 2n);
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
    if (isLoadingBalance || !walletBalance) return new Quantity(0n, 12n);
    if (mode === "supply") {
      return walletBalance;
    } else {
      return Quantity.__mul(walletBalance, utilizationRate);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(
      maxAmount.toLocaleString("en-US", {
        maximumFractionDigits: 8,
        useGrouping: true,
      }),
    );
  };

  const handleSubmit = () => {
    if (!inputValue || !walletBalance) return;

    setSubmitStatus("loading");

    const params = {
      token: ticker.toUpperCase(),
      quantity: new Quantity(0n, walletBalance.denomination).fromString(
        inputValue,
      ).raw,
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

    if (mode === "supply") {
      lend(params, callbacks);
    } else {
      borrow(params, callbacks);
    }
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
        walletBalance={
          isLoadingBalance || !walletBalance
            ? new Quantity(0n, 12n)
            : walletBalance
        }
        onMaxClick={handleMaxClick}
        denomination={walletBalance?.denomination || 12n}
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
        isLoading={mode === "supply" ? isLending : isBorrowing}
        disabled={!inputValue || parseFloat(inputValue) <= 0}
        error={mode === "supply" ? lendError : borrowError}
        status={submitStatus}
      />
    </div>
  );
};

export default ActionTab;
