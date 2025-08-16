import { Metadata } from "next";
import dynamic from "next/dynamic";
import { metadata as data } from "@/utils/SEO/SEO";

const title = "LiquidOps | Earn";
const url = `https://liquidops.io/earn`;
const imagePath = "https://liquidops.io/SEO/earn.png";
const description = `
Looking for the best place to earn with vaults? Browse all our vaults in one place and see exactly what yields you can earn today. 

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
const Earn = dynamic(() => import("./earn"), {
  ssr: false,
});

const Page = () => {
  return <Earn />;
};

export default Page;
