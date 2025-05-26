"use client";
import { useState, useEffect } from "react";
import { UseMutateFunction } from "@tanstack/react-query";

export type LoadingState = "loading" | "pending" | "success" | "failed";
export type SubmitStatus = "idle" | "loading" | "success" | "error" | "pending";

interface TransactionResult {
  status: boolean | "pending";
  transferID?: string;
}

export const useLoadingScreen = (
  isMutating: boolean,
  mutationError: Error | null,
  resetInput: () => void,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [state, setState] = useState<LoadingState>("loading");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<Error | null>(null);

  // Watch for mutation state changes
  useEffect(() => {
    if (isMutating) {
      setSubmitStatus("loading");
      setState("loading");
      setError(null);
    } else if (mutationError) {
      setSubmitStatus("error");
      setState("failed");
      setError(mutationError);
    }
  }, [isMutating, mutationError]);

  const executeTransaction = <T>(
    amount: string,
    params: T,
    mutate: UseMutateFunction<
      any,
      Error,
      T & { onSuccess?: (data: any) => void },
      unknown
    >,
  ) => {
    setTransactionAmount(amount);
    setIsOpen(true);
    setIsMinimized(false);
    setState("loading");
    setSubmitStatus("loading");
    setError(null);

    mutate({
      ...params,
      onSuccess: (data: TransactionResult) => {
        if (data.status === "pending") {
          setSubmitStatus("pending");
          setState("pending");
          if (data.transferID) {
            setTransactionId(data.transferID);
          }
        } else if (data.status === true) {
          setSubmitStatus("success");
          setState("success");
          if (data.transferID) {
            setTransactionId(data.transferID);
          }
          resetInput();
        } else {
          setSubmitStatus("error");
          setState("failed");
          if (data.transferID) {
            setTransactionId(data.transferID);
          }
          // @ts-ignore, TODO: add SDK error message when ready
          if (data.error) {
            setError(
              new Error(
                // @ts-ignore
                typeof data.error === "string"
                  ? // @ts-ignore
                    data.error
                  : "Transaction failed, please check status in profile tab.",
              ),
            );
          }
        }
      },
      onError: (err: Error) => {
        setSubmitStatus("error");
        setState("failed");
        setError(err);
      },
    });
  };

  const closeLoadingScreen = () => {
    setIsOpen(false);
  };

  const toggleMinimized = () => {
    setIsMinimized(val => !val);
  };

  return {
    state: {
      isOpen,
      isMinimized,
      state,
      transactionAmount,
      transactionId,
      submitStatus,
      error,
    },
    actions: {
      executeTransaction,
      closeLoadingScreen,
      toggleMinimized
    },
  };
};
