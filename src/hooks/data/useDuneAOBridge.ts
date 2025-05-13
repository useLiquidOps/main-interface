import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { DuneClient } from "@duneanalytics/client-sdk";

export function useDuneAOBridge(overrideCache?: boolean) {
  const DATA_KEY = `dune-ao-bridge-stats`;

  return useQuery({
    queryKey: ["dune-ao-bridge-stats"],
    queryFn: async () => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const duneAPIKey = "";

        if (!duneAPIKey) {
          throw new Error("duneAPIKey not found in the .env file.");
        }

        const dune = new DuneClient(duneAPIKey);

        const query_result = await dune.getLatestResult({ queryId: 4030850 });

        const data = query_result.result?.rows;

        const stETH = data?.find((item: any) => item.Token === "stETH");
        const DAI = data?.find((item: any) => item.Token === "DAI");

        const procccesedData = {
          stETH,
          DAI,
        };

        const cache = {
          dataKey: DATA_KEY,
          data: procccesedData,
        };
        cacheData(cache);

        return procccesedData;
      }
    },
  });
}
