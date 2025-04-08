"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton/SubmitButton";
import InputBox from "../InputBox/InputBox";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import styles from "./ActionTab.module.css";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { useLend } from "@/hooks/actions/useLend";
import { useBorrow } from "@/hooks/actions/useBorrow";
import { Quantity } from "ao-tokens";
import { tokenInput } from "liquidops";
import { useLoadingScreen } from "../LoadingScreen/useLoadingScreen";
import { getBaseDenomination } from "@/utils/getBaseDenomination";

interface ActionTabProps {
  ticker: string;
  mode: "supply" | "borrow";
}

const ActionTab: React.FC<ActionTabProps> = ({ ticker, mode }) => {
  const { price: tokenPrice } = useTokenPrice(ticker.toUpperCase());
  const { data: protocolStats, isLoading: isLoadingProtocolStats } =
    useProtocolStats(ticker.toUpperCase());
  const { tokenAddress } = tokenInput(ticker.toUpperCase());
  const { data: walletBalance, isLoading: isLoadingBalance } =
    useUserBalance(tokenAddress);

  const { lend, isLending, lendError } = useLend();
  const { borrow, isBorrowing, borrowError } = useBorrow();

  const utilizationRate = new Quantity(75, 2n);
  const networkFee = 0;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Reset input callback
  const resetInput = useCallback(() => {
    setInputValue("");
  }, []);

  // Initialize loading screen hook
  const { state: loadingScreenState, actions: loadingScreenActions } =
    useLoadingScreen(
      mode === "supply" ? isLending : isBorrowing,
      mode === "supply" ? lendError : borrowError,
      resetInput,
    );

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

    // Create params for the transaction
    const baseDenomination = getBaseDenomination(ticker.toUpperCase());
    const params = {
      token: ticker.toUpperCase(),
      quantity: new Quantity(0n, baseDenomination).fromString(inputValue).raw,
    };

    // Execute appropriate action based on mode
    if (mode === "supply") {
      loadingScreenActions.executeTransaction(inputValue, params, lend);
    } else {
      loadingScreenActions.executeTransaction(inputValue, params, borrow);
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
        // @ts-ignore, skeleton loading logic relies on this being undefined
        walletBalance={walletBalance}
        onMaxClick={handleMaxClick}
        denomination={walletBalance?.denomination || 12n}
        bypassBalanceCheck={mode === "borrow"}
      />

      <div className={styles.infoContainer}>
        <div className={styles.infoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              {mode === "supply" ? "Supply" : "Borrow"} APY:{" "}
              {isLoadingProtocolStats ? "0.00" : protocolStats?.supplyAPR}%
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
        disabled={
          !inputValue ||
          parseFloat(inputValue) <= 0 ||
          loadingScreenState.submitStatus === "loading"
        }
        submitText={mode === "supply" ? "Deposit" : "Borrow"}
      />

      {/* Loading Screen Modal */}
      <LoadingScreen
        loadingState={loadingScreenState.state}
        action={mode === "supply" ? "lending" : "borrowing"}
        tokenTicker={ticker}
        amount={loadingScreenState.transactionAmount}
        txId={loadingScreenState.transactionId}
        isOpen={loadingScreenState.isOpen}
        onClose={loadingScreenActions.closeLoadingScreen}
        error={loadingScreenState.error}
      />
    </div>
  );
};

export default ActionTab;
