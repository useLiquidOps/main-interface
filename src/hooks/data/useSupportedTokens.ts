import { useQuery } from "@tanstack/react-query";
import { tokenData, TokenData } from "liquidops";

export interface SupportedToken
  extends Omit<
    TokenData,
    "oTicker" | "oAddress" | "controllerAddress" | "cleanTicker"
  > {
  denomination: bigint;
  collateralEnabled: boolean;
  baseDenomination: bigint;
}

export function useSupportedTokens() {
  return useQuery({
    queryKey: ["supported-tokens"],
    queryFn: (): SupportedToken[] => {
      return Object.entries(tokenData).map(([_, data]) => ({
        icon: `./tokens/${data.cleanTicker}.svg`,
        name: data.name,
        ticker: data.cleanTicker,
        denomination: data.denomination,
        collateralEnabled: data.collateralEnabled,
        baseDenomination: data.baseDenomination,
        address: data.address,
        oAddress: data.oAddress,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
