import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface BorrowParams {
  token: string;
  quantity: bigint;
}

type RepayParams = BorrowParams;

export function useBorrow() {
  const queryClient = useQueryClient();

  const borrowMutation = useMutation({
    mutationFn: async ({ token, quantity }: BorrowParams) => {
      try {
        return await LiquidOpsClient.borrow({
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

  const repayMutation = useMutation({
    mutationFn: async ({ token, quantity }: RepayParams) => {
      try {
        return await LiquidOpsClient.repay({
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
    borrow: borrowMutation.mutate,
    isBorrowing: borrowMutation.isPending,
    borrowError: borrowMutation.error,

    repay: repayMutation.mutate,
    isRepaying: repayMutation.isPending,
    repayError: repayMutation.error,

    reset: () => {
      borrowMutation.reset();
      repayMutation.reset();
    },
  };
}
