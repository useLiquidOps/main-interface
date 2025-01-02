import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";

interface ProtocolStats {
  available: string;
  lent: string;
  protocolBalance: number;
  apr: number;
}

export function useProtocolStats(token: string) {
  return useQuery({
    queryKey: ["protocol-stats", token],
    queryFn: async (): Promise<ProtocolStats> => {
      const [reserves, apr] = await Promise.all([
        LiquidOpsClient.getReserves({ token }),
        LiquidOpsClient.getAPR({ token }),
      ]);

      return {
        ...reserves,
        protocolBalance: Number(reserves.available) + Number(reserves.lent),
        apr,
      };
    },
  });
}
