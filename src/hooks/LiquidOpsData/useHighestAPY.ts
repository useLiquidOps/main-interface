import { useQuery } from "@tanstack/react-query";
import { getSupplyAPRCache } from "../caches/getSupplyAPRCache";
import { tokenData } from "liquidops";

export interface HighestAPYResult {
  highestAPY: number;
  highestTicker: string;
  isLoading: boolean;
}

export function useHighestAPY() {
  const supportedTokens = Object.entries(tokenData).map(([_, data]) => ({
    icon: `/tokens/${data.ticker}.svg`,
    name: data.name,
    ticker: data.cleanTicker,
    extraAmount: "1",
    denomination: data.denomination,
    collateralEnabled: data.collateralEnabled,
    baseDenomination: data.baseDenomination,
  }));

  return useQuery({
    queryKey: [
      "highest-apy",
      supportedTokens?.map((token) => token.ticker).join("-") || "",
    ],
    queryFn: async () => {
      if (!supportedTokens || supportedTokens.length === 0) {
        throw new Error(
          "Error in useHighestAPY: Supported tokens is 0 or undefined.",
        );
      }
      try {
        let currentHighestAPY: number | null = null;
        let currentHighestTicker: string | null = null;

        for (const token of supportedTokens) {
          const ticker = token.ticker.toUpperCase();

          const supplyAPR = await getSupplyAPRCache({ token: ticker });

          if (currentHighestAPY === null) {
            currentHighestAPY = supplyAPR;
            currentHighestTicker = token.ticker;
          } else {
            if (supplyAPR > currentHighestAPY) {
              currentHighestAPY = supplyAPR;
              currentHighestTicker = token.ticker;
            }
          }
        }

        return {
          highestAPY: currentHighestAPY,
          highestTicker: currentHighestTicker,
          isLoading: false,
        };
      } catch (error) {
        console.error("Error finding highest APY:", error);
      }
    },
    enabled: !!supportedTokens && supportedTokens.length > 0,
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
  });
}
