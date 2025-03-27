/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://liquidops.io",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/"],
  additionalPaths: async (config) => {
    return [
      {
        loc: "/qAR",
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/wUSDC",
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/markets",
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/liquidations",
        changefreq: "daily",
        priority: 0.8,
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
