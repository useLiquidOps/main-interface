import { Metadata } from "next";
import dynamic from "next/dynamic";
import { metadata as data } from "@/utils/SEO/SEO";

const title = "LiquidOps | Markets";
const url = `https://liquidops.io/markets`;
const imagePath = "https://liquidops.io/SEO/markets.png";
const description = `
Looking for the best place to lend or borrow? Browse all our markets in one place and see exactly what yields you can earn today. 

LiquidOps gives you the complete picture with real-time rates, backed by the security of over-collateralization on Arweave's L2 AO.
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
const Markets = dynamic(() => import("./markets"), {
  ssr: false,
});

const Page = () => {
  return <Markets />;
};

export default Page;
