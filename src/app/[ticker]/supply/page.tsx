import { Metadata } from "next";
import Supply from "./Supply";

export const metadata: Metadata = {
  title: "LiquidOps | Supply",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

const Page = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;

  return <Supply ticker={ticker} />;
};

export default Page;
