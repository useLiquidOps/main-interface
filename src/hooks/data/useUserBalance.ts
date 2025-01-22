import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { Token, Quantity } from "ao-tokens";

export function useUserBalance(token: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", token, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");
      const [rawBalance, t] = await Promise.all([
        await LiquidOpsClient.getBalance({
          token,
          walletAddress,
        }),
        await Token(token)
      ]);

      return new Quantity(
        rawBalance as bigint,
        t.info.Denomination
      );
    },
    // Only fetch when we have a wallet address
    enabled: !!walletAddress,
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
