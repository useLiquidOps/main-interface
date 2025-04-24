import { Transaction } from "@/components/ActivityList/TransactionItem/TransactionItem";
import { formatTMB } from "@/components/utils/utils";
import { tokens } from "liquidops";
import { Quantity } from "ao-tokens";

export const exportTransactionsAsJSON = (
  transactions: Transaction[],
  supportedTokens?: any[],
): void => {
  // Format the current date as DD-MM-YYYY
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Check if there are transactions to export
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const getTokenDenomination = (tokenAddress: string) => {
    if (!supportedTokens) return 0n;

    const token = supportedTokens.find((t) => {
      const ticker = Object.entries(tokens)
        .find(([_, addr]) => addr === tokenAddress)?.[0]
        ?.toLowerCase();
      return ticker === t.ticker.toLowerCase();
    });
    return token?.denomination ?? 0n;
  };

  const getTokenTicker = (tokenAddress: string) => {
    return (
      Object.entries(tokens)
        .find(([_, address]) => address === tokenAddress)?.[0]
        ?.toUpperCase() || "UNKNOWN"
    );
  };

  // Create formatted data for JSON
  const formattedTransactions = transactions.map((tx) => {
    const tokenTicker = getTokenTicker(tx.tags["token"]);
    const quantity = new Quantity(
      tx.tags["Quantity"],
      getTokenDenomination(tx.tags["token"]),
    );

    return {
      id: tx.id,
      date: new Date(Number(tx.tags.timestamp)).toISOString(),
      action: tx.tags["Analytics-Tag"],
      quantity: formatTMB(quantity),
      token: tokenTicker,
      blockTimestamp: new Date(tx.block.timestamp * 1000).toISOString(),
      // Optionally include raw data for more flexibility
      rawData: {
        tags: tx.tags,
        block: tx.block
      }
    };
  });

  // Generate JSON content
  const jsonContent = JSON.stringify(formattedTransactions, null, 2);

  // Create download
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `LiquidOps-transactions-${formattedDate}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};