import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { GetResultRes } from "liquidops";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";

export type ResultCache = GetResultRes;

export function useGetResult(
  transferID: string,
  tokenAddress: string,
  action: "lend" | "unLend" | "borrow" | "repay",
  overrideCache?: boolean,
) {
  const DATA_KEY = `result-${transferID}-${tokenAddress}-${action}` as const;

  return useQuery({
    queryKey: ["result", transferID, tokenAddress, action],
    queryFn: async (): Promise<GetResultRes> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const getResult = await LiquidOpsClient.getResult({
          transferID,
          tokenAddress,
          action,
        });

        const resultCache = {
          dataKey: DATA_KEY,
          data: getResult,
        };
        cacheData(resultCache);

        return getResult;
      }
    },
    enabled: !!transferID && !!tokenAddress && !!action,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
