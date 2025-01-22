import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens";

interface Prices {
  [key: string]: { usd: number };
}

export const tickerToGeckoMap: Record<string, string> = {
  QAR: "arweave",
  DAI: "dai",
  STETH: "staked-ether",
};

export function usePrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async (): Promise<Prices> => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=arweave,dai,staked-ether,&vs_currencies=usd",
      );
      return response.json();
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
