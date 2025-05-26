import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";

interface LendParams {
  token: string;
  quantity: bigint;
}

type UnlendParams = LendParams;

export function useLend() {
  const queryClient = useQueryClient();

  const lendMutation = useMutation({
    mutationFn: async ({ token, quantity }: LendParams) => {
      try {
        const res = await LiquidOpsClient.lend({
          token,
          quantity,
        });
        queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance"
          ]
        });

        return res;
      } catch (error) {
        throw error;
      }
    },
  });

  const unlendMutation = useMutation({
    mutationFn: async ({ token, quantity }: UnlendParams) => {
      try {
        const res = await LiquidOpsClient.unLend({
          token,
          quantity,
        });
        queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance"
          ]
        });

        return res;
      } catch (error) {
        throw error;
      }
    },
  });

  return {
    lend: lendMutation.mutate,
    isLending: lendMutation.isPending,
    lendError: lendMutation.error,

    unlend: unlendMutation.mutate,
    isUnlending: unlendMutation.isPending,
    unlendError: unlendMutation.error,

    reset: () => {
      lendMutation.reset();
      unlendMutation.reset();
    },
  };
}
