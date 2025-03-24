import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Token, Quantity } from "ao-tokens";

export function useGetPosition(tokenAddress: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["position", tokenAddress, walletAddress],
    queryFn: async (): Promise<Quantity> => {
      if (!walletAddress) {
        return new Quantity(0n, 12n);
      }
      
      const tokenInstance = await Token(tokenAddress);
      const data = await LiquidOpsClient.getPosition({
        token: tokenAddress,
        recipient: walletAddress,
      });
      return new Quantity(data.borrowBalance, tokenInstance.info.Denomination);
    },
    enabled: !!tokenAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}