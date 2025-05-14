export const defiLlamaIds: Record<string, string> = {
  qAR: "cd2164c7-66f3-455c-a690-e4fc778f8a72",
  wUSDC: "55e444cd-dae7-4ad6-8a3b-1ca4d1d44bae",
};

export const tickerToGeckoMap: Record<string, string> = {
  // listed on LiquidOps
  QAR: "arweave",
  WUSDC: "usd-coin",
  WAR: "arweave",
  WUSDT: "tether",
  WETH: "ethereum",
  // other data
  AR: "arweave",
  AO: "ao-computer",
  DAI: "dai",
  STETH: "staked-ether",
};

export const SUPPORTED_TOKENS = [
  { ticker: "qAR", name: "Quantum Arweave" },
  { ticker: "wUSDC", name: "Wrapped USD Circle" },
  { ticker: "wAR", name: "Wrapped Arweave" },
  { ticker: "wUSDT", name: "Wrapped USD Tether" },
  { ticker: "wETH", name: "Wrapped Ethereum" },
];

// NOTE: there is also a SUPPORTED_TOKENS in next-sitemap-config.js

// Token hex color mapping for visualization
export const TOKEN_COLORS: Record<string, string> = {
  WAR: "#ec406d",
  WUSDC: "#2775ca",
  QAR: "#5f80fe",
  WUSDT: "#26A17B",
  WETH: "#2d2a28",
};

// NOTE: we need to update the permaweb-deploy file after every new page

export const TOKEN_DECIMAL_PLACES: { [key: string]: number } = {
  qAR: 3,
  wAR: 3,
  wUSDC: 2,
  wUSDT: 2,
  wETH: 6,
};
