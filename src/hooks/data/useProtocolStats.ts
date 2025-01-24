import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Token, Quantity } from "ao-tokens";
import { tokenInput } from "liquidops";
import { useHistoricalAPR } from "./useHistoricalAPR";

interface ProtocolStats {
  denomination: bigint;
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
  const { oTokenAddress } = tokenInput(token);
  const { data: historicalAPR } = useHistoricalAPR(token);

  return useQuery({
    queryKey: ["protocol-stats", token],
    queryFn: async (): Promise<ProtocolStats> => {
      const [reserves, tokenInstance] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        Token(oTokenAddress),
      ]);

      const denomination = tokenInstance.info.Denomination;
      const available = new Quantity(reserves.available, denomination);
      const lent = new Quantity(reserves.lent, denomination);
      const protocolBalance = Quantity.__add(available, lent);
      const zero = tokenInstance.Quantity.fromNumber(0);

      const utilizationRate = Quantity.lt(zero, protocolBalance)
        ? Quantity.__div(
            Quantity.__mul(lent, tokenInstance.Quantity.fromNumber(100)),
            protocolBalance,
          )
        : zero;

      // Use the latest APR from historical data
      const currentAPR = historicalAPR?.[historicalAPR.length - 1]?.value ?? 0;
      const yesterdayAPR =
        historicalAPR?.[historicalAPR.length - 2]?.value ?? currentAPR;

      const change = (
        ((currentAPR - yesterdayAPR) / yesterdayAPR) *
        100
      ).toFixed(2);

      return {
        denomination,
        unLent: available,
        borrows: lent,
        protocolBalance,
        utilizationRate,
        apr: currentAPR,
        percentChange: {
          outcome: currentAPR >= yesterdayAPR,
          change,
        },
      };
    },
    enabled: !!historicalAPR,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
