import { TokenDetails, tokenMap } from "../tokens";

export interface FairLaunchStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
  apy: number;
  depositRewardRatio: number;
}

export const fairLaunchStrategies: FairLaunchStrategy[] = [
  // wUSDC
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
    apy: 4.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["APUS"],
    apy: 3.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["BOTG"],
    apy: 3.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ACTION"],
    apy: 3.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PL"],
    apy: 3.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ARIO"],
    apy: 3.1,
    depositRewardRatio: 1,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PIXL"],
    apy: -3.1,
    depositRewardRatio: 1,
  },
    // wUSDT
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["AO"],
      apy: 4.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["APUS"],
      apy: 3.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["BOTG"],
      apy: 3.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["ACTION"],
      apy: 3.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["PL"],
      apy: 3.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["ARIO"],
      apy: 3.1,
      depositRewardRatio: 1,
    },
    {
      depositToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["qAR"],
      rewardToken: tokenMap["PIXL"],
      apy: -3.1,
      depositRewardRatio: 1,
    },
];

export async function fairLaunchAdapter(): Promise<FairLaunchStrategy[]> {
  // Sort the strategies by APY in descending order
  return [...fairLaunchStrategies].sort((a, b) => b.apy - a.apy);
}
