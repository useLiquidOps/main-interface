export const AssetDisplayData = [
  {
    icon: "/tokens/qAR.svg",
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
    name: "Staked Ethereum",
    amount: "13,579.24",
    symbol: "stETH",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
    extraAmount: "1",
  },
  {
    icon: "/tokens/qAR.svg",
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
    name: "Staked Ethereum",
    amount: "13,579.24",
    symbol: "stETH",
    apr: "4.57",
    change: "0.02",
    isPositive: true,
    extraAmount: "1",
  },
];

export const marketData = [
  {
    icon: "/tokens/dai.svg",
    name: "Dai",
    symbol: "DAI",
    apy: "4.57",
    utilization: "56.19",
    utilization2: "56.19",
    available: "15.8M",
    availableCurrency: "USD",
    lent: "16.3M",
    lentCurrency: "USD",
  },
  {
    icon: "/tokens/qAR.svg",
    name: "Qauntum Arweave",
    symbol: "qAR",
    apy: "4.57",
    utilization: "56.19",
    utilization2: "56.19",
    available: "15.8M",
    availableCurrency: "USD",
    lent: "16.3M",
    lentCurrency: "USD",
  },
  {
    icon: "/tokens/stETH.svg",
    name: "Staked ETH",
    symbol: "stETH",
    apy: "4.57",
    utilization: "56.19",
    utilization2: "56.19",
    available: "15.8M",
    availableCurrency: "USD",
    lent: "16.3M",
    lentCurrency: "USD",
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
