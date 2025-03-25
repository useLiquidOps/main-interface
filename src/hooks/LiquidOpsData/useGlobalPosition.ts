import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "../data/useWalletAddress";

export function useGlobalPosition() {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["global-position", walletAddress],
    queryFn: async () => {
      // empty position (on no wallet connection)
      if (!walletAddress)
        return {
          collateralLogos: [],
          collateralValueUSD: new Quantity(0n, 12n),
          borrowCapacityUSD: new Quantity(0n, 12n),
          liquidationPointUSD: new Quantity(0n, 12n),
          availableToBorrowUSD: new Quantity(0n, 12n),
        };

      try {
        // Use the new getGlobalPosition function to get all data at once
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
          .filter((logo) => !!logo);

        // Return the USD values directly from the global position
        return {
          collateralLogos,
          collateralValueUSD: new Quantity(
            globalPosition.collateralizationUSD,
            12n,
          ),
          borrowCapacityUSD: new Quantity(globalPosition.capacityUSD, 12n),
          liquidationPointUSD: new Quantity(
            globalPosition.liquidationLimitUSD,
            12n,
          ),
          availableToBorrowUSD: new Quantity(
            globalPosition.capacityUSD - globalPosition.borrowBalanceUSD,
            12n,
          ),
        };
      } catch (error) {
        console.error("Error fetching global position:", error);
        return {
          collateralLogos: [],
          collateralValueUSD: new Quantity(0n, 12n),
          borrowCapacityUSD: new Quantity(0n, 12n),
          liquidationPointUSD: new Quantity(0n, 12n),
          availableToBorrowUSD: new Quantity(0n, 12n),
        };
      }
    },
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
