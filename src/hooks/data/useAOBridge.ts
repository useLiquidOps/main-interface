import { useQuery } from "@tanstack/react-query";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import axios from "axios";
import { getData } from "@/utils/AO/getData";

export function useAOBridge(overrideCache?: boolean) {
  return useQuery({
    queryKey: ["ao-bridge-stats"],
    queryFn: async () => {
      const USDS_ORACLE_ADDRESS = "qjOMZnan8Vo2gaLaOF1FXbFXOQOn_5sKbYspNSVRyNY";
      const STETH_ORACLE_ADDRESS =
        "wJV8FMkpoeLsTjJ6O7YZEuQgMqj-sDjPHhTeA73RsCc";
      const DAI_ORACLE_ADDRESS = "5q8vpzC5QAKOAJFM26MAKfZw1gwtw7WA_J2861ZiKhI";

      const data = await getData({
        Target: USDS_ORACLE_ADDRESS,
        Action: "Info",
      });

      if (data.Error) {
        throw new Error(`Error fetching AO pre bridge data: ${data.Error}`);
      }

      const messages = data.Messages[0].Tags;
      const lastYield = messages.find(
        (item: { value: string; name: string }) => item.name === "LastYield",
      )?.value;
      const nativeYield = lastYield / 100

      return {
        stETH: { Token_Qty: 1, Est_Yearly_AO: (1 * nativeYield) / 100 },
        USDS: { Token_Qty: 1, Est_Yearly_AO: (1 * nativeYield) / 100 },
        DAI: { Token_Qty: 1, Est_Yearly_AO: (1 * nativeYield) / 100 },
      };
    },
  });
}