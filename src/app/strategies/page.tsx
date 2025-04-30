import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: `LiquidOps | Strategies`,
  description: `Earn yield and leverage Arweave and AO tokens with LiquidOps strategies.`,
  alternates: {
    canonical: `https://liquidops.io/strategies`,
  },
  openGraph: {
    title: `LiquidOps | Strategies`,
    description: `Earn yield and leverage Arweave and AO tokens with LiquidOps strategies.`,
    url: `https://liquidops.io/strategies`,
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
