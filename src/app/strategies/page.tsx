import { siteWideSEO } from "@/utils/SEO/SEO";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const title = `LiquidOps | Strategies`;
const url = `https://liquidops.io/strategies`;
const imagePath = "https://liquidops.io/SEO/strategies.png";

export const metadata: Metadata = {
  title,
  description: siteWideSEO.strategiesDescription,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description: siteWideSEO.strategiesDescription,
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
  twitter: {
    card: "summary_large_image",
    title,
    description: siteWideSEO.strategiesDescription,
    images: [imagePath],
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
