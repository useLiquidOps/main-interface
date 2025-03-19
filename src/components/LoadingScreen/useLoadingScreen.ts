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
  const [state, setState] = useState<LoadingState>("loading");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  // Watch for mutation state changes
  useEffect(() => {
    if (isMutating) {
      setSubmitStatus("loading");
      setState("loading");
    } else if (mutationError) {
      setSubmitStatus("error");
      setState("failed");
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
    setState("loading");
    setSubmitStatus("loading");

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
        }
      },
    });
  };

  const closeLoadingScreen = () => {
    setIsOpen(false);
  };

  return {
    state: {
      isOpen,
      state,
      transactionAmount,
      transactionId,
      submitStatus,
    },
    actions: {
      executeTransaction,
      closeLoadingScreen,
    },
  };
};
