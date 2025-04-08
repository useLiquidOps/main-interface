import { useMutation } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface GetLiquidationsParams {
  token: string;
}

export function useGetLiquidations() {
  const getLiquidationsMutation = useMutation({
    mutationFn: async ({ token }: GetLiquidationsParams) => {
      try {
        return await LiquidOpsClient.getLiquidations();
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    getLiquidations: getLiquidationsMutation.mutate,
    isGettingLiquidations: getLiquidationsMutation.isPending,
    getLiquidationsError: getLiquidationsMutation.error,
    reset: getLiquidationsMutation.reset,
  };
}
