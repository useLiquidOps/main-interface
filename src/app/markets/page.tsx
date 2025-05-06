import { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteWideSEO } from "@/utils/SEO/SEO";

const title = "LiquidOps | Markets";
const url = "https://liquidops.io/markets";
const imagePath = "https://liquidops.io/SEO/markets.png";

export const metadata: Metadata = {
  title,
  description: siteWideSEO.marketDescription,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description: siteWideSEO.marketDescription,
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
    description: siteWideSEO.marketDescription,
    images: [imagePath],
  },
};

// Dynamically import with SSR disabled, fix window error
const Markets = dynamic(() => import("./markets"), {
  ssr: false,
});

const Page = () => {
  return <Markets />;
};

export default Page;
