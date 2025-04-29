import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "../data/useWalletAddress";
import {
  WrappedQuantity,
  unWrapQuantity,
  wrapQuantity,
  isDataCachedValid,
  cacheData,
} from "@/utils/caches/cacheUtils";
import { tokenData } from "liquidops";

export interface GlobalPositionCache {
  collateralLogos: string[];
  collateralValueUSD: WrappedQuantity;
  borrowCapacityUSD: WrappedQuantity;
  liquidationPointUSD: WrappedQuantity;
  availableToBorrowUSD: WrappedQuantity;
}

export interface GlobalPositionResult {
  collateralLogos: string[];
  collateralValueUSD: Quantity;
  borrowCapacityUSD: Quantity;
  liquidationPointUSD: Quantity;
  availableToBorrowUSD: Quantity;
}

export function useGlobalPosition(overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY = `global-position-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["global-position", walletAddress],
    queryFn: async (): Promise<GlobalPositionResult> => {
      if (!walletAddress) {
        throw new Error("Wallet address not available");
      }

      // Check cache first
      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache && overrideCache === false) {
        // Convert cached data back to the original format with Quantity objects
        return {
          collateralLogos: checkCache.collateralLogos,
          collateralValueUSD: unWrapQuantity(checkCache.collateralValueUSD),
          borrowCapacityUSD: unWrapQuantity(checkCache.borrowCapacityUSD),
          liquidationPointUSD: unWrapQuantity(checkCache.liquidationPointUSD),
          availableToBorrowUSD: unWrapQuantity(checkCache.availableToBorrowUSD),
        };
      }

      // Use the getGlobalPosition function to get all data
      const { globalPosition } = await LiquidOpsClient.getGlobalPosition({
        walletAddress: walletAddress,
      });

      // Find logos for tokens with positive collateral
      const collateralLogos = Object.keys(globalPosition.tokenPositions)
        .filter((ticker) => {
          const position = globalPosition.tokenPositions[ticker];
          return position && BigInt(position.collateralization) > 0n;
        })
        .map((ticker) => {
          // Find matching token in tokenData object by ticker or cleanTicker
          const foundToken = Object.values(tokenData).find(
            (info) =>
              info.ticker.toUpperCase() === ticker.toUpperCase() ||
              info.cleanTicker.toUpperCase() === ticker.toUpperCase()
          );
          return foundToken?.icon;
        })
        .filter((icon): icon is string => !!icon);

      // Create the result with Quantity objects
      const result: GlobalPositionResult = {
        collateralLogos,
        collateralValueUSD: new Quantity(
          globalPosition.collateralizationUSD,
          globalPosition.usdDenomination
        ),
        borrowCapacityUSD: new Quantity(
          globalPosition.capacityUSD,
          globalPosition.usdDenomination
        ),
        liquidationPointUSD: new Quantity(
          globalPosition.liquidationLimitUSD,
          globalPosition.usdDenomination
        ),
        availableToBorrowUSD: new Quantity(
          globalPosition.capacityUSD - globalPosition.borrowBalanceUSD,
          globalPosition.usdDenomination
        ),
      };

      // Create cacheable version with wrapped Quantity objects
      const cacheableData: GlobalPositionCache = {
        collateralLogos,
        collateralValueUSD: wrapQuantity(result.collateralValueUSD),
        borrowCapacityUSD: wrapQuantity(result.borrowCapacityUSD),
        liquidationPointUSD: wrapQuantity(result.liquidationPointUSD),
        availableToBorrowUSD: wrapQuantity(result.availableToBorrowUSD),
      };

      cacheData({
        dataKey: DATA_KEY,
        data: cacheableData,
      });

      return result;
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
