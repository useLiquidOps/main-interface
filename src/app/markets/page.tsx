import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "LiquidOps | Markets",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

// Dynamically import with SSR disabled, fix window error
const Markets = dynamic(() => import("./markets"), {
  ssr: false,
});

const Page = () => {
  return <Markets />;
};

export default Page;
