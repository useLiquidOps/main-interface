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

interface DataPoint {
  date: string;
  value: number;
}

export const graphDummyData: DataPoint[] = [
  { date: "2023-10-01", value: 4 },
  { date: "2023-10-02", value: 3.9 },
  { date: "2023-10-02", value: 3.9 },
  { date: "2023-10-02", value: 3.8 },
  { date: "2023-10-03", value: 3 },
  { date: "2023-10-04", value: 2.0 },
  { date: "2023-10-05", value: 2.5 },
  { date: "2023-10-05", value: 2.5 },
  { date: "2023-10-06", value: 3.0 },
  { date: "2023-10-07", value: 3.5 },
  { date: "2023-10-07", value: 3.5 },
  { date: "2023-10-08", value: 4.2 },
  { date: "2023-10-09", value: 3.8 },
  { date: "2023-10-10", value: 4.2 },
  { date: "2023-10-11", value: 4.0 },
  { date: "2023-10-12", value: 3.5 },
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
      available: 125.45,
      price: 1850.93,
    },
    toToken: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      icon: "/tokens/DAI.svg",
      available: 1250.32,
      price: 1.0,
    },
    offMarketPrice: 8,
  },
  {
    fromToken: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      icon: "/tokens/DAI.svg",
      available: 45000,
      price: 1.0,
    },
    toToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: 45.23,
      price: 15.5,
    },
    offMarketPrice: 12,
  },
  {
    fromToken: {
      name: "Quantum Arweave",
      symbol: "qAR",
      icon: "/tokens/qAR.svg",
      available: 1000000,
      price: 15.5,
    },
    toToken: {
      name: "Staked Ethereum",
      symbol: "stETH",
      icon: "/tokens/stETH.svg",
      available: 0.892,
      price: 1850.93,
    },
    offMarketPrice: 10,
  },
];
