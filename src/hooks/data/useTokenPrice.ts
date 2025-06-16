import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { tickerToGeckoMap } from "@/utils/tokenMappings";

export interface Prices {
  [key: string]: { usd: number };
}

export function usePrices(overrideCache?: boolean) {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async (): Promise<Prices> => {
      const gekoURL = `https://api.coingecko.com/api/v3/simple/price?ids=${Array.from(new Set(Object.values(tickerToGeckoMap))).join(",")}&vs_currencies=usd`;
      const response = await fetch(gekoURL);
      const geckoResponse = await response.json();

      return geckoResponse;
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
