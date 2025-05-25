import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";

export function useCooldown(mode: "borrow" | "repay" | "withdraw" | "supply", token: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-cooldown", walletAddress, mode, token],
    queryFn: async () => {
      if (!walletAddress || mode == "repay" || mode == "supply") {
        return { onCooldown: false };
      }

      return await LiquidOpsClient.getCooldown({
        recipient: walletAddress,
        token
      });
    },
    enabled: !!walletAddress,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
}
