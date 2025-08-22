"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";
import Spinner from "../Spinner/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants, dropdownVariants } from "../DropDown/FramerMotion";

type LoadingState = "signing" | "pending" | "success" | "failed" | "loading";
type Action =
  | "lending"
  | "unLending"
  | "borrowing"
  | "liquidating"
  | "repaying"
  | "delegating";

interface LoadingScreenProps {
  loadingState: LoadingState;
  action: Action;
  tokenTicker: string;
  amount: string;
  txId: string;
  isOpen: boolean;
  onClose: () => void;
  error?: Error | null;
  enableSounds?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingState,
  action,
  tokenTicker,
  amount,
  txId,
  isOpen,
  onClose,
  error,
  enableSounds = true,
}) => {
  const previousLoadingStateRef = useRef<LoadingState | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const failAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    if (enableSounds && typeof window !== "undefined") {
      successAudioRef.current = new Audio("/sound-effects/success.mp3");
      failAudioRef.current = new Audio("/sound-effects/fail.mp3");

      // Preload audio files
      successAudioRef.current.preload = "auto";
      failAudioRef.current.preload = "auto";

      // Set volume (optional - adjust as needed)
      successAudioRef.current.volume = 0.5;
      failAudioRef.current.volume = 0.5;
    }

    // Cleanup
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current = null;
      }
      if (failAudioRef.current) {
        failAudioRef.current.pause();
        failAudioRef.current = null;
      }
    };
  }, [enableSounds]);

  // Play sound when state changes to success or failed
  useEffect(() => {
    const previousState = previousLoadingStateRef.current;

    if (enableSounds && previousState && previousState !== loadingState) {
      if (loadingState === "success" && successAudioRef.current) {
        successAudioRef.current.currentTime = 0; // Reset to beginning
        successAudioRef.current.play().catch((error) => {
          console.warn("Could not play success sound:", error);
        });
      } else if (loadingState === "failed" && failAudioRef.current) {
        failAudioRef.current.currentTime = 0; // Reset to beginning
        failAudioRef.current.play().catch((error) => {
          console.warn("Could not play fail sound:", error);
        });
      }
    }

    // Update the previous state
    previousLoadingStateRef.current = loadingState;
  }, [loadingState, enableSounds]);

  const isDelegating = action === "delegating";
  const shouldShowTxLink =
    !isDelegating &&
    txId &&
    loadingState !== "loading" &&
    loadingState !== "signing" &&
    loadingState !== "failed";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className={styles.screen}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closeContainer}>
              <button className={styles.closeButton} onClick={onClose}>
                <Image
                  src="/icons/close-icon.svg"
                  height={9}
                  width={9}
                  alt="Close"
                />
              </button>
            </div>
            <div className={styles.statusContainer}>
              {loadingState === "loading" ? (
                <Spinner size="80px" />
              ) : (
                <Image
                  src={formatStateImage(loadingState)}
                  width={100}
                  height={100}
                  alt="Loading State"
                />
              )}

              {loadingState === "signing" ? (
                <div className={styles.signingContainer}>
                  <p className={styles.loadingState}>Signing</p>
                  <Spinner size="20px" />
                </div>
              ) : (
                <p className={styles.loadingState}>
                  {formatState(loadingState)}
                </p>
              )}

              {loadingState === "failed" && error?.message ? (
                <p className={styles.stateMessage}>{error.message}</p>
              ) : (
                loadingState !== "success" && (
                  <p className={styles.stateMessage}>
                    {isDelegating && loadingState === "loading"
                      ? ""
                      : formatStateMessage(loadingState)}
                  </p>
                )
              )}

              <div className={styles.actionContainer}>
                <p>{formatAction(action)}</p>
                <p>{amount}</p>
                <Image
                  src={`/tokens/${tokenTicker}.svg`}
                  height={15}
                  width={15}
                  alt={tokenTicker}
                />
              </div>

              {shouldShowTxLink && (
                <a
                  className={styles.viewLink}
                  href={`https://www.ao.link/#/message/${txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on ao.link
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

const formatAction = (action: Action): string => {
  const actionMap: Record<Action, string> = {
    lending: "Lending",
    unLending: "Unlending",
    borrowing: "Borrowing",
    liquidating: "Liquidating",
    repaying: "Repaying",
    delegating: "Setting delegation to:",
  };
  return actionMap[action];
};

const formatState = (state: LoadingState): string => {
  const stateMap: Record<LoadingState, string> = {
    signing: "Signing",
    pending: "Unconfirmed",
    success: "Success",
    failed: "Failed",
    loading: "Loading",
  };
  return stateMap[state];
};

type LoadingStateWithoutSuccess = Exclude<LoadingState, "success">;
const formatStateMessage = (state: LoadingStateWithoutSuccess): string => {
  const stateMap: Record<LoadingStateWithoutSuccess, string> = {
    signing: "Please sign the transaction in your wallet.",
    pending: "We couldn't confirm your transaction, please check later.",
    failed: "Transaction failed, please check status in profile tab.",
    loading: "Please wait while we confirm your transaction.",
  };
  return stateMap[state];
};

type LoadingStateWithoutLoading = Exclude<LoadingState, "loading">;
const formatStateImage = (state: LoadingStateWithoutLoading): string => {
  const stateMap: Record<LoadingStateWithoutLoading, string> = {
    signing: "/partners/wander.svg",
    pending: "/icons/activity/pending.svg",
    success: "/icons/activity/true.svg",
    failed: "/icons/activity/false.svg",
  };
  return stateMap[state];
};
