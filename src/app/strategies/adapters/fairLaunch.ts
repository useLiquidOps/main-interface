import { TokenDetails, tokenMap } from "../tokens";

export interface FairLaunchStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
  apy: number;
  available: number;
}

export const fairLaunchStrategies: FairLaunchStrategy[] = [
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["APUS"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["BOTG"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ACTION"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PL"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ARIO"],
    apy: 3.1,
    available: 3000,
  },
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PIXL"],
    apy: 3.1,
    available: 3000,
  },
];

export async function fairLaunchAdapter(): Promise<FairLaunchStrategy[]> {
  return fairLaunchStrategies;
}
