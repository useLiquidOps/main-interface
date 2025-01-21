import Borrow from "./Borrow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiquidOps | Borrow",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

const Page = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;

  return <Borrow ticker={ticker} />;
};

export default Page;
