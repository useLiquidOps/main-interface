/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://liquidops.io",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 1,
  sitemapSize: 5000,
  exclude: ["/"],
  additionalPaths: async (config) => {
    return [
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
        loc: "/qAR",
        changefreq: "daily",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/wUSDC",
        changefreq: "daily",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "https://liquidops.arweave.net",
        changefreq: "daily",
        priority: 0.5,
        lastmod: new Date().toISOString(),
      },
    ];
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
