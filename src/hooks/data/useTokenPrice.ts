import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";

export interface Prices {
  [key: string]: { usd: number };
}

export const tickerToGeckoMap: Record<string, string> = {
  QAR: "arweave",
  WUSDC: "usd-coin",
};

export function usePrices() {
  const DATA_KEY = "prices" as const;

  return useQuery({
    queryKey: ["prices"],
    queryFn: async (): Promise<Prices> => {
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache) {
        return checkCache;
      } else {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=arweave,usd-coin,&vs_currencies=usd"
        );

        const geckoResponse = await response.json();

        cacheData({
          dataKey: DATA_KEY,
          data: geckoResponse,
        });

        return geckoResponse;
      }
    },
  });
}

export function useTokenPrice(ticker: string) {
  const geckoId = tickerToGeckoMap[ticker.toUpperCase()];
  const { data: prices, isLoading } = usePrices();

  return {
    price: new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0),
    isLoading,
  };
}
