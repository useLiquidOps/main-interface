export const defiLlamaIds: Record<string, string> = {
  qAR: "cd2164c7-66f3-455c-a690-e4fc778f8a72",
  wUSDC: "55e444cd-dae7-4ad6-8a3b-1ca4d1d44bae",
  wAR: "bef2d41d-25c7-4d93-8fa9-4170416dbdc9"
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
  { ticker: "wAR", name: "Wrapped Arweave", assetDisplayOrder: 1 },
  { ticker: "wUSDC", name: "Wrapped USD Circle", assetDisplayOrder: 2 },
  { ticker: "wUSDT", name: "Wrapped USD Tether", assetDisplayOrder: 3 },
  { ticker: "wETH", name: "Wrapped Ethereum", assetDisplayOrder: 4 },
  { ticker: "qAR", name: "Quantum Arweave", assetDisplayOrder: 5 },
];

export const DEPRECATED_TOKENS = [
  'qAR'
]

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
  QAR: 3,
  WAR: 3,
  WUSDC: 2,
  WUSDT: 2,
  WETH: 6,
};
