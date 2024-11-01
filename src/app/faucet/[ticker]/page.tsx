import Faucet from "./faucet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiquidOps | Faucet",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

const Page = ({ params }: any) => {
  const { ticker, tab } = params;

  return <Faucet params={{ ticker, tab }} />;
};

export default Page;
