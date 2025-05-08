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
  // fair launches
  AO: "ao-computer",
  ARIO: "ar-io-network",
};

export const SUPPORTED_TOKENS = [
  { ticker: "qAR", name: "Quantum Arweave" },
  { ticker: "wUSDC", name: "Wrapped USD Circle" },
  { ticker: "wAR", name: "Wrapped Arweave" },
  { ticker: "wUSDT", name: "Wrapped USD Circle" },
];

// NOTE: there is also a SUPPORTED_TOKENS in next-sitemap-config.js

export const gekoURL =
  "https://api.coingecko.com/api/v3/simple/price?ids=arweave,usd-coin,tether,&vs_currencies=usd";

// Token hex color mapping for visualization
export const TOKEN_COLORS: Record<string, string> = {
  WAR: "#ec406d",
  WUSDC: "#2775ca",
  QAR: "#5f80fe",
  WUSDT: "#26A17B",
};
