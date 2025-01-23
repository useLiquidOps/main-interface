import { useQuery } from "@tanstack/react-query";
import { tokenData, TokenData } from "liquidops";

export interface SupportedToken
  extends Omit<
    TokenData,
    "oTicker" | "oAddress" | "controllerAddress" | "cleanTicker"
  > {
  extraAmount: string;
}

export function useSupportedTokens() {
  return useQuery({
    queryKey: ["supported-tokens"],
    queryFn: (): SupportedToken[] => {
      return Object.entries(tokenData).map(([address, data]) => ({
        address,
        icon: `/tokens/${data.ticker}.svg`,
        name: data.name,
        ticker: data.cleanTicker,
        extraAmount: "1",
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
