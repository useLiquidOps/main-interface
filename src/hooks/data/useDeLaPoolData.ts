import { useQuery } from "@tanstack/react-query";
import { getAPRGraph } from "@/utils/DeFiLlama/DefiLlama";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { defiLlamaIds } from "@/utils/tokenMappings";

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

      return await getAPRGraph(defiLlamaId);;
    },
  });
}
