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

  const USD_DENOMINATION = 12n;

  return useQuery({
    queryKey: ["global-position", walletAddress],
    queryFn: async (): Promise<GlobalPositionResult> => {
      const emptyPosition: GlobalPositionResult = {
        collateralLogos: [],
        collateralValueUSD: new Quantity(0n, USD_DENOMINATION),
        borrowCapacityUSD: new Quantity(0n, USD_DENOMINATION),
        liquidationPointUSD: new Quantity(0n, USD_DENOMINATION),
        availableToBorrowUSD: new Quantity(0n, USD_DENOMINATION),
      };

      // Return empty position if no wallet
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

        // Get token infos for logos
        const tokenInfosUnfiltered = await Promise.all(
          Object.keys(globalPosition.tokenPositions).map(async (token) => {
            try {
              const info = await LiquidOpsClient.getInfo({ token });
              return {
                Logo: info.logo,
                Ticker: info.ticker,
                Name: info.name,
              };
            } catch (error) {
              console.error(`Error fetching info for token ${token}:`, error);
              return null;
            }
          }),
        );

        const tokenInfos = tokenInfosUnfiltered.filter(Boolean);

        // Find logos for tokens with positive collateral
        const collateralLogos = Object.keys(globalPosition.tokenPositions)
          .filter((ticker) => {
            const position = globalPosition.tokenPositions[ticker];
            return position && BigInt(position.collateralization) > 0n;
          })
          .map((ticker) => {
            return tokenInfos.find(
              (info) => info?.Ticker?.toUpperCase() === ticker.toUpperCase(),
            )?.Logo;
          })
          .filter((logo): logo is string => !!logo);

        // Create the result with Quantity objects
        const result: GlobalPositionResult = {
          collateralLogos,
          collateralValueUSD: new Quantity(
            globalPosition.collateralizationUSD,
            USD_DENOMINATION,
          ),
          borrowCapacityUSD: new Quantity(
            globalPosition.capacityUSD,
            USD_DENOMINATION,
          ),
          liquidationPointUSD: new Quantity(
            globalPosition.liquidationLimitUSD,
            USD_DENOMINATION,
          ),
          availableToBorrowUSD: new Quantity(
            globalPosition.capacityUSD - globalPosition.borrowBalanceUSD,
            USD_DENOMINATION,
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
