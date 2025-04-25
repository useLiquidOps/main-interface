import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface SupportedToken {
  ticker: string;
  [key: string]: any;
}

interface HighestAPYResult {
  highestAPY: number;
  highestTicker: string;
  isLoading: boolean;
}

export function useHighestAPY(supportedTokens?: SupportedToken[]) {
  return useQuery<HighestAPYResult>({
    queryKey: ["highest-apy"],
    queryFn: async (): Promise<HighestAPYResult> => {
      if (!supportedTokens || supportedTokens.length === 0) {
        return {
          highestAPY: 0,
          highestTicker: "",
          isLoading: false,
        };
      }

      try {
        let currentHighestAPY = 0;
        let currentHighestTicker = supportedTokens[0]?.ticker || "";

        for (const token of supportedTokens) {
          const ticker = token.ticker.toUpperCase();

          const supplyAPR = await LiquidOpsClient.getSupplyAPR({
            token: ticker,
          });

          if (supplyAPR > currentHighestAPY) {
            currentHighestAPY = supplyAPR;
            currentHighestTicker = token.ticker;
          }
        }

        return {
          highestAPY: currentHighestAPY,
          highestTicker: currentHighestTicker,
          isLoading: false,
        };
      } catch (error) {
        console.error("Error finding highest APY:", error);
        return {
          highestAPY: 0,
          highestTicker: "",
          isLoading: false,
        };
      }
    },
    enabled: !!supportedTokens && supportedTokens.length > 0,
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
  });
}
