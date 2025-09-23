"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import styles from "./WithdrawRepay.module.css";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import PercentagePicker from "@/components/PercentagePicker/PercentagePicker";
import InputBox from "@/components/InputBox/InputBox";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import Image from "next/image";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useLend } from "@/hooks/actions/useLend";
import { useBorrow } from "@/hooks/actions/useBorrow";
import { Quantity } from "ao-tokens-lite";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/LiquidOpsData/useGetPosition";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { useValueLimit } from "@/hooks/data/useValueLimit";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { AnimatePresence, motion } from "framer-motion";
import { warningVariants } from "@/components/DropDown/FramerMotion";
import { useCooldown } from "@/hooks/data/useCooldown";
import { useGetPositionBalance } from "@/hooks/LiquidOpsData/useGetPositionBalance";
import { useUserBalance } from "@/hooks/data/useUserBalance";

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

  const { tokenAddress, oTokenAddress } = tokenInput(ticker.toUpperCase());
  const { data: positionBalance, isLoading: isLoadingPosition } =
    useGetPosition(tokenAddress);
  const { data: lentBalance, isLoading: isLoadingBalance } =
    useGetPositionBalance(tokenAddress);
  const { data: oTokenBalance, isLoading: isLoadingOTokenBalance } =
    useUserBalance(oTokenAddress);

  const currentBalance = useMemo(
    () => mode === "withdraw" ? lentBalance : positionBalance,
    [mode, lentBalance, positionBalance]
  );
  const isLoadingCurrentBalance = useMemo(
    () => mode === "withdraw" ? isLoadingBalance : isLoadingPosition,
    [mode, isLoadingBalance, isLoadingPosition]
  );

  const { unlend, isUnlending, unlendError } = useLend({
    onSuccess: onClose,
  });
  const { repay, isRepaying, repayError } = useBorrow({
    onSuccess: onClose,
  });

  const networkFee = 0;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [notLoadedBalance, setNotLoadedBalance] = useState<string | boolean>(
    false,
  );
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const { data: cooldownData } = useCooldown(mode, ticker);

  useEffect(() => {
    if (!hasUserInteracted) return;

    if (mode === "withdraw" && isLoadingOTokenBalance) {
      setNotLoadedBalance("oToken");
    } else if (mode === "repay" && isLoadingCurrentBalance) {
      setNotLoadedBalance("token");
    } else {
      setNotLoadedBalance(false);
    }
  }, [
    mode,
    isLoadingOTokenBalance,
    isLoadingCurrentBalance,
    hasUserInteracted,
  ]);

  // Reset input callback
  const resetInput = useCallback(() => {
    setInputValue("");
  }, []);

  // Initialize loading screen hook
  const { state: loadingScreenState, actions: loadingScreenActions } =
    useLoadingScreen(
      mode === "withdraw" ? isUnlending : isRepaying,
      mode === "withdraw" ? unlendError : repayError,
      resetInput,
    );

  const { data: protocolStats, isLoading: isLoadingProtocolStats } =
    useProtocolStats(ticker.toUpperCase());
  const [valueLimit, valueLimitReached] = useValueLimit(
    inputValue,
    protocolStats,
  );

  const handleMaxClick = () => {
    setHasUserInteracted(true);
    if (!currentBalance) {
      // Set loading state only in event handlers, not during render
      setNotLoadedBalance(mode === "withdraw" ? "oToken" : "token");
      return;
    }
    setInputValue(currentBalance.toString());
  };

  const handlePercentageClick = (percentage: number) => {
    setHasUserInteracted(true);
    if (!currentBalance) {
      // Set loading state only in event handlers, not during render
      setNotLoadedBalance(mode === "withdraw" ? "oToken" : "token");
      return;
    }

    const amount = Quantity.__div(
      Quantity.__mul(currentBalance, new Quantity(0n, 12n).fromNumber(percentage)),
      new Quantity(0n, 12n).fromNumber(100),
    );
    setInputValue(amount.toString());
  };

  const currentPercentage = useMemo(
    () => {
      // no data
      if (
        !currentBalance ||
        !inputValue ||
        Quantity.eq(currentBalance, new Quantity(0n, 12n))
      ) {
        return 0;
      }

      if (isNaN(Number(inputValue.replace(/,/g, "")))) return 0;

      const percentage = Quantity.__div(
        Quantity.__mul(
          new Quantity(0n, currentBalance.denomination).fromString(inputValue),
          new Quantity(0n, currentBalance.denomination).fromNumber(100),
        ),
        currentBalance,
      );
      return Math.min(100, Math.max(0, percentage.toNumber()));
    },
    [currentBalance, inputValue]
  );

  const handleSubmit = () => {
    setHasUserInteracted(true);
    if (!inputValue) {
      alert("Please enter an amount to " + mode + ".");
      return;
    }

    let quantity = new Quantity(0n, currentBalance?.denomination).fromString(
      inputValue,
    );

    // If unlending (withdrawing), multiply by the oToken rate to send correct oToken amount to protocol
    if (mode === "withdraw") {
      if (isLoadingOTokenBalance) {
        setNotLoadedBalance("oToken");
        return;
      }

      const userOTokenRate = Number(oTokenBalance) / Number(lentBalance);
      const oTokenAmount = Number(quantity) * userOTokenRate;
      quantity = new Quantity(0n, currentBalance?.denomination).fromNumber(
        oTokenAmount,
      );
    }

    const params = {
      token: ticker.toUpperCase(),
      quantity: quantity.raw,
    };

    if (mode === "withdraw") {
      unlend(params);
    } else {
      repay(params);
    }
  };

  return (
    <div className={styles.actionTab}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          {mode === "withdraw" ? "Withdraw" : "Repay loan"}
        </p>
        <button className={styles.close} onClick={onClose}>
          <Image
            src="./icons/close-icon.svg"
            height={9}
            width={9}
            alt="Close"
          />
        </button>
      </div>

      <InputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        ticker={ticker}
        tokenPrice={tokenPrice}
        // @ts-ignore, logic relies on undefined to show skeleton loading
        walletBalance={currentBalance}
        onMaxClick={handleMaxClick}
        denomination={currentBalance?.denomination || 12n}
      />

      <PercentagePicker
        mode={mode}
        currentPercentage={currentPercentage}
        onPercentageClick={handlePercentageClick}
        // @ts-ignore, logic relies on undefined to disable percentage picker
        walletBalance={currentBalance}
      />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Network fee: {networkFee} AO</span>
      </div>

      <AnimatePresence>
        {valueLimitReached && mode === "withdraw" && (
          <motion.p
            variants={warningVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={styles.warning}
          >
            <Image
              src="/icons/activity/warning.svg"
              height={45}
              width={45}
              alt="Error icon"
            />
            You can only {mode + " "} up to{" "}
            {valueLimit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }) +
              " " +
              ticker +
              " per transaction"}
            .
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cooldownData && cooldownData.onCooldown && (
          <motion.p
            variants={warningVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={styles.warning}
          >
            <Image
              src="/icons/activity/warning.svg"
              height={45}
              width={45}
              alt="Error icon"
            />
            You are on a cooldown for{" "}
            {/*
            // @ts-ignore */}
            {cooldownData.remainingBlocks.toString() + " "} block(s).
          </motion.p>
        )}
      </AnimatePresence>

      {/* data is still loading error */}
      <AnimatePresence>
        {notLoadedBalance && (
          <motion.p
            variants={warningVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={styles.warning}
          >
            <Image
              src="/icons/activity/warning.svg"
              height={45}
              width={45}
              alt="Error icon"
            />
            Not loaded {notLoadedBalance} balance, please wait a moment and try
            again.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(repayError || unlendError) && (
          <motion.p
            variants={warningVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={styles.warning}
          >
            <Image
              src="/icons/activity/warning.svg"
              height={45}
              width={45}
              alt="Error icon"
            />
            {(repayError || unlendError)?.message || "Unknown error"}
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton
        onSubmit={handleSubmit}
        disabled={
          !inputValue ||
          parseFloat(inputValue) <= 0 ||
          loadingScreenState.submitStatus === "loading" ||
          (mode === "withdraw" && valueLimitReached) ||
          cooldownData?.onCooldown
        }
        loading={isRepaying || isUnlending}
        submitText={mode === "withdraw" ? "Withdraw" : "Repay"}
      />

      {/* Loading Screen Modal */}
      <LoadingScreen
        loadingState={loadingScreenState.state}
        action={mode === "withdraw" ? "unLending" : "repaying"}
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

export default WithdrawRepay;
