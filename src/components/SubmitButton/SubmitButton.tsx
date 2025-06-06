import React from "react";
import styles from "./SubmitButton.module.css";
import Spinner from "../Spinner/Spinner";

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
  submitText?: string;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  disabled = false,
  submitText = "Submit",
  loading = false,
}) => {
  return (
    <button
      className={styles.submitButton}
      onClick={onSubmit}
      disabled={disabled || loading}
    >
      {!loading ? submitText : <Spinner size="14px" />}
    </button>
  );
};

export default SubmitButton;
