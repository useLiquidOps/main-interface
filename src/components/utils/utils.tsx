import { Quantity } from "ao-tokens";
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
export const formatTMB = (value: Quantity): string => {
  console.log(value);
  const billions = new Quantity(0, value.denomination).fromNumber(1000000000);
  const millions = new Quantity(0, value.denomination).fromNumber(1000000);
  if (Quantity.le(billions, value)) {
    return (
      Quantity.__div(value, billions).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }) + "B"
    );
  } else if (Quantity.le(millions, value)) {
    return (
      Quantity.__div(value, millions).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }) + "M"
    );
  } else if (
    Quantity.le(new Quantity(0, value.denomination).fromNumber(1000), value)
  ) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
};

export const formatNumberWithCommas = (
  value: number | Quantity,
  decimals: number = 8,
): string => {
  return value.toLocaleString("en-US", {
    // @ts-expect-error
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

export const calculateUsdValue = (value: string, rate: Quantity): string => {
  const numValue = Number(value.replace(/,/g, "")) || 0;
  if (numValue === 0) return "0";
  const preciseValue = Quantity.__mul(
    new Quantity(0n, 12n).fromString(value),
    rate,
  );
  return preciseValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatMaxAmount = (amount: number | Quantity): string => {
  return amount.toLocaleString("en-US", {
    maximumFractionDigits: 8,
    useGrouping: true,
  });
};
