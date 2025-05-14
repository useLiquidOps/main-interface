import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { FairLaunchStrategy } from "../getFairlaunchAPY";
import { Prices } from "@/hooks/data/useTokenPrice";
import { AOPerAR } from "../getFairlaunchAPY";

interface GetMaxReward {
  depositTokenStats: any;
  strategy: FairLaunchStrategy;
  rewardTokenPrice: number | undefined;
  arTokenPrice: number;
  fairLaunchPerAO: number;
  arTokenStats: any;
}

export function getMaxReward({
  depositTokenStats,
  strategy,
  rewardTokenPrice,
  arTokenPrice,
  fairLaunchPerAO,
  arTokenStats,
}: GetMaxReward) {
  if (!depositTokenStats?.data || !arTokenStats?.data) {
    return {
      maxAPY: 0,
      type: "apy" as const,
      tokenRewardsPerOneHundredUSD: 0,
    };
  }
  // APY base, deposit the USDC/USDT tokens
  const baseAPY = depositTokenStats.data.supplyAPR;

  const maxBorrowPercent =
    Number(depositTokenStats.data.info.collateralFactor) / 100;

  // APY reward, find the reward for borrowing ar then earning AO or fair launch tokens

  // check if reward has a usd value or is a token reward only

  // check if it is a fair launch reward or AO reward
  // find arweave usd price

  const oneARUSD = arTokenPrice;

  const oneHundredDollarsWorthOfARInTokens = 100 / oneARUSD;

  let fairLaunchTokenRewardsPerAR;
  if (strategy.rewardToken.ticker === "AO") {
    fairLaunchTokenRewardsPerAR = AOPerAR;
  } else {
    fairLaunchTokenRewardsPerAR = fairLaunchPerAO * AOPerAR;
  }

  let fairLaunchRewards: { type: "token" | "apy"; reward: number };
  // fair launch with a price
  if (rewardTokenPrice !== undefined) {
    // find fair launch apy

    const fairLaunchUSDRewardsPerAR =
      fairLaunchTokenRewardsPerAR * rewardTokenPrice;

    const fairLaunchAPY = (fairLaunchUSDRewardsPerAR / oneARUSD) * 100;
    const fairLaunchAPYMinusCollateralFactor = fairLaunchAPY * maxBorrowPercent;

    fairLaunchRewards = {
      type: "apy",
      reward: fairLaunchAPYMinusCollateralFactor,
    };

    // fair launch with token amount
  } else {
    fairLaunchRewards = { type: "token", reward: fairLaunchPerAO };
  }

  // find borrow APR

  const totalBorrowArAPR = arTokenStats.data.borrowAPR * maxBorrowPercent;

  // final APY

  let maxAPY;
  if (fairLaunchRewards.type === "token") {
    maxAPY = fairLaunchRewards.reward;
  } else {
    const totalAPY = baseAPY + fairLaunchRewards.reward;
    maxAPY = totalAPY - totalBorrowArAPR;
  }

  const tokenRewardsPerOneHundredUSD =
    oneHundredDollarsWorthOfARInTokens * fairLaunchTokenRewardsPerAR;

  return { maxAPY, type: fairLaunchRewards.type, tokenRewardsPerOneHundredUSD };
}
