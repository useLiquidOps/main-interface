import { useQuery } from "@tanstack/react-query";
import { tokenData, TokenData } from "liquidops";

export interface SupportedToken
  extends Omit<
    TokenData,
    "oTicker" | "oAddress" | "controllerAddress" | "cleanTicker" | "address"
  > {
  extraAmount: string;
  denomination: bigint;
}

export function useSupportedTokens() {
  return useQuery({
    queryKey: ["supported-tokens"],
    queryFn: (): SupportedToken[] => {
      return Object.entries(tokenData).map(([_, data]) => ({
        icon: `/tokens/${data.ticker}.svg`,
        name: data.name,
        ticker: data.cleanTicker,
        extraAmount: "1",
        denomination: data.denomination,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
