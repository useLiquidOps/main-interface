"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import InputBox from "@/components/InputBox/InputBox";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import styles from "./ActionTab.module.css";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { useLend } from "@/hooks/actions/useLend";
import { useBorrow } from "@/hooks/actions/useBorrow";
import { Quantity } from "ao-tokens";
import { tokenInput } from "liquidops";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { getBaseDenomination } from "@/utils/LiquidOps/getBaseDenomination";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { motion, AnimatePresence } from "framer-motion";
import { warningVariants } from "@/components/DropDown/FramerMotion";
import { useValueLimit } from "@/hooks/data/useValueLimit";
import { useCooldown } from "@/hooks/data/useCooldown";

interface ActionTabProps {
  ticker: string;
  mode: "supply" | "borrow";
  onClose: () => void;
}

const ActionTab: React.FC<ActionTabProps> = ({ ticker, mode, onClose }) => {
  const { price: tokenPrice } = useTokenPrice(ticker.toUpperCase());
  const { data: protocolStats, isLoading: isLoadingProtocolStats } =
    useProtocolStats(ticker.toUpperCase());
  const { tokenAddress } = tokenInput(ticker.toUpperCase());
  const { data: walletBalance, isLoading: isLoadingBalance } =
    useUserBalance(tokenAddress);

  const { lend, isLending, lendError } = useLend({
    onSuccess: onClose,
  });
  const { borrow, isBorrowing, borrowError } = useBorrow({
    onSuccess: onClose,
  });

  const networkFee = 0;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: cooldownData } = useCooldown(mode, ticker);

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
    return walletBalance;
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(maxAmount.toString());
  };

  const [valueLimit, valueLimitReached] = useValueLimit(
    inputValue,
    protocolStats,
  );

  const jumpRateData = useMemo<
    { active: false } | { active: true; newAPR: number }
  >(() => {
    if (!inputValue || isLoadingProtocolStats || !protocolStats) {
      return { active: false };
    }

    const collateralDenom = BigInt(protocolStats.info.collateralDenomination);
    const _hundred = new Quantity(0n, collateralDenom).fromNumber(100);

    const kinkPercentage = new Quantity(0n, collateralDenom).fromString(
      protocolStats.info.kinkParam || "80",
    );
    const qty = new Quantity(0n, collateralDenom).fromString(inputValue);
    const cash = new Quantity(protocolStats.info.cash, collateralDenom);
    const totalBorrows = new Quantity(
      protocolStats.info.totalBorrows,
      collateralDenom,
    );
    const reserves = new Quantity(
      protocolStats.info.totalReserves,
      collateralDenom,
    );

    const utilizationRateAfter = Quantity.__div(
      Quantity.__mul(Quantity.__add(totalBorrows, qty), _hundred),
      Quantity.__sub(Quantity.__add(totalBorrows, cash), reserves),
    );

    // jump rate is active, calculate the new APR
    if (Quantity.lt(kinkPercentage, utilizationRateAfter)) {
      const initRate = new Quantity(0n, collateralDenom).fromString(
        protocolStats.info.initRate,
      );
      const baseRate = new Quantity(0n, collateralDenom).fromString(
        protocolStats.info.baseRate,
      );
      const jumpRate = new Quantity(0n, collateralDenom).fromString(
        protocolStats.info.jumpRate,
      );

      const aprAfter = Quantity.__add(
        initRate,
        Quantity.__add(
          Quantity.__div(Quantity.__mul(baseRate, kinkPercentage), _hundred),
          Quantity.__div(
            Quantity.__mul(
              jumpRate,
              Quantity.__sub(utilizationRateAfter, kinkPercentage),
            ),
            _hundred,
          ),
        ),
      ).toNumber();

      return {
        active: true,
        newAPR: aprAfter,
      };
    }

    return { active: false };
  }, [inputValue, protocolStats, isLoadingProtocolStats]);

  const handleSubmit = () => {
    if (!inputValue || !walletBalance) return;

    // Create params for the transaction
    const baseDenomination = getBaseDenomination(ticker.toUpperCase());
    const params = {
      token: ticker.toUpperCase(),
      quantity: new Quantity(0n, baseDenomination).fromString(inputValue).raw,
    };

    if (mode === "supply") {
      // loadingScreenActions.executeTransaction(inputValue, params, lend);
      lend(params);
    } else {
      // loadingScreenActions.executeTransaction(inputValue, params, borrow);
      borrow(params);
    }
  };

  return (
    <div className={styles.actionTab}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          {mode === "supply" ? "Supply" : "Borrow"}
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
              {mode === "supply" ? "Supply" : "Borrow"} APR:
              {isLoadingProtocolStats ||
              (mode === "supply" && protocolStats?.supplyAPR === undefined) ||
              (mode === "borrow" && protocolStats?.borrowAPR === undefined) ? (
                <SkeletonLoading
                  className={styles.infoLabel}
                  style={{ width: "35px", height: "12px" }}
                />
              ) : (
                <span>
                  {mode === "supply"
                    ? protocolStats?.supplyAPR.toFixed(2)
                    : protocolStats?.borrowAPR.toFixed(2)}
                  %
                </span>
              )}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              Network fee: {networkFee} AO
            </span>
          </div>
        </div>
        {/* <Image
          src="/icons/customise.svg"
          height={14}
          width={14}
          alt="Customise"
          className={styles.customiseIcon}
        /> */}
      </div>

      <AnimatePresence>
        {jumpRateData.active && (
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
              alt="Warning icon"
            />
            Warning: this action would trigger a jump rate, increasing the APR
            to{" "}
            {jumpRateData.newAPR.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            %
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {valueLimitReached && (
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
      </AnimatePresence>

      <SubmitButton
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
