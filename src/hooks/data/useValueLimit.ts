import { ProtocolStats } from "../LiquidOpsData/useProtocolStats";
import { Quantity } from "ao-tokens";
import { useMemo } from "react";

export function useValueLimit(inputValue?: string, protocolStats?: ProtocolStats): [Quantity, boolean] {
  const valueLimit = useMemo(
    () => {
      if (!protocolStats) {
        return new Quantity(0n, 0n);
      }

      return new Quantity(
        protocolStats.info.valueLimit,
        BigInt(protocolStats.info.collateralDenomination)
      );
    },
    [protocolStats]
  );
  const valueLimitReached = useMemo(
    () => {
      if (Quantity.eq(valueLimit, new Quantity(0n, 0n)) || !protocolStats || !inputValue) {
        return false;
      }

      return Quantity.lt(
        valueLimit,
        new Quantity(0n, BigInt(protocolStats.info.collateralDenomination)).fromString(inputValue)
      );
    },
    [valueLimit, protocolStats, inputValue]
  );

  return [valueLimit, valueLimitReached];
}
