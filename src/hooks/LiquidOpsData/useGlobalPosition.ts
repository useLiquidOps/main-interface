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
} from "@/utils/cacheUtils";
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

export function useGlobalPosition() {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY = `global-position-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["global-position", walletAddress],
    queryFn: async (): Promise<GlobalPositionResult> => {
      const emptyPosition: GlobalPositionResult = {
        collateralLogos: [],
        collateralValueUSD: new Quantity(0n, 12n),
        borrowCapacityUSD: new Quantity(0n, 12n),
        liquidationPointUSD: new Quantity(0n, 12n),
        availableToBorrowUSD: new Quantity(0n, 12n),
      };

      // Add a delay before checking wallet address
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!walletAddress) return emptyPosition;

      try {
        // Check cache first
        const cachedData = isDataCachedValid(DATA_KEY);

        if (cachedData) {
          // Convert cached data back to the original format with Quantity objects
          return {
            collateralLogos: cachedData.collateralLogos,
            collateralValueUSD: unWrapQuantity(cachedData.collateralValueUSD),
            borrowCapacityUSD: unWrapQuantity(cachedData.borrowCapacityUSD),
            liquidationPointUSD: unWrapQuantity(cachedData.liquidationPointUSD),
            availableToBorrowUSD: unWrapQuantity(
              cachedData.availableToBorrowUSD,
            ),
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
                info.cleanTicker.toUpperCase() === ticker.toUpperCase(),
            );
            return foundToken?.icon;
          })
          .filter((icon): icon is string => !!icon);

        // Create the result with Quantity objects
        const result: GlobalPositionResult = {
          collateralLogos,
          collateralValueUSD: new Quantity(
            globalPosition.collateralizationUSD,
            globalPosition.usdDenomination,
          ),
          borrowCapacityUSD: new Quantity(
            globalPosition.capacityUSD,
            globalPosition.usdDenomination,
          ),
          liquidationPointUSD: new Quantity(
            globalPosition.liquidationLimitUSD,
            globalPosition.usdDenomination,
          ),
          availableToBorrowUSD: new Quantity(
            globalPosition.capacityUSD - globalPosition.borrowBalanceUSD,
            globalPosition.usdDenomination,
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
      } catch (error) {
        console.error("Error fetching global position:", error);
        return emptyPosition;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
