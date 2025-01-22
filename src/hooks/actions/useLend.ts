import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

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
        return await LiquidOpsClient.lend({
          token,
          quantity,
        });
      } catch (error) {
        throw error;
      }
    },

    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({
        queryKey: ["protocol-stats", token],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-balance", token],
      });
      queryClient.invalidateQueries({
        queryKey: ["global-position", token]
      });
    },
  });

  const unlendMutation = useMutation({
    mutationFn: async ({ token, quantity }: UnlendParams) => {
      try {
        return await LiquidOpsClient.unLend({
          token,
          quantity,
        });
      } catch (error) {
        throw error;
      }
    },

    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({
        queryKey: ["protocol-stats", token],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-balance", token],
      });
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
