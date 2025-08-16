"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import InputBox from "@/components/InputBox/InputBox";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import styles from "./ActionPanel.module.css";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { Quantity } from "ao-tokens-lite";
import { tokenInput } from "liquidops";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { getBaseDenomination } from "@/utils/LiquidOps/getBaseDenomination";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { motion, AnimatePresence } from "framer-motion";
import { warningVariants } from "@/components/DropDown/FramerMotion";
import { useValueLimit } from "@/hooks/data/useValueLimit";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";

interface ActionPanelProps {
  ticker: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ ticker }) => {
  const [mode, setMode] = useState<"delegate" | "withdraw">("delegate");

  const { price: tokenPrice } = useTokenPrice(ticker.toUpperCase());
  const { tokenAddress } = tokenInput(ticker.toUpperCase());
  const { data: walletBalance, isLoading: isLoadingBalance } =
    useUserBalance(tokenAddress);

  //   const { lend, isLending, lendError } = useLend({
  //     onSuccess: onClose,
  //   });
  //   const { borrow, isBorrowing, borrowError } = useBorrow({
  //     onSuccess: onClose,
  //   });

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Reset input callback
  const resetInput = useCallback(() => {
    setInputValue("");
  }, []);

  //   // Initialize loading screen hook
  //   const { state: loadingScreenState, actions: loadingScreenActions } =
  //     useLoadingScreen(
  //       mode === "supply" ? isLending : isBorrowing,
  //       mode === "supply" ? lendError : borrowError,
  //       resetInput,
  //     );

  const calculateMaxAmount = () => {
    if (isLoadingBalance || !walletBalance) return new Quantity(0n, 12n);
    return walletBalance;
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(maxAmount.toString());
  };

  const handleModeChange = (newMode: "delegate" | "withdraw") => {
    setMode(newMode);
    // Reset input when switching modes
    resetInput();
  };

  //   const handleSubmit = () => {
  //     if (!inputValue || !walletBalance) return;

  //     // Create params for the transaction
  //     const baseDenomination = getBaseDenomination(ticker.toUpperCase());
  //     const params = {
  //       token: ticker.toUpperCase(),
  //       quantity: new Quantity(0n, baseDenomination).fromString(inputValue).raw,
  //     };

  //     if (mode === "supply") {
  //       lend(params);
  //     } else {
  //       borrow(params);
  //     }
  //   };

  return (
    <div className={styles.actionTab}>
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${
            mode === "delegate" ? styles.toggleButtonActive : ""
          }`}
          onClick={() => handleModeChange("delegate")}
        >
          Delegate
        </button>
        <button
          className={`${styles.toggleButton} ${
            mode === "withdraw" ? styles.toggleButtonActive : ""
          }`}
          onClick={() => handleModeChange("withdraw")}
        >
          Withdraw
        </button>
      </div>

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
      />

      {/* <AnimatePresence>
        {(lendError || borrowError) && (
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
            {(lendError || borrowError)?.message || "Unknown error"}
          </motion.p>
        )}
      </AnimatePresence> */}

      {/* <SubmitButton
        onSubmit={handleSubmit}
        disabled={
          !inputValue ||
          parseFloat(inputValue) <= 0 ||
          loadingScreenState.submitStatus === "loading" ||
          valueLimitReached ||
          cooldownData?.onCooldown
        }
        loading={isLending || isBorrowing}
        submitText={mode === "supply" ? "Supply" : "Borrow"}
      /> */}

      {/* Loading Screen Modal */}
      {/* <LoadingScreen
        loadingState={loadingScreenState.state}
        action={mode === "supply" ? "lending" : "borrowing"}
        tokenTicker={ticker}
        amount={loadingScreenState.transactionAmount}
        txId={loadingScreenState.transactionId}
        isOpen={loadingScreenState.isOpen}
        onClose={loadingScreenActions.closeLoadingScreen}
        error={loadingScreenState.error}
      /> */}
    </div>
  );
};

export default ActionPanel;
