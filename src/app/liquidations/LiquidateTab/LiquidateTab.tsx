import React, { useState, useEffect } from "react";
import styles from "./LiquidateTab.module.css";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import Image from "next/image";
import InputBox from "@/components/InputBox/InputBox";
import PercentagePicker from "@/components/PercentagePicker/PercentagePicker";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { useUserBalance } from "@/hooks/data/useUserBalance";

interface TokenData {
  name: string;
  symbol: string;
  icon: string;
  available: number;
  price: number;
}

interface LiquidateTabProps {
  onClose: () => void;
  fromToken: TokenData;
  toToken: TokenData;
  offMarketPrice: number;
  conversionRate: number;
}

const LiquidateTab: React.FC<LiquidateTabProps> = ({
  onClose,
  fromToken,
  toToken,
  offMarketPrice,
  conversionRate,
}) => {
  // Input states for the first (from) token
  const [fromInputValue, setFromInputValue] = useState("");
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

  // Input states for the second (to) token
  const [toInputValue, setToInputValue] = useState("");
  const [isToFocused, setIsToFocused] = useState(false);

  const { data: walletBalance, isLoading: isLoadingBalance } = useUserBalance(
    toToken.symbol.toUpperCase(),
  );

  const { price: fromTokenPrice } = useTokenPrice(
    fromToken.symbol.toUpperCase(),
  );
  const { price: toTokenPrice } = useTokenPrice(toToken.symbol.toUpperCase());

  useEffect(() => {
    if (fromInputValue === "") {
      setToInputValue("");
      return;
    }

    const fromAmount = parseFloat(fromInputValue.replace(/,/g, ""));
    if (!isNaN(fromAmount)) {
      const convertedAmount = fromAmount * conversionRate;
      setToInputValue(
        convertedAmount.toLocaleString("en-US", {
          maximumFractionDigits: 6,
          minimumFractionDigits: 2,
        }),
      );
    }
  }, [fromInputValue, conversionRate]);

  const handleFromMaxClick = () => {
    setFromInputValue(fromToken.available.toString());
    setSelectedPercentage(100);
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (fromToken.available * percentage) / 100;
    setFromInputValue(
      amount.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    );
    setSelectedPercentage(percentage);
  };

  const getCurrentPercentage = () => {
    if (!fromInputValue || fromToken.available === 0) return 0;

    const numberValue = Number(fromInputValue.replace(/,/g, ""));
    if (isNaN(numberValue)) return 0;

    const percentage = (numberValue / fromToken.available) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  return (
    <div className={styles.liquidateTab}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          Liquidate {toToken.symbol}/{fromToken.symbol}
        </p>
        <button className={styles.close} onClick={onClose}>
          <Image src="/icons/close.svg" height={9} width={9} alt="Close" />
        </button>
      </div>

      <InputBox
        inputValue={fromInputValue}
        setInputValue={setFromInputValue}
        isFocused={isFromFocused}
        setIsFocused={setIsFromFocused}
        ticker={fromToken.symbol}
        tokenPrice={fromTokenPrice}
        walletBalance={isLoadingBalance || !walletBalance ? 0 : walletBalance}
        onMaxClick={handleFromMaxClick}
      />

      <div className={styles.arrowContainer}>
        <Image
          src="/icons/arrow-down.svg"
          height={20}
          width={20}
          alt="Arrow"
          className={styles.arrow}
        />
      </div>

      <InputBox
        inputValue={toInputValue}
        setInputValue={setToInputValue}
        isFocused={isToFocused}
        setIsFocused={setIsToFocused}
        ticker={toToken.symbol}
        tokenPrice={toTokenPrice}
        walletBalance={0} // we do not display balance for the second token
        onMaxClick={() => {}}
        disabled={true}
        liquidationMode={true}
        liquidationDiscount={offMarketPrice}
      />

      <PercentagePicker
        mode="withdraw"
        selectedPercentage={selectedPercentage}
        currentPercentage={getCurrentPercentage()}
        onPercentageClick={handlePercentageClick}
        walletBalance={isLoadingBalance || !walletBalance ? 0 : walletBalance}
      />

      <div className={styles.offMarketPriceContiner}>
        <Image
          src="/icons/percentIcon.svg"
          height={16}
          width={16}
          alt="percentIcon"
        />
        <p className={styles.offMarketPriceText}>
          {offMarketPrice}% off market price
        </p>
      </div>
      {/* TODO: correct button inputs with pending logic */}
      <SubmitButton />
    </div>
  );
};

export default LiquidateTab;
