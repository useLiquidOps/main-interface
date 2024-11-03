import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import styles from "./MintTokens.module.css";
import { formatInputNumber } from "../../../../components/utils/utils";
import { headerTokensData } from "@/app/data";

interface MintTokensProps {
  ticker: string;
}

const MintTokens: React.FC<MintTokensProps> = ({ ticker }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputNumber(e.target.value);
    setInputValue(formattedValue);
  };

  if (!tokenData) {
    return null;
  }

  return (
    <div className={styles.mintTokens}>
      <p className={styles.title}>Mint tokens</p>

      <div
        className={`${styles.inputContainer} ${isFocused ? styles.focused : ""}`}
      >
        <div className={styles.inputSection}>
          <div className={styles.leftSection}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={styles.amountInput}
              placeholder="0"
            />
          </div>
          <div className={styles.rightSection}>
            <div className={styles.tokenSelector}>
              <Image
                src={`/tokens/${tokenData.ticker.toLowerCase()}.svg`}
                height={20}
                width={20}
                alt={tokenData.name}
              />
              <span>{tokenData.ticker}</span>
            </div>
          </div>
        </div>
      </div>

      <SubmitButton />
    </div>
  );
};

export default MintTokens;