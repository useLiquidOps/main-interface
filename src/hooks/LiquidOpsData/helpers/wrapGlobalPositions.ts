import { Quantity } from "ao-tokens";
import {
  TokenPositionCache,
  GlobalPositionCache,
  TokenPositionResult,
} from "../useGlobalPosition";
import { wrapQuantity, unWrapQuantity } from "@/utils/caches/cacheUtils";
import { getBaseDenomination } from "@/utils/LiquidOps/getBaseDenomination";

interface TokenPosition {
  borrowBalance: bigint;
  capacity: bigint;
  collateralization: bigint;
  liquidationLimit: bigint;
  ticker: string;
}

interface GlobalPosition {
  borrowBalanceUSD: bigint;
  capacityUSD: bigint;
  collateralizationUSD: bigint;
  liquidationLimitUSD: bigint;
  usdDenomination: bigint;
  tokenPositions: {
    [token: string]: TokenPosition;
  };
}

interface WrapTokenPositionsRes {
  [token: string]: TokenPositionCache;
}

export function wrapTokenPositions(
  globalPosition: GlobalPosition,
): WrapTokenPositionsRes {
  const result: WrapTokenPositionsRes = {};

  for (const [ticker, position] of Object.entries(
    globalPosition.tokenPositions,
  )) {
    const denomination = getBaseDenomination(ticker.toUpperCase());
    result[ticker] = {
      borrowBalance: wrapQuantity(
        new Quantity(position.borrowBalance, denomination),
      ),
      capacity: wrapQuantity(new Quantity(position.capacity, denomination)),
      collateralization: wrapQuantity(
        new Quantity(position.collateralization, denomination),
      ),
      liquidationLimit: wrapQuantity(
        new Quantity(position.liquidationLimit, denomination),
      ),
      ticker,
    };
  }

  return result;
}

interface UnWrapTokenPositionsRes {
  [token: string]: TokenPositionResult;
}

export function unWrapTokenPositions(
  globalPosition: GlobalPositionCache,
): UnWrapTokenPositionsRes {
  const result: UnWrapTokenPositionsRes = {};

  for (const [ticker, position] of Object.entries(
    globalPosition.tokenPositions,
  )) {
    result[ticker] = {
      borrowBalance: unWrapQuantity(position.borrowBalance),
      capacity: unWrapQuantity(position.capacity),
      collateralization: unWrapQuantity(position.collateralization),
      liquidationLimit: unWrapQuantity(position.liquidationLimit),
      ticker,
    };
  }
  return result;
}
