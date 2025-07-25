import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { Quantity } from "ao-tokens-lite";
import { useHistoricalAPR, HistoricalAPRRes } from "./useHistoricalAPR";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { GetInfoRes, TokenInput } from "liquidops";
import { getSupplyAPRCache } from "../../utils/caches/getSupplyAPRCache";

export interface ProtocolStats {
  denomination: bigint;
  unLent: Quantity;
  borrows: Quantity;
  protocolBalance: Quantity;
  utilizationRate: Quantity;
  supplyAPR: number;
  borrowAPR: number;
  percentChange: {
    outcome: boolean;
    change: string;
  };
  info: GetInfoRes;
}

export type ProtocolStatsCache = GetInfoRes;

export function useProtocolStats(token: string, overrideCache?: boolean) {
  const { data: historicalAPR } = useHistoricalAPR(token);

  return useQuery({
    queryKey: ["protocol-stats", token],
    queryFn: async (): Promise<ProtocolStats> => {
      const safeHistoricalAPR = historicalAPR ?? [];
      const [getInfoRes] = await Promise.all([
        LiquidOpsClient.getInfo({ token }),
      ]);

      return await getProtocolStatsData(getInfoRes, safeHistoricalAPR, token);
    },
    enabled: !!historicalAPR,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

async function getProtocolStatsData(
  getInfoRes: GetInfoRes,
  historicalAPR: HistoricalAPRRes,
  token: TokenInput,
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

  // get borrow APR
  const borrowAPR = await LiquidOpsClient.getBorrowAPR({
    token,
  });

  // get supply APR
  const supplyAPR = await getSupplyAPRCache({
    token,
    getInfoRes,
    getBorrowAPRRes: borrowAPR,
  });

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
    supplyAPR,
    borrowAPR,
    percentChange: {
      outcome: currentAPR >= yesterdayAPR,
      change,
    },
    info: getInfoRes,
  };
}
