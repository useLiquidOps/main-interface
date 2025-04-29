import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { GetHistoricalAPRRes } from "liquidops";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";

export type HistoricalAPRRes = APR[];

interface APR {
  date: string;
  value: number;
}

export function useHistoricalAPR(token: string, overrideCache: boolean) {
  const DATA_KEY = `historical-apr-${token}` as const;

  return useQuery({
    queryKey: ["historical-apr", token],
    queryFn: async (): Promise<HistoricalAPRRes> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const data = await LiquidOpsClient.getHistoricalAPR({
          token,
        });

        const formattedData = formatHistoricalAPR(data);

        const historicalAPRCache = {
          dataKey: DATA_KEY,
          data: formattedData,
        };
        cacheData(historicalAPRCache);

        return formattedData;
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function formatHistoricalAPR(data: GetHistoricalAPRRes) {
  if (data.length > 2) {
    return data
      .map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        value: item.apr,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else {
    return data.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      value: item.apr,
    }));
  }
}
