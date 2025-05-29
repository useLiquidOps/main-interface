import { PendingTxContext } from "@/components/PendingTransactions/PendingTransactions";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { useQuery } from "@tanstack/react-query";
import { GetResultRes, tokenInput } from "liquidops";
import { useContext, useEffect } from "react";

export function usePendingTxSync() {
  const [pendingTxs, setPendingTxs] = useContext(PendingTxContext);

  const { data, isSuccess } = useQuery({
    queryKey: ["pending-transactions", pendingTxs],
    queryFn: async () => {
      console.log(pendingTxs)
      return (await Promise.all(pendingTxs.map(async (tx) => {
        let status: GetResultRes = "pending";
        try {
          status = await LiquidOpsClient.getResult({
            transferID: tx.id,
            tokenAddress: tokenInput(tx.ticker).tokenAddress,
            action: tx.action === "unlend" ? "unLend" : tx.action
          });
        } catch {
          status = "pending";
        }

        return { id: tx.id, status };
      })))
        .filter((tx) => tx.status !== "pending")
        .map((tx) => tx.id);
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!isSuccess || !data) return;
    setPendingTxs(
      (pendingTxs) => pendingTxs.filter((tx1) => !data.includes(tx1.id))
    );
  }, [data, isSuccess]);
}
