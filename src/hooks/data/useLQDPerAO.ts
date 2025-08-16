import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens-lite";

interface YieldTick {
  AoReceived: string;
  TokenPriceInAo: string;
  TriggerMintReportIds: string[];
  Timestamp: number;
  AoKept: string;
  TokensDistributed: string;
  Nonce: number;
  PiReceived?: string;
}

function scaleBalance(amount: string, denomination: number): number {
  if (amount === "0") return 0;
  const len = amount.length;
  if (denomination >= len) {
    return parseFloat(
      "0." + "0".repeat(denomination - len) + amount.replace(/0+$/, ""),
    );
  }
  const integerPart = amount.substr(0, len - denomination);
  const fractionalPart = amount.substr(len - denomination).replace(/0+$/, "");
  if (fractionalPart === "") return parseInt(integerPart);
  return parseFloat(integerPart + "." + fractionalPart);
}

export function useLqdPerAO() {
  return useQuery({
    queryKey: ["lqd-per-ao"],
    queryFn: async (): Promise<Quantity> => {
      const res = await fetch(
        "https://cu16.ao-testnet.xyz/dry-run?process-id=N0L1lUC-35wgyXK31psEHRjySjQMWPs_vHtTas5BJa8",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Id: "1234",
            Target: "N0L1lUC-35wgyXK31psEHRjySjQMWPs_vHtTas5BJa8",
            Owner: "1234",
            Anchor: "0",
            Data: "1234",
            Tags: [
              { name: "Action", value: "Get-Yield-Tick-History" },
              { name: "Data-Protocol", value: "ao" },
              { name: "Type", value: "Message" },
              { name: "Variant", value: "ao.TN.1" },
            ],
          }),
        },
      );

      const data = await res.json();
      const ticks: YieldTick[] = JSON.parse(data.Messages[0].Data);
      const latest = ticks.reduce((max, tick) =>
        tick.Timestamp > max.Timestamp ? tick : max,
      );

      const aoAmount = scaleBalance(latest.AoKept, 12);
      const lqdAmount = scaleBalance(latest.TokensDistributed, 18);

      return new Quantity(0n, 18n).fromNumber(lqdAmount / aoAmount);
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
