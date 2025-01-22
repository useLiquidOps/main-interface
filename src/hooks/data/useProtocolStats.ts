import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface ProtocolStats {
  unLent: string;
  borrows: string;
  protocolBalance: number;
  utilizationRate: number;
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
      const [reserves, apr, historicalAPRList] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        LiquidOpsClient.getAPR({ token }),
        LiquidOpsClient.getHistoricalAPR({ token }),
      ]);

      const protocolBalance =
        Number(reserves.available) + Number(reserves.lent);
      const utilizationRate =
        protocolBalance > 0
          ? (Number(reserves.lent) / protocolBalance) * 100
          : 0;

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
        unLent: reserves.available,
        borrows: reserves.lent,
        protocolBalance,
        utilizationRate,
        apr: currentAPR,
        percentChange: {
          outcome: currentAPR >= yesterdayEntry.apr,
          change,
        },
      };
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
