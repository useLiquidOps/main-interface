import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Token, Quantity } from "ao-tokens"

interface ProtocolStats {
  unLent: string;
  borrows: string;
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
      const [reserves, apr, t] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        LiquidOpsClient.getAPR({ token }),
        await Token(token)
      ]);

      const lent = t.Quantity.fromString(reserves.lent);
      const protocolBalance = Quantity.__add(
        t.Quantity.fromString(reserves.available),
        lent
      );
      const zero = t.Quantity.fromNumber(0);
      const utilizationRate =
        Quantity.lt(zero, protocolBalance)
          ? Quantity.__div(Quantity.__mul(lent, t.Quantity.fromNumber(100)), protocolBalance)
          : zero;

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
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
