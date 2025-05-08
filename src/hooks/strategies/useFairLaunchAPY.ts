import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { getFairlaunchAPY } from "@/app/strategies/adapters/fairLaunches/fairLaunch";

export function useFairLaunchAPY(
  fairLaunchID: string,
  overrideCache?: boolean,
) {
  const DATA_KEY = `fairlaunch-apy-${fairLaunchID}` as const;

  return useQuery({
    queryKey: ["fairlaunch-apy", fairLaunchID],
    queryFn: async (): Promise<number> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const apy = await getFairlaunchAPY(fairLaunchID);

        cacheData({
          dataKey: DATA_KEY,
          data: apy,
        });

        return apy;
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
