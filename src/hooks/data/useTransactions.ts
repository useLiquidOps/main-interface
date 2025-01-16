import { useQueries, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { GetTransactions, GetTransactionsRes } from "liquidops";

type TransactionAction = GetTransactions["action"];
type UseTransactionsParams = Omit<
  GetTransactions,
  "walletAddress" | "action"
> & {
  actions: TransactionAction[];
};

export function useTransactions({
  token,
  cursor,
  actions,
}: UseTransactionsParams) {
  const { data: walletAddress } = useWalletAddress();
  const queryClient = useQueryClient();

  const queries = useQueries({
    queries: actions.map((action) => ({
      queryKey: ["transactions", token, action, walletAddress, cursor],
      queryFn: async (): Promise<GetTransactionsRes> => {
        if (!walletAddress) throw new Error("Wallet address not available");

        const transactions = await LiquidOpsClient.getTransactions({
          token,
          action,
          cursor,
          walletAddress,
        });

        return transactions;
      },
      enabled: !!walletAddress,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    })),
  });

  const getTransactionsByAction = (action: TransactionAction) => {
    return queryClient.getQueryData<GetTransactionsRes>([
      "transactions",
      token,
      action,
      walletAddress,
      cursor,
    ]);
  };

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries.map((query) => query.error).filter(Boolean);

  // Create a results object based on requested actions
  const results = actions.reduce(
    (acc, action) => ({
      ...acc,
      [`${action}Transactions`]: getTransactionsByAction(action),
    }),
    {},
  );

  return {
    ...results,
    isLoading,
    isError,
    errors,
    queries,
  };
}
