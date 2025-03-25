import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Quantity } from "ao-tokens";
import { useHistoricalAPR, HistoricalAPRRes } from "./useHistoricalAPR";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";
import { GetInfoRes } from "liquidops";

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

export type ProtocolStatsCache = GetInfoRes;

export function useProtocolStats(token: string) {
  const { data: historicalAPR } = useHistoricalAPR(token);

  const DATA_KEY = "protocol-stats" as const;

  return useQuery({
    queryKey: ["protocol-stats", token],
    queryFn: async (): Promise<ProtocolStats> => {
      const checkCache = isDataCachedValid(DATA_KEY);
      const safeHistoricalAPR = historicalAPR ?? [];

      if (checkCache) {
        return getProtocolStatsData(checkCache, safeHistoricalAPR);
      } else {
        const [getInfoRes] = await Promise.all([
          LiquidOpsClient.getInfo({ token }),
        ]);

        const protocolStatsCache = {
          dataKey: DATA_KEY,
          data: getInfoRes,
        };
        cacheData(protocolStatsCache);

        return getProtocolStatsData(getInfoRes, safeHistoricalAPR);
      }
    },
    enabled: !!historicalAPR,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

function getProtocolStatsData(
  getInfoRes: GetInfoRes,
  historicalAPR: HistoricalAPRRes,
) {
  const denomination = BigInt(getInfoRes.denomination);
  const available = new Quantity(getInfoRes.cash, denomination);
  const lent = new Quantity(getInfoRes.totalBorrows, denomination);
  const protocolBalance = Quantity.__add(available, lent);

  const zero = new Quantity(0, denomination);
  const oneHundred = new Quantity(0, denomination).fromNumber(100);

  const utilizationRate = Quantity.lt(zero, protocolBalance)
    ? Quantity.__div(Quantity.__mul(lent, oneHundred), protocolBalance)
    : zero;

  // Use the latest APR from historical data
  const currentAPR = historicalAPR?.[historicalAPR.length - 1]?.value ?? 0;
  const yesterdayAPR =
    historicalAPR?.[historicalAPR.length - 2]?.value ?? currentAPR;

  const change = (((currentAPR - yesterdayAPR) / yesterdayAPR) * 100).toFixed(
    2,
  );

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
}
