import { TokenDetails, tokenMap } from "../../tokens";

export interface LeverageStrategy {
  type: "Long" | "Short";
  baseToken: TokenDetails;
  leverageToken: TokenDetails;
  borrowToken: TokenDetails;
}

export const leverageStrategies: LeverageStrategy[] = [
  // qAR
  {
    type: "Long",
    baseToken: tokenMap["qAR"],
    leverageToken: tokenMap["qAR"],
    borrowToken: tokenMap["wUSDC"],
  },
  {
    type: "Long",
    baseToken: tokenMap["qAR"],
    leverageToken: tokenMap["qAR"],
    borrowToken: tokenMap["wUSDT"],
  },
  {
    type: "Short",
    baseToken: tokenMap["qAR"],
    leverageToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
  },
  {
    type: "Short",
    baseToken: tokenMap["qAR"],
    leverageToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
  },
  // wAR
  {
    type: "Long",
    baseToken: tokenMap["wAR"],
    leverageToken: tokenMap["wAR"],
    borrowToken: tokenMap["wUSDC"],
  },
  {
    type: "Long",
    baseToken: tokenMap["wAR"],
    leverageToken: tokenMap["wAR"],
    borrowToken: tokenMap["wUSDT"],
  },
  {
    type: "Short",
    baseToken: tokenMap["wAR"],
    leverageToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
  },
  {
    type: "Short",
    baseToken: tokenMap["wAR"],
    leverageToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
  },
];

export async function leverageAdapter() {
  return leverageStrategies;
}
