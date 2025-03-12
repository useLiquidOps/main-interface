import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { GetResultRes } from "liquidops";

export function useGetResult(
  transferID: string,
  tokenAddress: string,
  action: "lend" | "unLend" | "borrow" | "repay",
) {
  return useQuery({
    queryKey: ["result", transferID, tokenAddress, action],
    queryFn: async (): Promise<GetResultRes> => {
      const getResult = await LiquidOpsClient.getResult({
        transferID,
        tokenAddress,
        action,
      });
      return getResult;
    },
    enabled: !!transferID && !!tokenAddress && !!action,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
