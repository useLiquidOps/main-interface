import { useMutation } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface BorrowParams {
  token: string;
  quantity: bigint;
}

type RepayParams = BorrowParams;

export function useBorrow() {
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
