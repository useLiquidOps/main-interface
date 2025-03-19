import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "LiquidOps | Borrow",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

// Dynamically import with SSR disabled, fix window error
const Borrow = dynamic(() => import("./Borrow"), {
  ssr: false,
});

const Page = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;

  return <Borrow ticker={ticker} />;
};

export default Page;
