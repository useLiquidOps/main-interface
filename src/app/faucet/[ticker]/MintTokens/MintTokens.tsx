import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import styles from "./MintTokens.module.css";
import { formatInputNumber } from "../../../../components/utils/utils";
import { headerTokensData } from "@/app/data";
import { useFaucet } from "@/hooks/actions/useFaucet";
import { useWalletAddress } from "@/hooks/data/useWalletAddress";

interface MintTokensProps {
  ticker: string;
}

const MintTokens: React.FC<MintTokensProps> = ({ ticker }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: walletAddress } = useWalletAddress();

  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const { claim, status, error, reset } = useFaucet({
    onSuccess: () => {
      setInputValue(""); // Clear input after successful mint
      // Reset back to idle after a delay
      setTimeout(reset, 2000);
    },
    onError: () => {
      // Reset back to idle after a delay
      setTimeout(reset, 2000);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputNumber(e.target.value);
    setInputValue(formattedValue);
  };

  const handleSubmit = () => {
    if (!walletAddress || !tokenData || !inputValue) return;

    claim({
      ticker: tokenData.ticker,
      walletAddress,
      amount: inputValue,
    });
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

      <SubmitButton
        onSubmit={handleSubmit}
        isLoading={status === "pending"}
        disabled={!inputValue || !walletAddress}
        error={error}
        status={status}
      />
    </div>
  );
};

export default MintTokens;
