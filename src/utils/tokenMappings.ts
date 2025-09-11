export const defiLlamaIds: Record<string, string> = {
  wUSDC: "55e444cd-dae7-4ad6-8a3b-1ca4d1d44bae",
  wAR: "bef2d41d-25c7-4d93-8fa9-4170416dbdc9",
};

export const tickerToGeckoMap: Record<string, string> = {
  // listed on LiquidOps
  WUSDC: "usd-coin",
  WAR: "arweave",
  WUSDT: "tether",
  WETH: "ethereum",
  USDA: "usd-coin",
  VAR: "arweave",
  VUSDC: "usd-coin",
  VDAI: "dai",
  VETH: "ethereum",
  // other data
  AR: "arweave",
  AO: "ao-computer",
  DAI: "dai",
  STETH: "staked-ether",
};

export const SUPPORTED_TOKENS = [
  { ticker: "wAR", name: "Wrapped Arweave", assetDisplayOrder: 1 },
  { ticker: "wUSDC", name: "Wrapped USD Circle", assetDisplayOrder: 2 },
  { ticker: "USDA", name: "Astro USD", assetDisplayOrder: 3 },
  { ticker: "vDAI", name: "Vento DAI", assetDisplayOrder: 4 },
  { ticker: "wUSDT", name: "Wrapped USD Tether", assetDisplayOrder: 5 },
  { ticker: "vETH", name: "Vento Ethereum", assetDisplayOrder: 6 },
  { ticker: "vAR", name: "Vento Arweave", assetDisplayOrder: 7 },
  { ticker: "vUSDC", name: "Vento USD Circle", assetDisplayOrder: 8 },
  { ticker: "wETH", name: "Wrapped Ethereum", assetDisplayOrder: 9 },
];

export const DEPRECATED_TOKENS = ["qAR"];

// Token hex color mapping for visualization
export const TOKEN_COLORS: Record<string, string> = {
  WAR: "#ec406d",
  WUSDC: "#2775ca",
  WUSDT: "#26A17B",
  WETH: "#2d2a28",
  USDA: "#104124",
  VAR: "#232226",
  VUSDC: "#2775ca",
  VDAI: "#f5ac37",
  VETH: "#2d2a28",
};

export const TOKEN_DECIMAL_PLACES: { [key: string]: number } = {
  WAR: 3,
  WUSDC: 2,
  WUSDT: 2,
  WETH: 6,
  USDA: 2,
  VAR: 3,
  VUSDC: 2,
  vDAI: 2,
  VETH: 6,
};
