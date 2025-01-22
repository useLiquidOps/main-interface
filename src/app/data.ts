import { Quantity } from "ao-tokens";

export const AssetDisplayData = [
  {
    icon: "/tokens/qAR.svg",
    oIcon: "/tokens/oQAR.svg",
    name: "Quantum Arweave",
    symbol: "qAR",
    extraAmount: "1",
  },
  {
    icon: "/tokens/USDC.svg",
    oIcon: "/tokens/oUSDC.svg",
    name: "USD Circle",
    symbol: "USDC",
    extraAmount: "1",
  },
  {
    icon: "/tokens/stETH.svg",
    oIcon: "/tokens/oSTETH.svg",
    name: "Staked Ethereum",
    symbol: "stETH",
    extraAmount: "1",
  },
];

interface TokenData {
  name: string;
  ticker: string;
}

export const headerTokensData: TokenData[] = [
  {
    name: "Quantum Arweave",
    ticker: "qAR",
  },
  {
    name: "USD Circle",
    ticker: "USDC",
  },
  {
    name: "Staked Ethereum",
    ticker: "stETH",
  },
];

interface Token {
  symbol: string;
  imagePath: string;
}

export const tokens: Token[] = [
  { symbol: "USDC", imagePath: "/tokens/USDC.svg" },
  { symbol: "stETH", imagePath: "/tokens/stETH.svg" },
  { symbol: "qAR", imagePath: "/tokens/qAR.svg" },
];
export const liquidationsData = [
  {
    fromToken: {
      name: "Staked Ethereum",
      symbol: "stETH",
      icon: "/tokens/stETH.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(1850.93),
    },
    toToken: {
      name: "USDC Circle",
      symbol: "USDC",
      icon: "/tokens/USDC.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(1),
    },
    offMarketPrice: 8,
  },
  {
    fromToken: {
      name: "USD Circle",
      symbol: "USDC",
      icon: "/tokens/USDC.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(1),
    },
    toToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(15.5),
    },
    offMarketPrice: 12,
  },
  {
    fromToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(15.5),
    },
    toToken: {
      name: "Staked Ethereum",
      symbol: "stETH",
      icon: "/tokens/stETH.svg",
      available: new Quantity(0n, 12n).fromNumber(0),
      price: new Quantity(0n, 12n).fromNumber(1850.93),
    },
    offMarketPrice: 10,
  },
];
