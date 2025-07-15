"use client";
import React, { useState, useCallback } from "react";
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

  const currentBalance = mode === "withdraw" ? lentBalance : positionBalance;
  const isLoadingCurrentBalance =
    mode === "withdraw" ? isLoadingBalance : isLoadingPosition;

  const { unlend, isUnlending, unlendError } = useLend({
    onSuccess: onClose,
  });
  const { repay, isRepaying, repayError } = useBorrow({
    onSuccess: onClose,
  });

  const networkFee = 0;
  const interestOwed = 0.01;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

  const { data: cooldownData } = useCooldown(mode, ticker);

  // Reset input callback
  const resetInput = useCallback(() => {
    setInputValue("");
    setSelectedPercentage(null);
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
  const calculateMaxAmount = () => {
    if (mode === "repay") {
      // Return zero quantity while loading or if no balance
      if (isLoadingOTokenBalance || !oTokenBalance) {
        return new Quantity(0n, 12n);
      }
      return oTokenBalance;
    }

    if (isLoadingCurrentBalance || !currentBalance) {
      return new Quantity(0n, 12n);
    }
    return currentBalance;
  };

  const handleMaxClick = () => {
    // Don't allow max click while data is loading
    if (mode === "repay" && isLoadingOTokenBalance) return;
    if (mode === "withdraw" && isLoadingCurrentBalance) return;

    const maxAmount = calculateMaxAmount();
    setInputValue(maxAmount.toString());
  };

  const handlePercentageClick = (percentage: number) => {
    // Don't allow percentage selection while data is loading
    if (mode === "repay" && isLoadingOTokenBalance) return;
    if (mode === "withdraw" && isLoadingCurrentBalance) return;

    const maxAmount = calculateMaxAmount();
    const amount = Quantity.__div(
      Quantity.__mul(maxAmount, new Quantity(0n, 12n).fromNumber(percentage)),
      new Quantity(0n, 12n).fromNumber(100),
    );
    setInputValue(amount.toString());
    setSelectedPercentage(percentage);
  };
  const getCurrentPercentage = () => {
    const maxAmount = calculateMaxAmount();
    if (!inputValue || Quantity.eq(maxAmount, new Quantity(0n, 12n))) return 0;

    if (isNaN(Number(inputValue.replace(/,/g, "")))) return 0;

    const percentage = Quantity.__div(
      Quantity.__mul(
        new Quantity(0n, maxAmount.denomination).fromString(inputValue),
        new Quantity(0n, maxAmount.denomination).fromNumber(100),
      ),
      maxAmount,
    );
    return Math.min(100, Math.max(0, percentage.toNumber()));
  };

  const handleInterestClick = () => {
    setInputValue(interestOwed.toString());
    setSelectedPercentage(null);
  };

  const handleSubmit = () => {
    if (!inputValue) return;

    if (isLoadingOTokenBalance || isLoadingBalance) {
      throw new Error("Not loaded userOTokenRate!");
    }

    const userOTokenRate = Number(oTokenBalance) / Number(lentBalance);

    if (!userOTokenRate) {
      throw new Error("Not loaded userOTokenRate!");
    }

    if (!currentBalance) {
      throw new Error("Not loaded currentBalance!");
    }

    let quantity = new Quantity(0n, currentBalance?.denomination).fromString(
      inputValue,
    );

    // If unlending (withdrawing), multiply by the oToken rate
    if (mode === "withdraw") {
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
      //loadingScreenActions.executeTransaction(inputValue, params, unlend);
      unlend(params);
    } else {
      //loadingScreenActions.executeTransaction(inputValue, params, repay);
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
        selectedPercentage={selectedPercentage}
        currentPercentage={getCurrentPercentage()}
        onPercentageClick={handlePercentageClick}
        interestOwed={interestOwed}
        onInterestClick={handleInterestClick}
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
