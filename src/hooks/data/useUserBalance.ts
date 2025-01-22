import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { Token, Quantity } from "ao-tokens";
import { tokenOperations } from "./tempGetBalance";
import { tokenInput } from "liquidops";

export function useUserBalance(token: string, oToken?: boolean) {
  const { tokenAddress, oTokenAddress } = tokenInput(token);
  const selectedAddress = oToken ? oTokenAddress : tokenAddress;

  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", token, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const [rawBalance, tokenInstance] = await Promise.all([
        tokenOperations.getBalance({
          token,
          walletAddress,
        }),
        Token(selectedAddress),
      ]);

      return new Quantity(
        rawBalance as bigint,
        tokenInstance.info.Denomination,
      );
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
