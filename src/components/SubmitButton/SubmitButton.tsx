import React, { useState } from "react";
import Image from "next/image";
import styles from "./SubmitButton.module.css";

const SubmitButton = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleClick = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, 2000);
  };

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className={styles.iconWrapper}>
              <Image
                src="/icons/loadingSubmit.svg"
                alt="Loading"
                width={13}
                height={13}
                className={styles.loadingIcon}
              />
            </div>
            <span>Loading</span>
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
            <span>Failed to submit</span>
          </>
        );
      default:
        return "Submit";
    }
  };

  return (
    <button
      className={`${styles.submitButton} ${styles[status]}`}
      onClick={handleClick}
      disabled={status === "loading"}
    >
      {getButtonContent()}
    </button>
  );
};

export default SubmitButton;
