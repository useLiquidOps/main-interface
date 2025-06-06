import { TokenDetails, tokenMap } from "../../tokens";

export interface DexiStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
}

export const dexiStrategies: DexiStrategy[] = [
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["AO"],
  },
];

export async function dexiAdapter() {
  console.log(dexiStrategies);
}
