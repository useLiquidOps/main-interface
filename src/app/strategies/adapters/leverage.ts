import { TokenDetails, tokenMap } from "../tokens";

export interface LeverageStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
}

export const leverageStrategies: LeverageStrategy[] = [
  {
    depositToken: tokenMap["USDC"],
    borrowToken: tokenMap["qAR"],
  },
];

export async function leverageAdapter() {
  console.log(leverageStrategies);
}
