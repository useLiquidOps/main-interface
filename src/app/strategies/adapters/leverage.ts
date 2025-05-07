import { TokenDetails, tokenMap } from "../tokens";

export interface LeverageStrategy {
  type: "Long" | "Short";
  leverageToken: TokenDetails;
  borrowToken: TokenDetails;
}

export const leverageStrategies: LeverageStrategy[] = [
  // qAR
  {
    type: "Long",
    leverageToken: tokenMap["qAR"],
    borrowToken: tokenMap["wUSDC"],
  },
  {
    type: "Long",
    leverageToken: tokenMap["qAR"],
    borrowToken: tokenMap["wUSDT"],
  },
  {
    type: "Short",
    leverageToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
  },
  {
    type: "Short",
    leverageToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
  },
    // wAR
    {
      type: "Long",
      leverageToken: tokenMap["wAR"],
      borrowToken: tokenMap["wUSDC"],
    },
    {
      type: "Long",
      leverageToken: tokenMap["wAR"],
      borrowToken: tokenMap["wUSDT"],
    },
    {
      type: "Short",
      leverageToken: tokenMap["wUSDC"],
      borrowToken: tokenMap["wAR"],
    },
    {
      type: "Short",
      leverageToken: tokenMap["wUSDT"],
      borrowToken: tokenMap["wAR"],
    },


];

export async function leverageAdapter() {
  return leverageStrategies;
}
