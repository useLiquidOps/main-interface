import { ProtocolStatsCache } from "@/hooks/LiquidOpsData/useProtocolStats";
import { Prices } from "@/hooks/data/useTokenPrice";
import { UserBalanceCache } from "@/hooks/data/useUserBalance";
import { PositionCache } from "@/hooks/LiquidOpsData/useGetPosition";
import { Quantity } from "ao-tokens-lite";
import { GlobalPositionCache } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { TransactionCache } from "@/hooks/LiquidOpsData/useTransactions";
import { ResultCache } from "@/hooks/LiquidOpsData/useGetResult";
import { tokenData } from "liquidops";
import { EarningsCache } from "@/hooks/data/useEarnings";

interface DataTypeMap {
  prices: Prices;
  [key: `protocol-stats-${string}`]: ProtocolStatsCache;
  [key: `user-balance-${string}`]: UserBalanceCache;
  [key: `user-position-${string}`]: PositionCache;
  [key: `global-position-${string}`]: GlobalPositionCache;
  [key: `allTransactions-${string}`]: TransactionCache;
  [key: `result-${string}-${string}-${string}`]: ResultCache;
  [key: `supply-apr-${string}`]: number;
  [key: `defi-llama-pool-${string}`]: any;
  [key: `historical-apr-${string}`]: any;
  "fair-launch-strategies": any;
  "leverage-strategies": any;
  [key: `fairlaunch-apy-${string}`]: any;
  "ao-bridge-stats": any;
  [key: `user-earnings-${string}-${string}`]: EarningsCache;
}

type DataKeys = keyof DataTypeMap;

interface DataItem<T> {
  data: T;
  timestamp: number;
}

export function isDataCachedValid<K extends DataKeys>(
  dataKey: K,
): false | DataTypeMap[K] {
  try {
    const storedItem = localStorage.getItem(dataKey as string);
    if (!storedItem) return false;

    const dataItem: DataItem<DataTypeMap[K]> = JSON.parse(storedItem);
    const now = Date.now();
    const isDataValid = now - dataItem.timestamp <= 2 * 60 * 1000;

    if (isDataValid) {
      return dataItem.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Error getting stored data item in isDataCachedValid():",
      error,
    );
    return false;
  }
}

export function cacheData<K extends string>({
  dataKey,
  data,
}: {
  dataKey: K;
  data: K extends keyof DataTypeMap ? DataTypeMap[K] : unknown;
}) {
  try {
    const parsedDataItem: DataItem<typeof data> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(dataKey, JSON.stringify(parsedDataItem));
  } catch (error) {
    console.error("Error caching data in cacheData():", error);
    throw error;
  }
}

export function invalidateData<K extends DataKeys>(dataKey: K | K[]) {
  if (Array.isArray(dataKey)) {
    for (const key of dataKey) {
      localStorage.removeItem(key);
    }
  } else {
    localStorage.removeItem(dataKey);
  }
}

export function wrapQuantity(quantity: Quantity): WrappedQuantity {
  return {
    value: quantity.raw.toString(),
    denomination: quantity.denomination.toString(),
  };
}

export interface WrappedQuantity {
  value: string;
  denomination: string;
}
export function unWrapQuantity(wrappedQuantity: WrappedQuantity): Quantity {
  return new Quantity(
    wrappedQuantity.value,
    BigInt(wrappedQuantity.denomination),
  );
}

export function getDenomination(address: string): bigint | undefined {
  // Check if it's a regular token
  for (const ticker in tokenData) {
    const data = tokenData[ticker];
    if (data.address === address) {
      return data.baseDenomination;
    }
  }

  // Check if it's an oToken
  for (const ticker in tokenData) {
    const data = tokenData[ticker];
    if (data.oAddress === address) {
      return data.denomination;
    }
  }

  return undefined;
}
