"use client";
import React from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";
import Spinner from "../Spinner/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants, dropdownVariants, loadingBoxVariants } from "../DropDown/FramerMotion";

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
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  error?: Error | null;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingState,
  action,
  tokenTicker,
  amount,
  txId,
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  error,
}) => {
  const closeOrMinimize = () => {
    if (loadingState === "failed" || loadingState === "success") {
      onClose();
    }

    onMinimize();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeOrMinimize}
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
                <button className={styles.closeButton} onClick={closeOrMinimize}>
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
                      {formatStateMessage(loadingState)}
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
                {loadingState !== "loading" &&
                  loadingState !== "signing" &&
                  loadingState !== "failed" && (
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
              <button className={styles.okButton} onClick={closeOrMinimize}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            className={styles.loadingBox}
            variants={loadingBoxVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onMinimize}
          >
            {(loadingState === "loading" && <Spinner size="22px" />) || (
              <Image
                src={formatStateImage(loadingState as LoadingStateWithoutLoading)}
                width={22}
                height={22}
                alt="Loading State"
              />
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
    failed: "Transaction failed, please check status in profile tab.",
    loading: "Your transaction is being processed. You can close this window.",
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
