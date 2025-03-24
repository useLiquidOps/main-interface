import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { GetHistoricalAPRRes } from "liquidops";

export function useHistoricalAPR(token: string) {
  return useQuery({
    queryKey: ["historical-apr", token],
    queryFn: async (): Promise<formatedHistoricalAPRRes[]> => {
      const data = await LiquidOpsClient.getHistoricalAPR({
        token,
      });

      return formatHistoricalAPR(data);
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

interface formatedHistoricalAPRRes {
  date: string;
  value: number;
}

export function formatHistoricalAPR(data: GetHistoricalAPRRes) {
  if (data.length > 2) {
    return data
      .map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        value: item.apr,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else {
    return data.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      value: item.apr,
    }));
  }
}
