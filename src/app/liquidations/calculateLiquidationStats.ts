import { Quantity } from "ao-tokens";

interface Liquidation {
  fromToken: {
    symbol: string;
  };
  toToken: {
    symbol: string;
    available: Quantity;
  };
}

export const calculateLiquidationStats = (liquidations: Liquidation[]) => {
  return liquidations.reduce(
    (acc, liquidation) => {
      return {
        availableLiquidations: Quantity.__add(
          acc.availableLiquidations,
          liquidation.toToken.available,
        ),
        totalProfit: Quantity.__add(
          acc.totalProfit,
          liquidation.toToken.available,
        ),
        markets: new Set([
          ...acc.markets,
          liquidation.fromToken.symbol,
          liquidation.toToken.symbol,
        ]),
      };
    },
    {
      availableLiquidations: new Quantity(0n, 12n),
      totalProfit: new Quantity(0n, 12n),
      markets: new Set<string>(),
    },
  );
};
