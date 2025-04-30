import { Transaction } from "@/components/ActivityList/TransactionItem/TransactionItem";
import { formatTMB } from "@/components/utils/utils";
import { tokens } from "liquidops";
import { Quantity } from "ao-tokens";

export const exportTransactionsAsCSV = (
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

  // Create formatted data for CSV
  const formattedTransactions = transactions.map((tx) => {
    const tokenTicker = getTokenTicker(tx.tags["token"]);
    const quantity = new Quantity(
      tx.tags["Quantity"],
      getTokenDenomination(tx.tags["token"]),
    );

    return {
      ID: tx.id,
      Date: new Date(Number(tx.tags.timestamp)).toLocaleString(),
      Action: tx.tags["Analytics-Tag"],
      Quantity: formatTMB(quantity),
      Token: tokenTicker,
      "Block Timestamp": new Date(tx.block.timestamp * 1000).toLocaleString(),
    };
  });

  // Generate CSV content
  const headers = Object.keys(formattedTransactions[0]).join(",");
  const csvRows = formattedTransactions.map((row) =>
    Object.values(row)
      .map((value) =>
        typeof value === "string" &&
        (value.includes(",") || value.includes('"') || value.includes("\n"))
          ? `"${value.replace(/"/g, '""')}"`
          : value,
      )
      .join(","),
  );
  const csvContent = [headers, ...csvRows].join("\n");

  // Create download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `LiquidOps-transactions-${formattedDate}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
