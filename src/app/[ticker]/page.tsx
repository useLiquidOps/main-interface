import { Metadata } from "next";
import dynamic from "next/dynamic";
import { SUPPORTED_TOKENS } from "@/utils/tokenMappings";
import { tickerDescription, metadata as data } from "@/utils/SEO/SEO";

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

  const description = tickerDescription(tokenInfo?.name || "", ticker);

  return {
    ...data,
    title: {
      absolute: title(ticker),
    },
    description,
    alternates: {
      canonical: url(ticker),
    },
    openGraph: {
      title: title(ticker),
      description,
      url: url(ticker),
      images: [
        {
          url: imagePath(ticker),
          width: 1200,
          height: 630,
          alt: title(ticker),
        },
      ],
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
