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
      try {
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
      } catch (error) {
        // If historical data fails, fetch current APR as fallback
        const currentAPR = await LiquidOpsClient.getAPR({ token });

        // Return array with single entry for current APR
        return [
          {
            date: new Date().toLocaleDateString(),
            value: Number(currentAPR.toFixed(2)),
          },
        ];
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
