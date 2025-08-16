import { keyWords } from "./keywords";
import { Metadata } from "next";

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

const imagePath = "https://liquidops.io/SEO/home.png";

// global SEO vars
export const SEO = {
  name: "LiquidOps - Lending and borrowing on Arweave and AO.",
  url: "https://liquidops.io",
  description: siteWideDescription,
  keyWords,
  icons: [
    { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    { url: "/favicon.svg", type: "image/svg+xml" },
  ],
  sameAs: [
    // social media
    "https://x.com/Liquid_Ops",
    "https://www.linkedin.com/company/liquid-ops",
    "https://www.instagram.com/useliquidops",
    "https://www.tiktok.com/@liquidops",
    "https://www.reddit.com/r/LiquidOps/",
    "https://www.youtube.com/@Liquid_Ops",
    "https://github.com/useLiquidOps",

    // press
    "https://venturebeat.com/business/unlocking-the-future-of-decentralized-finance-lorimer-jenkins-journey-in-building-defi-and-web3/",
    "https://www.ibtimes.co.uk/revolutionizing-defi-how-lorimer-jenkins-marton-lederer-are-transforming-arweave-liquidops-1729945",

    // random
    "https://defillama.com/protocol/liquidops",
    "https://iq.wiki/wiki/liquidops",
    "https://theorg.com/org/liquidops",
    "https://www.crunchbase.com/organization/liquidops",
    "https://www.rootdata.com/Projects/detail/LiquidOps?k=MjA0NTM%3D",
    "https://dappradar.com/dapp/liquidops",
  ],
  author: "LiquidOps",
  category: "Technology",
  classification: "Tech, Web3, DeFi",
  locale: "en_US",
};

export const metadata: Metadata = {
  title: {
    default: SEO.name,
    template: SEO.name,
  },
  description: SEO.description,
  keywords: SEO.keyWords,
  authors: [{ name: SEO.author, url: SEO.url }],
  creator: SEO.author,
  publisher: SEO.author,
  category: SEO.category,
  classification: SEO.classification,
  icons: SEO.icons,

  openGraph: {
    title: SEO.name,
    description: SEO.description,
    url: SEO.url,
    siteName: SEO.name,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: `${SEO.name}`,
      },
    ],
    locale: SEO.locale,
    type: "website",
    countryName: "United Kingdom",
    alternateLocale: ["en_GB"],
  },

  twitter: {
    card: "summary_large_image",
    title: SEO.name,
    description: SEO.description,
    images: [imagePath],
    creator: "@Liquid_Ops",
    site: "@Liquid_Ops",
  },

  alternates: {
    canonical: SEO.url,
    languages: {
      "en-US": SEO.url,
      "en-GB": SEO.url,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "script:ld+json": JSON.stringify({
      "@type": ["FinancialProduct", "SoftwareApplication"],
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        description: "Decentralized lending and borrowing",
      },
      "@context": "https://schema.org",
      name: SEO.name,
      description: SEO.description,
      url: SEO.url,
      provider: {
        "@type": "Organization",
        name: SEO.name,
        url: SEO.url,
      },
      sameAs: SEO.sameAs,
    }),
  },
};
