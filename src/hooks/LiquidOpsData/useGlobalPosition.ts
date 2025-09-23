import { useQuery } from "@tanstack/react-query";
import { Quantity } from "ao-tokens-lite";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { useWalletAddress } from "../data/useWalletAddress";
import {
  WrappedQuantity,
  unWrapQuantity,
  wrapQuantity,
  isDataCachedValid,
  cacheData,
} from "@/utils/caches/cacheUtils";
import { tokenData } from "liquidops";
import {
  wrapTokenPositions,
  unWrapTokenPositions,
} from "./helpers/wrapGlobalPositions";
import { getBaseDenomination } from "@/utils/LiquidOps/getBaseDenomination";

export interface TokenPositionCache {
  borrowBalance: WrappedQuantity;
  capacity: WrappedQuantity;
  collateralization: WrappedQuantity;
  liquidationLimit: WrappedQuantity;
  ticker: string;
}

export interface GlobalPositionCache {
  collateralLogos: {
    ticker: string;
    logo: string;
  }[];
  collateralValueUSD: WrappedQuantity;
  borrowCapacityUSD: WrappedQuantity;
  borrowBalanceUSD: WrappedQuantity;
  liquidationPointUSD: WrappedQuantity;
  availableToBorrowUSD: WrappedQuantity;
  tokenPositions: {
    [token: string]: TokenPositionCache;
  };
}

export interface TokenPositionResult {
  borrowBalance: Quantity;
  capacity: Quantity;
  collateralization: Quantity;
  liquidationLimit: Quantity;
  ticker: string;
}

export interface GlobalPositionResult {
  collateralLogos: {
    ticker: string;
    logo: string;
  }[];
  collateralValueUSD: Quantity;
  borrowCapacityUSD: Quantity;
  borrowBalanceUSD: Quantity;
  liquidationPointUSD: Quantity;
  availableToBorrowUSD: Quantity;
  tokenPositions: {
    [token: string]: TokenPositionResult;
  };
}

export function useGlobalPosition(overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["global-position", walletAddress],
    queryFn: async (): Promise<GlobalPositionResult> => {
      if (!walletAddress) {
        throw new Error("Wallet address not available");
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
          return { ticker, logo: foundToken?.icon };
        })
        .filter((collateral) => !!collateral.logo) as GlobalPositionResult["collateralLogos"];

      // turn Bigints to Quantities
      const formattedTokenResult: { [token: string]: TokenPositionResult } = {};

      for (const [ticker, position] of Object.entries(
        globalPosition.tokenPositions,
      )) {
        const denomination = getBaseDenomination(ticker.toUpperCase());
        formattedTokenResult[ticker] = {
          borrowBalance: new Quantity(position.borrowBalance, denomination),

          capacity: new Quantity(position.capacity, denomination),

          collateralization: new Quantity(
            position.collateralization,
            denomination,
          ),
          liquidationLimit: new Quantity(
            position.liquidationLimit,
            denomination,
          ),

          ticker,
        };
      }

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
        borrowBalanceUSD: new Quantity(
          globalPosition.borrowBalanceUSD,
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
        tokenPositions: formattedTokenResult,
      };

      // Create cacheable version with wrapped Quantity objects
      const cacheableData: GlobalPositionCache = {
        collateralLogos,
        collateralValueUSD: wrapQuantity(result.collateralValueUSD),
        borrowCapacityUSD: wrapQuantity(result.borrowCapacityUSD),
        borrowBalanceUSD: wrapQuantity(result.borrowBalanceUSD),
        liquidationPointUSD: wrapQuantity(result.liquidationPointUSD),
        availableToBorrowUSD: wrapQuantity(result.availableToBorrowUSD),
        tokenPositions: wrapTokenPositions(globalPosition),
      };

      return result;
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
