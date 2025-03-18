import React from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";
import Spinner from "../Spinner/Spinner";

type LoadingState = "pending" | "success" | "failed" | "loading";
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
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingState,
  action,
  tokenTicker,
  amount,
  txId,
}) => {
  return (
    <div className={styles.screen}>
      <div className={styles.closeContainer}>
        <button className={styles.closeButton}>
          <Image src="/icons/close.svg" height={9} width={9} alt="Close" />
        </button>
      </div>
      <div className={styles.statusContainer}>
        {loadingState === "loading" ? (
          <Spinner size="80px" />
        ) : (
          <Image
            src={`/icons/activity/${formatStateImage(loadingState)}.svg`}
            width={100}
            height={100}
            alt="Loading State"
          />
        )}
        <p className={styles.loadingState}>{formatState(loadingState)}</p>
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
        {loadingState !== "loading" && (
          <a
            className={styles.viewLink}
            href={`https://www.ao.link/#/message/${txId}`}
            target="_blank"
          >
            View on ao.link
          </a>
        )}
      </div>
    </div>
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
    pending: "We couldn't confirm your transaction, please check later.",
    failed: "Transaction failed, please check status.",
    loading: "Please wait while we confirm your transaction.",
  };
  return stateMap[state];
};

type LoadingStateWithoutLoading = Exclude<LoadingState, "loading">;
const formatStateImage = (state: LoadingStateWithoutLoading): string => {
  const stateMap: Record<LoadingStateWithoutLoading, string> = {
    pending: "pending",
    success: "true",
    failed: "false",
  };
  return stateMap[state];
};
