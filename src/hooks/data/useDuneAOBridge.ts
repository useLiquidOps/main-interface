import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import axios from "axios";

export function useDuneAOBridge(overrideCache?: boolean) {
  const DATA_KEY = `dune-ao-bridge-stats`;

  return useQuery({
    queryKey: ["dune-ao-bridge-stats"],
    queryFn: async () => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache !== false && overrideCache !== true) {
        return checkCache;
      } else {
        const data = await axios.get("http://api.liquidops.io/ao-bridge-data");
        const procccesedData = data.data;

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
