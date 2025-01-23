import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { tokenOperations } from "./tempGetBalance";

export function useUserBalance(tokenAddress: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", tokenAddress, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const [balance] = await Promise.all([
        tokenOperations.getBalance({
          tokenAddress,
          walletAddress,
        }),
      ]);

      return balance;
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
