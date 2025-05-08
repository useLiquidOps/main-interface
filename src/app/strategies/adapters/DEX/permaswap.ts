import { TokenDetails, tokenMap } from "../../tokens";

export interface PermaswapStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
}

export const permaswapStrategies: PermaswapStrategy[] = [
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
  },
];

export async function permaswapAdapter() {
  console.log(permaswapStrategies);
}
