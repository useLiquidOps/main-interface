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
      const [reserves, apr] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        LiquidOpsClient.getAPR({ token }),
      ]);

      const protocolBalance =
        Number(reserves.available) + Number(reserves.lent);
      const utilizationRate =
        protocolBalance > 0
          ? (Number(reserves.lent) / protocolBalance) * 100
          : 0;

      return {
        unLent: reserves.available,
        borrows: reserves.lent,
        protocolBalance,
        utilizationRate,
        apr: Number(apr.toFixed(2)),
        percentChange: {
          // TODO: This is a placeholder, replace with real data
          outcome: true,
          change: "1.00",
        },
      };
    },
  });
}
