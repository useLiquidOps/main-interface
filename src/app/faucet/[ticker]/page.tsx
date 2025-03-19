import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "LiquidOps | Faucet",
  description:
    "Claim testnet tokens on LiquidOps' testnet, built on Arweave's L2 AO.",
  alternates: {
    canonical: "https://liquidops.io/faucet",
  },
  openGraph: {
    title: "LiquidOps | Faucet",
    description:
      "Claim testnet tokens on LiquidOps' testnet, built on Arweave's L2 AO.",
    url: "https://liquidops.io/faucet",
  },
};

// Dynamically import with SSR disabled, fix window error
const Faucet = dynamic(() => import("./faucet"), {
  ssr: false,
});

const Page = ({ params }: any) => {
  const { ticker, tab } = params;

  return <Faucet params={{ ticker, tab }} />;
};

export default Page;
