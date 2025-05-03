import { TokenDetails, tokenMap } from "../tokens";

export interface LeverageStrategy {
  type: "Long" | "Short";
  leverageToken: TokenDetails;
  borrowToken: TokenDetails;
}

export const leverageStrategies: LeverageStrategy[] = [
  {
    type: "Long",
    leverageToken: tokenMap["qAR"],
    borrowToken: tokenMap["wUSDC"],
  },
  {
    type: "Short",
    leverageToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
  },
];

export async function leverageAdapter() {
  return leverageStrategies;
}
