"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens-lite";
import styles from "./FairLaunchInput.module.css";

interface FairLaunchInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  currentDelegation: number;
  onMaxClick: () => void;
  disabled?: boolean;
  isDelegationLoading?: boolean;
}

const FairLaunchInput: React.FC<FairLaunchInputProps> = ({
  inputValue,
  setInputValue,
  isFocused,
  setIsFocused,
  currentDelegation,
  onMaxClick,
  disabled = false,
  isDelegationLoading = false,
}) => {
  const [arBalance, setArBalance] = useState<Quantity | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchArBalance = async () => {
      try {
        // Get wallet address from arweaveWallet
        const address = await window.arweaveWallet.getActiveAddress();
        if (!address) {
          setArBalance(new Quantity(0n, 12n)); // AR has 12 decimals
          setIsLoadingBalance(false);
          return;
        }

        // Fetch balance from Arweave API
        const response = await fetch(
          `https://arweave.net/wallet/${address}/balance`,
        );
        const balanceWinston = await response.text();

        // Create Quantity object with winston amount (AR has 12 decimal places)
        const balanceQuantity = new Quantity(BigInt(balanceWinston), 12n);
        setArBalance(balanceQuantity);
      } catch (error) {
        console.error("Error fetching AR balance:", error);
        setArBalance(new Quantity(0n, 12n));
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchArBalance();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = e.target.value;

    // Only allow numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);

      // Prevent entering over 100%
      if (!isNaN(numValue) && numValue > 100) {
        return; // Don't update if over 100%
      }

      setInputValue(value);
    }
  };

  return (
    <div
      className={`${styles.inputContainer} ${isFocused ? styles.focused : ""} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <div className={styles.inputSection}>
        <div className={styles.leftSection}>
          <div className={styles.inputWithPercentage}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => !disabled && setIsFocused(true)}
              onBlur={() => !disabled && setIsFocused(false)}
              className={styles.amountInput}
              placeholder="0.00%"
              readOnly={disabled}
              min="0"
              max="100"
            />
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.walletInfo}>
            <Image
              src="/icons/wallet.svg"
              height={14}
              width={14}
              alt="Wallet"
            />
            {isLoadingBalance || isDelegationLoading ? (
              <SkeletonLoading style={{ width: "50px", height: "10px" }} />
            ) : (
              <span className={styles.balanceAmount}>
                {formatTMB(arBalance || new Quantity(0n, 0n))} AR
              </span>
            )}
            <span className={styles.separator}>|</span>
            <button
              className={styles.maxButton}
              onClick={onMaxClick}
              disabled={disabled || isLoadingBalance || isDelegationLoading}
            >
              Max
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairLaunchInput;
