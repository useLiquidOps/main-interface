import { useMutation } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface GetHistoricalAPRParams {
  token: string;
}

export function useHistoricalAPR() {
  const historicalAPRMutation = useMutation({
    mutationFn: async ({ token }: GetHistoricalAPRParams) => {
      try {
        return await LiquidOpsClient.getHistoricalAPR({
          token,
        });
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    getHistoricalAPR: historicalAPRMutation.mutate,
    isGettingHistoricalAPR: historicalAPRMutation.isPending,
    historicalAPRError: historicalAPRMutation.error,
    reset: historicalAPRMutation.reset,
  };
}
