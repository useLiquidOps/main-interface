import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Token, Quantity } from "ao-tokens";

interface ProtocolStats {
  unLent: Quantity;
  borrows: Quantity;
  protocolBalance: Quantity;
  utilizationRate: Quantity;
  apr: number;
  percentChange: {
    outcome: boolean;
    change: string;
  };
}

export function useProtocolStats(token: string) {
  return useQuery({
    queryKey: ["protocol-stats", token],
    queryFn: async (): Promise<ProtocolStats> => {
      const [reserves, apr, historicalAPRList, t] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        LiquidOpsClient.getAPR({ token }),
        LiquidOpsClient.getHistoricalAPR({ token }),
        await Token(token),
      ]);

      const available = t.Quantity.fromString(reserves.available);
      const lent = t.Quantity.fromString(reserves.lent);
      const protocolBalance = Quantity.__add(available, lent);
      const zero = t.Quantity.fromNumber(0);
      const utilizationRate = Quantity.lt(zero, protocolBalance)
        ? Quantity.__div(
            Quantity.__mul(lent, t.Quantity.fromNumber(100)),
            protocolBalance,
          )
        : zero;

      const currentAPR = Number(apr.toFixed(2));

      // Get yesterday's timestamp
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      // Find APR entry closest to 24 hours ago
      const yesterdayEntry = historicalAPRList.reduce((prev, curr) => {
        return Math.abs(curr.timestamp - oneDayAgo) <
          Math.abs(prev.timestamp - oneDayAgo)
          ? curr
          : prev;
      });

      const change = (
        ((currentAPR - yesterdayEntry.apr) / yesterdayEntry.apr) *
        100
      ).toFixed(2);

      return {
        unLent: available,
        borrows: lent,
        protocolBalance,
        utilizationRate,
        apr: currentAPR,
        percentChange: {
          outcome: currentAPR >= yesterdayEntry.apr,
          change,
        },
      };
    },
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
