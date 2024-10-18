import React, { HTMLProps, useEffect, useState } from "react";
import { Mail01 } from "@untitled-ui/icons-react";
import styles from "./Input.module.css";

interface Props {
  status?: "error";
  onEnter?: () => unknown;
  labelText: string;
}

export default function Input({
  value,
  onChange,
  status,
  onEnter,
  labelText,
  ...props
}: HTMLProps<HTMLInputElement> & Props) {
  const [val, setVal] = useState<string | undefined>();

  useEffect(() => {
    if (val === value) return;
    setVal(value?.toString());
  }, [value]);

  const hasContent = typeof val !== "undefined" && val !== "";

  return (
    <div
      className={`${styles.wrapper} ${status === "error" ? styles.error : ""}`}
    >
      <div className={styles.content}>
        <p className={`${styles.label} ${hasContent ? styles.hasContent : ""}`}>
          {labelText}
        </p>
        <Mail01 className={styles.icon} />
      </div>
      <input
        type="email"
        className={styles.input}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (onChange) onChange(e);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || !onEnter) return;
          onEnter();
        }}
        {...props}
      />
    </div>
  );
}
