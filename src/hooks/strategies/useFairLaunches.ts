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
      return await fairLaunchAdapter();
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
