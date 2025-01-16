import React from "react";
import Image from "next/image";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  error?: Error | null;
  status: "idle" | "loading" | "success" | "error" | "pending";
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isLoading,
  disabled = false,
  error = null,
  status,
}) => {
  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Image
              src="/icons/loadingSubmit.svg"
              alt="Loading"
              width={12}
              height={12}
              className={styles.loadingIcon}
            />
            <span>Loading</span>
          </>
        );
      case "pending":
        return (
          <>
            <Image
              src="/icons/loadingSubmit.svg"
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
              src="/icons/submitted.svg"
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
              src="/icons/failedSubmit.svg"
              alt="Error"
              width={13}
              height={13}
            />
            <span>{error?.message || "Failed to submit"}</span>
          </>
        );
      default:
        return "Submit";
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
