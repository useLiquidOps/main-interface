import { useQuery } from "@tanstack/react-query";
import { getAPRGraph } from "@/utils/DefiLlama";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";

const defiLlamaIds: Record<string, string> = {
  qAR: "cd2164c7-66f3-455c-a690-e4fc778f8a72",
  wUSDC: "",
};

export function useDeLaPoolData(ticker: string, overrideCache?: boolean) {
  const defiLlamaId = defiLlamaIds[ticker];
  const DATA_KEY = `defi-llama-pool-${defiLlamaId}` as const;

  return useQuery({
    queryKey: ["defi-llama-pool", defiLlamaId],
    queryFn: async () => {
      if (!defiLlamaId)
        throw new Error(
          "Error in getAPRGraph: Please specify a Defi Llama pool ID",
        );

      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache && overrideCache === false) {
        return checkCache;
      } else {
        const data = await getAPRGraph(defiLlamaId);

        const poolCache = {
          dataKey: DATA_KEY,
          data,
        };
        cacheData(poolCache);

        return data;
      }
    },
  });
}
