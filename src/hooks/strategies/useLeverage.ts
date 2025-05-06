import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import {
  leverageAdapter,
  LeverageStrategy,
} from "@/app/strategies/adapters/leverage";

export function useLeverage(overrideCache?: boolean) {
  const DATA_KEY = `leverage-strategies` as const;

  return useQuery({
    queryKey: ["leverage-strategies"],
    queryFn: async (): Promise<LeverageStrategy[]> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const leverageStrategies = await leverageAdapter();

        cacheData({
          dataKey: DATA_KEY,
          data: leverageStrategies,
        });

        return leverageStrategies;
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
