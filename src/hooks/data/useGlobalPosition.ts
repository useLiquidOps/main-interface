import { useQuery } from "@tanstack/react-query";
import { tokens } from "liquidops";
import { Quantity, Token } from "ao-tokens";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { tickerToGeckoMap, usePrices } from "./useTokenPrice"

export function useTokenInfos(marketTokenTicker: string) {
  const { data: walletAddress } = useWalletAddress();
  const { data: prices } = usePrices();

  return useQuery({
    queryKey: ["global-position", walletAddress, prices, marketTokenTicker],
    queryFn: async () => {
      const positions = await Promise.all(Object.values(tokens).map((token) =>
        LiquidOpsClient.getPosition({ token, recipient: walletAddress })
      ));

      const marketGeckoId = tickerToGeckoMap[marketTokenTicker.toUpperCase()];
      const marketUsdPrice = new Quantity(0n, 12n).fromNumber(prices?.[marketGeckoId]?.usd ?? 0);

      const inMarketValue = await Promise.all(positions.map(async (position) => {
        const denomination = BigInt(position.collateralDenomination);
        const marketData = {
          collateral: position.collateralTicker,
          collateralValue: new Quantity(position.totalCollateral, denomination),
          borrowCapacity: new Quantity(position.capacity, denomination),
          // TODO: the below should be the liquidation minimal, but it needs to be fixed in the oToken process
          liquidationPoint: new Quantity(position.capacity, denomination),
          availableToBorrow: new Quantity(BigInt(position.capacity) - BigInt(position.usedCapacity), denomination)
        };

        if (position.collateralTicker.toUpperCase() === marketTokenTicker.toUpperCase()) {
          return marketData;
        }

        const geckoId = tickerToGeckoMap[position.collateralTicker.toUpperCase()];
        const usdPrice = new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0);

        const qtyToMarketValue = (qty: Quantity) =>
          Quantity.__div(
            Quantity.__mul(qty, usdPrice),
            marketUsdPrice
          );

        return {
          collateral: position.collateralTicker,
          collateralValue: qtyToMarketValue(marketData.collateralValue),
          borrowCapacity: qtyToMarketValue(marketData.borrowCapacity),
          liquidationPoint: qtyToMarketValue(marketData.liquidationPoint),
          availableToBorrow: qtyToMarketValue(marketData.availableToBorrow)
        };
      }));

      const collaterals = inMarketValue.filter(
        (market) => Quantity.lt(new Quantity(0n, 12n), market.collateralValue)
      ).map((market) => market.collateral);

      return inMarketValue.reduce(
        (acc, curr) => ({
          collaterals,
          collateralValue: Quantity.__add(acc.collateralValue, curr.collateralValue),
          borrowCapacity: Quantity.__add(acc.borrowCapacity, curr.borrowCapacity),
          liquidationPoint: Quantity.__add(acc.liquidationPoint, curr.liquidationPoint),
          availableToBorrow: Quantity.__add(acc.availableToBorrow, curr.availableToBorrow)
        }),
        {
          collaterals,
          collateralValue: new Quantity(0n, 12n),
          borrowCapacity: new Quantity(0n, 12n),
          liquidationPoint: new Quantity(0n, 12n),
          availableToBorrow: new Quantity(0n, 12n),
        }
      );
    },
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
