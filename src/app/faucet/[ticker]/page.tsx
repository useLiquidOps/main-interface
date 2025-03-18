import Faucet from "./faucet";
import { Metadata } from "next";

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

const Page = ({ params }: any) => {
  const { ticker, tab } = params;

  return <Faucet params={{ ticker, tab }} />;
};

export default Page;
