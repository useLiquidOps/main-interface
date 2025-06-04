"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { MarketStats } from "./MarketStats/MarketStats";
import { MarketRow } from "./MarketRow/MarketRow";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import { SUPPORTED_TOKENS } from "@/utils/tokenMappings";

interface Token {
  ticker: string;
  name: string;
  icon: string;
}

const Markets: React.FC = () => {
  const { data: supportedTokens = [] } = useSupportedTokens();
  const { data: prices } = usePrices();

  // Sort tokens based on the assetDisplayOrder defined in SUPPORTED_TOKENS
  const sortedTokens = [...supportedTokens].sort((a, b) => {
    const tokenA = SUPPORTED_TOKENS.find((token) => token.ticker.toUpperCase() === a.ticker.toUpperCase() );
    const tokenB = SUPPORTED_TOKENS.find((token) => token.ticker.toUpperCase()  === b.ticker.toUpperCase() );

    // Default order for tokens not found in SUPPORTED_TOKENS
    const orderA = tokenA?.assetDisplayOrder || 999;
    const orderB = tokenB?.assetDisplayOrder || 999;

    return orderA - orderB;
  });

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <MarketStats tokens={sortedTokens as Token[]} prices={prices} />
          <div className={styles.marketsList}>
            {(sortedTokens as Token[]).map((token) => (
              <MarketRow key={token.ticker} token={token} prices={prices} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Markets;
