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
        loc: "/earn",
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/markets",
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      // the tickers are 0.7
    ];
    const TOKENS_TO_SHOW_ON_GOOGLE = [
      { ticker: "USDA", name: "Astro USD" },
      { ticker: "wAR", name: "Wrapped Arweave" },
      { ticker: "wUSDC", name: "Wrapped USD Circle" },
      { ticker: "wUSDT", name: "Wrapped USD Tether" },
      { ticker: "wETH", name: "Wrapped Ethereum" },
      { ticker: "vAR", name: "Vento Arweave" },
      { ticker: "vUSDC", name: "Vento USD Circle" },
    ];

    // Generate paths for all supported tokens
    const tokenPaths = TOKENS_TO_SHOW_ON_GOOGLE.map((token) => ({
      loc: `/${token.ticker}`,
      changefreq: "daily",
      priority: 0.7,
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
