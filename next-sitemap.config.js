const SUPPORTED_TOKENS = [
  { ticker: "qAR", name: "Quantum Arweave" },
  { ticker: "wUSDC", name: "Wrapped USD Circle" },
  { ticker: "wAR", name: "Wrapped Arweave" },
  { ticker: "wUSDT", name: "Wrapped USD Tether" },
  { ticker: "wETH", name: "Wrapped Ethereum" },
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://liquidops.io",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 1,
  sitemapSize: 5000,
  exclude: ["/"],
  additionalPaths: async (config) => {
    const basePaths = [
      {
        loc: "/markets",
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "https://labs.liquidops.io",
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "https://docs.liquidops.io",
        changefreq: "daily",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/strategies",
        changefreq: "daily",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
      // the tickers are 0.5
      {
        loc: "https://liquidops.arweave.net",
        changefreq: "daily",
        priority: 0.4,
        lastmod: new Date().toISOString(),
      },
    ];
    // Generate paths for all supported tokens
    const tokenPaths = SUPPORTED_TOKENS.map((token) => ({
      loc: `/${token.ticker}`,
      changefreq: "daily",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    }));

    // Combine both arrays and return
    return [...basePaths, ...tokenPaths];
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
