import { Quantity } from "ao-tokens";

export const AssetDisplayData = [
  {
    icon: "/tokens/qAR.svg",
    oIcon: "/tokens/oQAR.svg",
    name: "Quantum Arweave",
    amount: "13,579.24",
    symbol: "qAR",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
    extraAmount: "1",
  },
  {
    icon: "/tokens/DAI.svg",
    oIcon: "/tokens/oDAI.svg",
    name: "Dai",
    amount: "124.5",
    symbol: "DAI",
    apr: "2.03",
    change: "0.17",
    isPositive: false,
    extraAmount: "1",
  },
  {
    icon: "/tokens/stETH.svg",
    oIcon: "/tokens/oSTETH.svg",
    name: "Staked Ethereum",
    amount: "13,579.24",
    symbol: "stETH",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
    extraAmount: "1",
  },
];

interface TokenData {
  name: string;
  ticker: string;
  APR: string;
  percentChange: {
    change: string;
    outcome: boolean;
  };
}

export const headerTokensData: TokenData[] = [
  {
    name: "Quantum Arweave",
    ticker: "qAR",
    APR: "5.2",
    percentChange: {
      change: "1.2",
      outcome: true,
    },
  },
  {
    name: "Dai",
    ticker: "DAI",
    APR: "3.8",
    percentChange: {
      change: "0.2",
      outcome: false,
    },
  },
  {
    name: "Staked Ethereum",
    ticker: "stETH",
    APR: "4.5",
    percentChange: {
      change: "1.2",
      outcome: true,
    },
  },
];

interface Token {
  symbol: string;
  imagePath: string;
}

export const tokens: Token[] = [
  { symbol: "DAI", imagePath: "/tokens/dai.svg" },
  { symbol: "stETH", imagePath: "/tokens/stETH.svg" },
  { symbol: "qAR", imagePath: "/tokens/qAR.svg" },
];
export const liquidationsData = [
  {
    fromToken: {
      name: "Staked Ethereum",
      symbol: "stETH",
      icon: "/tokens/stETH.svg",
      available: new Quantity(0n, 12n).fromNumber(125.45),
      price: new Quantity(0n, 12n).fromNumber(1850.93),
    },
    toToken: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      icon: "/tokens/DAI.svg",
      available: new Quantity(0n, 12n).fromNumber(1250.45),
      price: new Quantity(0n, 12n).fromNumber(1),
    },
    offMarketPrice: 8,
  },
  {
    fromToken: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      icon: "/tokens/DAI.svg",
      available: new Quantity(0n, 12n).fromNumber(45000),
      price: new Quantity(0n, 12n).fromNumber(1),
    },
    toToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: new Quantity(0n, 12n).fromNumber(45.23),
      price: new Quantity(0n, 12n).fromNumber(15.5),
    },
    offMarketPrice: 12,
  },
  {
    fromToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: new Quantity(0n, 12n).fromNumber(1000000),
      price: new Quantity(0n, 12n).fromNumber(15.5),
    },
    toToken: {
      name: "Staked Ethereum",
      symbol: "stETH",
      icon: "/tokens/stETH.svg",
      available: new Quantity(0n, 12n).fromNumber(0.892),
      price: new Quantity(0n, 12n).fromNumber(1850.93),
    },
    offMarketPrice: 10,
  },
];
