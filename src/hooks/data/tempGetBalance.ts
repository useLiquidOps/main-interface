// utils/tokenOperations.ts
import { Token } from "ao-tokens";
import { TokenInput, tokenInput } from "liquidops";

export interface GetBalance {
  token: TokenInput | string;
  walletAddress: string;
}

export const tokenOperations = {
  async getBalance({ token, walletAddress }: GetBalance): Promise<BigInt> {
    if (!token || !walletAddress) {
      throw new Error("Please specify a token and walletAddress.");
    }

    try {
      const { tokenAddress } = tokenInput(token);
      const tokenInstance = await Token(tokenAddress);
      const balance = await tokenInstance.getBalance(walletAddress);
      return balance.raw;
    } catch (error) {
      throw new Error("Error fetching balance: " + error);
    }
  },
};
