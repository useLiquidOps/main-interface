import { TokenDetails, tokenMap } from "../../tokens";

export interface BotegaStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
}

export const botegaStrategies: BotegaStrategy[] = [
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
  },
];

export async function botegaAdapter() {
  console.log(botegaStrategies);
}
