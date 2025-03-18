import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "LiquidOps | Liquidations",
  description:
    "Monitor active liquidation events and opportunities on LiquidOps built on Arweave's L2 AO.",
  alternates: {
    canonical: "https://liquidops.io/liquidations",
  },
  openGraph: {
    title: "LiquidOps | Liquidations",
    description:
      "Monitor active liquidation events and opportunities on LiquidOps built on Arweave's L2 AO.",
    url: "https://liquidops.io/liquidations",
  },
};

// Dynamically import with SSR disabled, fix window error
const Liquidations = dynamic(() => import("./liquidations"), {
  ssr: false,
});

const Page = () => {
  return <Liquidations />;
};

export default Page;
