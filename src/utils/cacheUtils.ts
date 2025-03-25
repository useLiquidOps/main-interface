import { ProtocolStatsCache } from "@/hooks/LiquidOpsData/useProtocolStats";

type DataKeys = "protocol-stats"

type Data = ProtocolStatsCache;

interface DataItem {
    data: Data;
    timestamp: number;
}

type IsDataCachedValid = DataKeys
type IsDataCachedValidRes = false | Data;

export function isDataCachedValid(dataKey: IsDataCachedValid): IsDataCachedValidRes {
  try {
    const storedItem = localStorage.getItem(dataKey);
    if (!storedItem) return false;

    const dataItenm: DataItem = JSON.parse(storedItem);
    const now = Date.now();
    const isDataValid = now - dataItenm.timestamp <= 5 * 60 * 1000;
    
    if (isDataValid) {
      return dataItenm.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error getting stored data item in isDataCachedValid():', error);
    return false;
  }
}

interface CacheData {
  dataKey: DataKeys;
  data: Data;
}

export function cacheData({ dataKey, data }: CacheData) {
  try {
    const parsedDataItem: DataItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(dataKey, JSON.stringify(parsedDataItem));
  } catch (error) {
    console.error('Error caching data in cacheData():', error);
    throw error;
  }
}