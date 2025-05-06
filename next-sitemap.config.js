const SUPPORTED_TOKENS = [
  { ticker: "qAR" },
  { ticker: "wUSDC" },
  { ticker: "wAR" },
  { ticker: "wUSDT" },
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
        loc: "/strategies",
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "https://liquidops.arweave.net",
        changefreq: "daily",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
    ];
    // Generate paths for all supported tokens
    const tokenPaths = SUPPORTED_TOKENS.map((token) => ({
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
