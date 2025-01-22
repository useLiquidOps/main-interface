import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { Token, Quantity } from "ao-tokens";
import { tokenOperations } from "./tempGetBalance";

export function useUserBalance(token: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", token, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");
      const [rawBalance, t] = await Promise.all([
        await tokenOperations.getBalance({
          token,
          walletAddress,
        }),
        await Token(token),
      ]);

      return new Quantity(rawBalance as bigint, t.info.Denomination);
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
