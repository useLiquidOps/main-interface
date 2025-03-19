import { Metadata } from "next";
import dynamic from "next/dynamic";

export async function generateMetadata({
  params,
}: {
  params: { ticker: string };
}): Promise<Metadata> {
  const ticker = params.ticker;

  return {
    title: `LiquidOps | ${ticker}`,
    description: `Lend and borrow ${ticker} tokens with competitive rates on LiquidOps, an over-collateralized protocol on Arweave's L2 AO.`,
    alternates: {
      canonical: `https://liquidops.io/${ticker}`,
    },
    openGraph: {
      title: `LiquidOps | ${ticker}`,
      description: `Lend and borrow ${ticker} tokens with competitive rates on LiquidOps, an over-collateralized protocol on Arweave's L2 AO.`,
      url: `https://liquidops.io/${ticker}`,
    },
  };
}

// Dynamically import with SSR disabled, fix window error
const Home = dynamic(() => import("./home"), {
  ssr: false,
});

const Page = ({ params }: any) => {
  const { ticker, tab } = params;

  return <Home params={{ ticker, tab }} />;
};

export default Page;
