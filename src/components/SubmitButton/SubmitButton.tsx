import React from "react";
import Image from "next/image";
import styles from "./SubmitButton.module.css";
import Spinner from "../Spinner/Spinner";

interface SubmitButtonProps {
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  error?: Error | null;
  status: "idle" | "loading" | "success" | "error" | "pending";
  submitText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isLoading,
  disabled = false,
  error = null,
  status,
  submitText = "Submit",
}) => {
  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Spinner size="12px" />
            <span>Loading</span>
          </>
        );
      case "pending":
        return (
          <>
            <Image
              src="/icons/activity/pending.svg"
              alt="Pending"
              width={12}
              height={12}
              className={styles.loadingIcon}
            />
            <span>Pending</span>
          </>
        );
      case "success":
        return (
          <>
            <Image
              src="/icons/activity/true.svg"
              alt="Success"
              width={13}
              height={13}
            />
            <span>Submitted</span>
          </>
        );
      case "error":
        return (
          <>
            <Image
              src="/icons/activity/false.svg"
              alt="Error"
              width={13}
              height={13}
            />
            <span>{error?.message || "Failed to submit"}</span>
          </>
        );
      default:
        return submitText;
    }
  };

  return (
    <button
      className={`${styles.submitButton} ${styles[status]}`}
      onClick={onSubmit}
      disabled={
        disabled || isLoading || status === "loading" || status === "pending"
      }
    >
      {getButtonContent()}
    </button>
  );
};

export default SubmitButton;
