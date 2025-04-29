import { LiquidOpsClient } from "@/utils/LiquidOps";
import { GetSupplyAPR, GetSupplyAPRRes } from "liquidops";
import { isDataCachedValid, cacheData } from "@/hooks/caches/cacheUtils";

export async function getSupplyAPRCache(
  configs: GetSupplyAPR,
  overrideCache?: boolean,
): Promise<GetSupplyAPRRes> {
  const DATA_KEY = `supply-apr-${configs.token.toUpperCase()}` as const;

  const checkCache = isDataCachedValid(DATA_KEY);

  if (
    checkCache !== false &&
    typeof checkCache === "number" &&
    overrideCache !== true
  ) {
    return checkCache;
  } else {
    const supplyAPR = await LiquidOpsClient.getSupplyAPR(configs);

    const APYCache = {
      dataKey: DATA_KEY,
      data: supplyAPR,
    };
    cacheData(APYCache);

    return supplyAPR;
  }
}
