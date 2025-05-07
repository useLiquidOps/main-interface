import { Metadata } from "next";
import dynamic from "next/dynamic";
import { SUPPORTED_TOKENS } from "@/utils/tokenMappings";
import { tickerDescription } from "@/utils/SEO/SEO";

const title = (ticker: string) => `LiquidOps | ${ticker}`;
const url = (ticker: string) => `https://liquidops.io/${ticker}`;
const imagePath = (ticker: string) =>
  `https://liquidops.io/SEO/token-site-images/${ticker.toUpperCase()}.png`;

// need to export static ticker page paths for permaweb-deploy
export async function generateStaticParams() {
  return SUPPORTED_TOKENS;
}

export async function generateMetadata({
  params,
}: {
  params: { ticker: string };
}): Promise<Metadata> {
  const ticker = params.ticker;

  const tokenInfo = SUPPORTED_TOKENS.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  return {
    title: title(ticker),
    description: tickerDescription(tokenInfo?.name || "", ticker),
    alternates: {
      canonical: url(ticker),
    },
    openGraph: {
      title: title(ticker),
      description: tickerDescription(tokenInfo?.name || "", ticker),
      url: url(ticker),
    },
    twitter: {
      card: "summary_large_image",
      title: title(ticker),
      description: tickerDescription(tokenInfo?.name || "", ticker),
      images: [imagePath(ticker)],
    },
  };
}

// Dynamically import with SSR disabled, fix window error
const Ticker = dynamic(() => import("./ticker"), {
  ssr: false,
});

const Page = ({ params }: any) => {
  const { ticker, tab } = params;

  return <Ticker params={{ ticker, tab }} />;
};

export default Page;
