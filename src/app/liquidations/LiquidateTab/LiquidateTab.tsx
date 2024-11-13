import React, { useState, useEffect } from "react";
import styles from "./LiquidateTab.module.css";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import Image from "next/image";
import InputBox from "@/components/InputBox/InputBox";
import PercentagePicker from "@/components/PercentagePicker/PercentagePicker";
import DropdownButton from "@/components/DropDown/DropDown";

interface LiquidateTabProps {
  onClose: () => void;
}

const LiquidateTab: React.FC<LiquidateTabProps> = ({ onClose }) => {
  const dummyData = {
    fromToken: {
      symbol: "qAR",
      available: 1000000,
      price: 1,
    },
    toToken: {
      symbol: "stETH",
      available: 100,
      price: 2000,
    },
    conversionRate: 0.0005,
  };

  // Input states for the first (from) token
  const [fromInputValue, setFromInputValue] = useState("");
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );

  // Input states for the second (to) token
  const [toInputValue, setToInputValue] = useState("");
  const [isToFocused, setIsToFocused] = useState(false);

  // Placeholder values
  const tokenToUsdRate = 10;
  const walletBalance = dummyData.fromToken.available;
  const offMarketPrice = 10;
  const maxSlippage = 5;

  useEffect(() => {
    if (fromInputValue === "") {
      setToInputValue("");
      return;
    }

    const fromAmount = parseFloat(fromInputValue.replace(/,/g, ""));
    if (!isNaN(fromAmount)) {
      const convertedAmount = fromAmount * dummyData.conversionRate;
      setToInputValue(
        convertedAmount.toLocaleString("en-US", {
          maximumFractionDigits: 6,
          minimumFractionDigits: 2,
        }),
      );
    }
  }, [fromInputValue]);

  const handleFromMaxClick = () => {
    setFromInputValue(walletBalance.toString());
    setSelectedPercentage(100);
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (walletBalance * percentage) / 100;
    setFromInputValue(
      amount.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
    );
    setSelectedPercentage(percentage);
  };

  const getCurrentPercentage = () => {
    if (!fromInputValue || walletBalance === 0) return 0;

    const numberValue = Number(fromInputValue.replace(/,/g, ""));
    if (isNaN(numberValue)) return 0;

    const percentage = (numberValue / walletBalance) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  return (
    <div className={styles.liquidateTab}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          Liquidate {dummyData.toToken.symbol}/{dummyData.fromToken.symbol}
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
        ticker={dummyData.fromToken.symbol}
        tokenToUsdRate={tokenToUsdRate}
        walletBalance={walletBalance}
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
        ticker={dummyData.toToken.symbol}
        tokenToUsdRate={tokenToUsdRate}
        walletBalance={dummyData.toToken.available}
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

      <div className={styles.slippageButton}>
        <p>Max. slippage: {maxSlippage}%</p>

        {/* @ts-ignore */}
        <DropdownButton />
      </div>

      <SubmitButton />
    </div>
  );
};

export default LiquidateTab;
