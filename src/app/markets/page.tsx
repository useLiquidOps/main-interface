import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "LiquidOps | Markets",
  description:
    "Explore all available lending and borrowing markets on LiquidOps with real-time rates and liquidity information.",
  alternates: {
    canonical: "https://liquidops.io/markets",
  },
  openGraph: {
    title: "LiquidOps | Markets",
    description:
      "Explore all available lending and borrowing markets on LiquidOps with real-time rates and liquidity information.",
    url: "https://liquidops.io/markets",
  },
};

// Dynamically import with SSR disabled, fix window error
const Markets = dynamic(() => import("./markets"), {
  ssr: false,
});

const Page = () => {
  return <Markets />;
};

export default Page;
