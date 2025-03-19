import React from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
  submitText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  disabled = false,
  submitText = "Submit",
}) => {
  return (
    <button
      className={styles.submitButton}
      onClick={onSubmit}
      disabled={disabled}
    >
      {submitText}
    </button>
  );
};

export default SubmitButton;
