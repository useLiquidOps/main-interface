import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface HistoricalAPRData {
  date: string;
  value: number;
}

export function useHistoricalAPR(token: string) {
  return useQuery({
    queryKey: ["historical-apr", token],
    queryFn: async (): Promise<HistoricalAPRData[]> => {
      const data = await LiquidOpsClient.getHistoricalAPR({
        token,
      });

      return data
        .map((item) => ({
          date: new Date(item.timestamp).toLocaleDateString(),
          value: item.apr,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
