import { keyWords } from "./keywords";

// SEO content
const siteWideDescription = `
LiquidOps delivers trustless, permissionless financial infrastructure on Arweave's L2 AO, where lenders earn competitive, sustainable yields.

While borrowers access capital-efficient liquidity—all secured by over-collateralization and the permanent, immutable record of the permaweb.
`;
export const tickerDescription = (name: string, ticker: string) =>
  `
Unleash the potential of ${name} $${ticker} tokens through LiquidOps' secure lending and borrowing ecosystem. 

Earn premium yields and access strategic leverage on the only over-collateralized lending protocol built natively on Arweave's hyper-parallel L2 AO network.
`;
const marketDescription = `
Looking for the best place to lend or borrow? Browse all our markets in one place and see exactly what yields you can earn today. 

LiquidOps gives you the complete picture with real-time rates, backed by the security of over-collateralization on Arweave's L2 AO.
`;
const strategiesDescription = `
Supercharge your crypto with LiquidOps' advanced strategies—unlock yield farming, arbitrage opportunities, and leverage positions using your Arweave and AO tokens.

All secured by our over-collateralized lending protocol built natively on Arweave's L2.
`;
const notfoundDescription = siteWideDescription;

// global SEO vars
export const siteWideSEO = {
  name: "LiquidOps",
  url: "https://liquidops.io",
  description: siteWideDescription,
  marketDescription,
  strategiesDescription,
  notfoundDescription,
  keyWords,
  icons: [
    { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    { url: "/favicon.svg", type: "image/svg+xml" },
  ],
};
