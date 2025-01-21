import { useEffect, useRef } from "react";

// click outside of a popup
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return { ref };
};

// format thousands, millions, billions
export const formatTMB = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return value.toFixed(2);
  }
};

export const formatNumberWithCommas = (
  value: number,
  decimals: number = 8,
): string => {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    useGrouping: true,
  });
};

export const formatInputNumber = (value: string): string => {
  const rawValue = value.replace(/[^\d.]/g, "");

  const decimalCount = rawValue.split(".").length - 1;
  if (decimalCount > 1) return value;

  if (rawValue === "") return "";

  return Number(rawValue).toLocaleString("en-US", {
    maximumFractionDigits: 8,
    useGrouping: true,
  });
};

export const calculateUsdValue = (value: string, rate: number): string => {
  const numValue = Number(value.replace(/,/g, "")) || 0;
  return (numValue * rate).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatMaxAmount = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    maximumFractionDigits: 8,
    useGrouping: true,
  });
};
