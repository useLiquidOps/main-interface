import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "../data/useWalletAddress";
import { GetTransactions } from "liquidops";
import { useSupportedTokens } from "../data/useSupportedTokens";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";

type TransactionAction = GetTransactions["action"];

export type TransactionCache = any;

const ACTIONS: TransactionAction[] = ["borrow", "lend", "repay", "unLend"];
export function useTransactions(overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  const { data: supportedTokens = [] } = useSupportedTokens();

  const DATA_KEY = `allTransactions-${walletAddress}` as const;

  return useQuery({
    queryKey: ["allTransactions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet address not available");
      }

      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache && overrideCache === false) {
        return checkCache;
      } else {
        const allTransactions = [];
        for (let token of supportedTokens) {
          for (let action of ACTIONS) {
            let ticker = token["ticker"];
            try {
              const result = await LiquidOpsClient.getTransactions({
                token: ticker.toUpperCase(),
                action,
                walletAddress,
              });
              allTransactions.push(...result.transactions);
            } catch (error) {
              console.error(
                `Error fetching transactions for ${token} ${action}:`,
                error,
              );
            }
          }
        }

        const filteredTransactions = allTransactions
          .filter((tx) => tx.tags?.timestamp)
          .sort((a, b) => {
            const timestampA = parseInt(a.tags.timestamp);
            const timestampB = parseInt(b.tags.timestamp);
            return timestampB - timestampA;
          });

        const transactionsCache = {
          dataKey: DATA_KEY,
          data: filteredTransactions,
        };
        cacheData(transactionsCache);

        return filteredTransactions;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
