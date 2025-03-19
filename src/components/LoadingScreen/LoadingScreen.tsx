"use client";
import React from "react";
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
  | "repaying";

interface LoadingScreenProps {
  loadingState: LoadingState;
  action: Action;
  tokenTicker: string;
  amount: string;
  txId: string;
  isOpen: boolean;
  onClose: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingState,
  action,
  tokenTicker,
  amount,
  txId,
  isOpen,
  onClose,
}) => {
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
                  src="/icons/close.svg"
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

              {loadingState !== "success" && (
                <p className={styles.stateMessage}>
                  {formatStateMessage(loadingState)}
                </p>
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
              {loadingState !== "loading" && loadingState !== "signing" && (
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
    failed: "Transaction failed, please check status.",
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
