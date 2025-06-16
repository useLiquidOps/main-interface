import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import axios from "axios";

export function useDuneAOBridge(overrideCache?: boolean) {
  return useQuery({
    queryKey: ["dune-ao-bridge-stats"],
    queryFn: async () => {
      const data = await axios.get("https://api.liquidops.io/ao-bridge-data");
      const procccesedData = data.data;

      return procccesedData;
    },
  });
}
