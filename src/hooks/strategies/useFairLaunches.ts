import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import {
  FairLaunchStrategy,
  fairLaunchAdapter,
} from "@/app/strategies/adapters/fairLaunches/getFairlaunchAPY";

export function useFairLaunches(overrideCache?: boolean) {
  const DATA_KEY = `fair-launch-strategies` as const;

  return useQuery({
    queryKey: ["fair-launch-strategies"],
    queryFn: async (): Promise<FairLaunchStrategy[]> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const fairLaunches = await fairLaunchAdapter();

        cacheData({
          dataKey: DATA_KEY,
          data: fairLaunches,
        });

        return fairLaunches;
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
