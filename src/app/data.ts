import { Quantity } from "ao-tokens";

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
    offMarketPrice: 0,
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
    offMarketPrice: 0,
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
    offMarketPrice: 0,
  },
];
