import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import {
  leverageAdapter,
  LeverageStrategy,
} from "@/app/strategies/adapters/leverage/leverage";

export function useLeverage(overrideCache?: boolean) {
  const DATA_KEY = `leverage-strategies` as const;

  return useQuery({
    queryKey: ["leverage-strategies"],
    queryFn: async (): Promise<LeverageStrategy[]> => {
      return await leverageAdapter();
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
