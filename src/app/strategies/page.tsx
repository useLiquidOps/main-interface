import { Metadata } from "next";
import dynamic from "next/dynamic";
import { metadata as data } from "@/utils/SEO/SEO";

const title = "LiquidOps | Strategies";
const url = `https://liquidops.io/strategies`;
const imagePath = "https://liquidops.io/SEO/strategies.png";
const description = `
Supercharge your crypto with LiquidOps' advanced strategies—unlock yield farming, arbitrage opportunities, and leverage positions using your Arweave and AO tokens.

All secured by our over-collateralized lending protocol built natively on Arweave's L2.
`;

export const metadata: Metadata = {
  ...data,
  title: {
    absolute: title,
  },
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
};

// Dynamically import with SSR disabled, fix window error
const Strategies = dynamic(() => import("./strategies"), {
  ssr: false,
});

const Page = () => {
  return <Strategies />;
};

export default Page;
