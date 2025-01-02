import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";

export function useUserBalance(token: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", token, walletAddress],
    queryFn: async () => {
      return Number(
        await LiquidOpsClient.getBalance({
          token,
          walletAddress,
        }),
      );
    },
  });
}
