"use client";
import React, { useState, useCallback } from "react";
import styles from "./WithdrawRepay.module.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import PercentagePicker from "../PercentagePicker/PercentagePicker";
import InputBox from "../InputBox/InputBox";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Image from "next/image";
import { formatMaxAmount } from "../utils/utils";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useLend } from "@/hooks/actions/useLend";
import { useBorrow } from "@/hooks/actions/useBorrow";
import { Quantity } from "ao-tokens";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/data/useGetPosition";
import { useLoadingScreen } from "../LoadingScreen/useLoadingScreen";

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
    useUserBalance(oTokenAddress);

  const currentBalance = mode === "withdraw" ? lentBalance : positionBalance;
  const isLoadingCurrentBalance =
    mode === "withdraw" ? isLoadingBalance : isLoadingPosition;

  const { unlend, isUnlending, unlendError } = useLend();
  const { repay, isRepaying, repayError } = useBorrow();

  const networkFee = 0;
  const interestOwed = 0.01;
  const utilizationRate = 0.75;

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

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

  const calculateMaxAmount = () => {
    if (isLoadingCurrentBalance || !currentBalance)
      return new Quantity(0n, 12n);
    if (mode === "withdraw") {
      return currentBalance;
    } else {
      return Quantity.__mul(
        currentBalance,
        new Quantity(0n, currentBalance.denomination || 12n).fromNumber(
          utilizationRate,
        ),
      );
    }
  };

  const handleMaxClick = () => {
    const maxAmount = calculateMaxAmount();
    setInputValue(formatMaxAmount(maxAmount));
  };

  const handlePercentageClick = (percentage: number) => {
    const maxAmount = calculateMaxAmount();
    const amount = Quantity.__div(
      Quantity.__mul(maxAmount, new Quantity(0n, 12n).fromNumber(percentage)),
      new Quantity(0n, 12n).fromNumber(100),
    );
    setInputValue(formatMaxAmount(amount));
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
    setInputValue(formatMaxAmount(interestOwed));
    setSelectedPercentage(null);
  };

  const handleSubmit = () => {
    if (!inputValue) return;

    const params = {
      token: ticker.toUpperCase(),
      quantity: new Quantity(0n, currentBalance?.denomination).fromString(
        inputValue,
      ).raw,
    };

    if (mode === "withdraw") {
      loadingScreenActions.executeTransaction(inputValue, params, unlend);
    } else {
      loadingScreenActions.executeTransaction(inputValue, params, repay);
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
        walletBalance={
          isLoadingCurrentBalance || !currentBalance
            ? new Quantity(0n, 12n)
            : currentBalance
        }
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
        walletBalance={
          isLoadingCurrentBalance || !currentBalance
            ? new Quantity(0n, 12n)
            : currentBalance
        }
      />

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Network fee: {networkFee} AO</span>
      </div>

      <SubmitButton
        onSubmit={handleSubmit}
        disabled={
          !inputValue ||
          parseFloat(inputValue) <= 0 ||
          loadingScreenState.submitStatus === "loading"
        }
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
