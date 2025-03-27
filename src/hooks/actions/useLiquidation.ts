import { useMutation } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface LiquidationParams {
  token: string;
  rewardToken: string;
  targetUserAddress: string;
  quantity: bigint;
}

export function useLiquidation() {
  const liquidationMutation = useMutation({
    mutationFn: async ({
      token,
      rewardToken,
      targetUserAddress,
      quantity,
    }: LiquidationParams) => {
      try {
        return await LiquidOpsClient.liquidate({
          token,
          rewardToken,
          targetUserAddress,
          quantity,
        });
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    liquidate: liquidationMutation.mutate,
    isLiquidating: liquidationMutation.isPending,
    liquidationError: liquidationMutation.error,
    reset: liquidationMutation.reset,
  };
}
