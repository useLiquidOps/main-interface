import { useQuery } from "@tanstack/react-query";
import { tokenData, TokenData } from "liquidops";

export type SupportedToken = TokenData & {
  icon: string;
};

export function useSupportedTokens() {
  return useQuery({
    queryKey: ["supported-tokens"],
    queryFn: (): SupportedToken[] => {
      return Object.entries(tokenData).map(([_, data]) => ({
        ...data,
        icon: `./tokens/${data.cleanTicker}.svg`,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}