import { ProtocolStatsCache } from "@/hooks/LiquidOpsData/useProtocolStats";
import { Prices } from "@/hooks/data/useTokenPrice";

interface DataTypeMap {
  "protocol-stats": ProtocolStatsCache;
  prices: Prices;
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
    const storedItem = localStorage.getItem(dataKey);
    if (!storedItem) return false;

    const dataItem: DataItem<DataTypeMap[K]> = JSON.parse(storedItem);
    const now = Date.now();
    const isDataValid = now - dataItem.timestamp <= 5 * 60 * 1000;

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

export function cacheData<K extends DataKeys>({
  dataKey,
  data,
}: {
  dataKey: K;
  data: DataTypeMap[K];
}) {
  try {
    const parsedDataItem: DataItem<DataTypeMap[K]> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(dataKey, JSON.stringify(parsedDataItem));
  } catch (error) {
    console.error("Error caching data in cacheData():", error);
    throw error;
  }
}
