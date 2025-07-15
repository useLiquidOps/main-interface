import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { getFairlaunchAPY } from "@/app/strategies/adapters/fairLaunches/getFairlaunchAPY";

export function useFairLaunchAPY(
  fairLaunchID: string,
  overrideCache?: boolean,
) {
  const DATA_KEY = `fairlaunch-apy-${fairLaunchID}` as const;

  return useQuery({
    queryKey: ["fairlaunch-apy", fairLaunchID],
    queryFn: async (): Promise<number> => {
      return await getFairlaunchAPY(fairLaunchID);
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
