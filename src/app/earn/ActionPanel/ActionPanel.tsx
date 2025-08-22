"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import FairLaunchInput from "../utils/FairLaunchInput/FairLaunchInput";
import styles from "./ActionPanel.module.css";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { motion, AnimatePresence } from "framer-motion";
import { warningVariants } from "@/components/DropDown/FramerMotion";
import {
  setLQDTokenDelegation,
  getLQDTokenDelegationPercentage,
} from "../utils/fairLaunchLQD";

interface ActionPanelProps {
  ticker: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ ticker }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentDelegation, setCurrentDelegation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelegationLoading, setIsDelegationLoading] = useState(true);
  const [arBalance, setArBalance] = useState<number>(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingScreenState, setLoadingScreenState] = useState({
    isOpen: false,
    state: "loading" as "loading" | "success" | "failed",
    transactionAmount: "",
    transactionId: "",
    error: null as Error | null,
  });

  // Load current delegation status and AR balance on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsDelegationLoading(true);
      setIsBalanceLoading(true);

      try {
        // Load delegation info
        const percentage = await getLQDTokenDelegationPercentage();
        setCurrentDelegation(percentage);
        setIsDelegationLoading(false);

        // Load AR balance
        const address = await window.arweaveWallet.getActiveAddress();
        if (address) {
          const response = await fetch(
            `https://arweave.net/wallet/${address}/balance`,
          );
          const balanceWinston = await response.text();
          const balanceAR = parseInt(balanceWinston) / 1000000000000; // Convert winston to AR
          setArBalance(balanceAR);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsDelegationLoading(false);
        setIsBalanceLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset input callback
  const resetInput = useCallback(() => {
    setInputValue("");
    setError(null);
  }, []);

  const handleMaxClick = () => {
    setInputValue("100");
  };

  const validateInput = (value: string): string | null => {
    if (!value) return null; // Allow empty values for the disabled check

    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue < 0) {
      return "Please enter a valid percentage";
    }

    if (numValue > 100) {
      return "Percentage cannot exceed 100%";
    }

    return null;
  };

  const handleSubmit = async () => {
    if (isLoading) {
      alert("Please wait for the current transaction to complete");
      return;
    }

    if (!inputValue) {
      alert("Please enter a delegation percentage");
      return;
    }

    // Check if user has 0 AR balance and is trying to delegate more than 0%
    if (arBalance === 0 && parseFloat(inputValue) > 0) {
      alert(
        "You cannot delegate to the LQD fair launch if your AR balance is 0",
      );
      return;
    }

    const validation = validateInput(inputValue);
    if (validation) {
      alert(validation);
      return;
    }

    const percentage = parseFloat(inputValue);
    setIsLoading(true);
    setError(null);

    // Show loading screen
    setLoadingScreenState({
      isOpen: true,
      state: "loading",
      transactionAmount: `${percentage}%`,
      transactionId: "",
      error: null,
    });

    try {
      const result = await setLQDTokenDelegation(percentage);

      if (result.success) {
        setCurrentDelegation(percentage);

        setLoadingScreenState((prev) => ({
          ...prev,
          state: "success",
          transactionId: "delegation-updated",
        }));

        resetInput();
      } else {
        const errorMessage = result.error || "Unknown error occurred";
        setError(errorMessage);
        setLoadingScreenState((prev) => ({
          ...prev,
          state: "failed",
          error: new Error(errorMessage),
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setLoadingScreenState((prev) => ({
        ...prev,
        state: "failed",
        error: new Error(errorMessage),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const closeLoadingScreen = () => {
    setLoadingScreenState({
      isOpen: false,
      state: "loading",
      transactionAmount: "",
      transactionId: "",
      error: null,
    });
  };

  return (
    <div className={styles.actionTab}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Update delegation preferences</h2>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.infoDetails}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Current LQD AO delegation:</span>
            {isDelegationLoading ? (
              <SkeletonLoading style={{ width: "50px", height: "10px" }} />
            ) : (
              <span style={{ fontWeight: "700" }}>
                {currentDelegation.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <FairLaunchInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        currentDelegation={currentDelegation}
        onMaxClick={handleMaxClick}
        disabled={isLoading}
        isDelegationLoading={isDelegationLoading || isBalanceLoading}
      />

      <AnimatePresence>
        {error && (
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
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <SubmitButton
        onSubmit={handleSubmit}
        loading={isLoading}
        submitText="Update"
      />

      <LoadingScreen
        loadingState={loadingScreenState.state}
        action="delegating"
        tokenTicker="LQD"
        amount={loadingScreenState.transactionAmount}
        txId={loadingScreenState.transactionId}
        isOpen={loadingScreenState.isOpen}
        onClose={closeLoadingScreen}
        error={loadingScreenState.error}
      />
    </div>
  );
};

export default ActionPanel;
