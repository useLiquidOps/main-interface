"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";
import { usePrices } from "@/hooks/data/useTokenPrice";
import {
  useSupportedTokens,
  SupportedToken,
} from "@/hooks/data/useSupportedTokens";
import { MarketStats } from "./MarketStats/MarketStats";
import { MarketRow } from "./MarketRow/MarketRow";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import { SUPPORTED_TOKENS } from "@/utils/tokenMappings";
import { useDeprecatedTokens } from "@/contexts/DeprecatedTokensContext";
import { DeprecatedTokensProvider } from "@/contexts/DeprecatedTokensContext";
import { useMemo } from "react";

const MarketsContent: React.FC = () => {
  const { data: supportedTokens = [] } = useSupportedTokens();
  const { data: prices } = usePrices();
  const { showDeprecated } = useDeprecatedTokens();

  // Always sort ALL tokens, never filter them for MarketStats to maintain stable hook calls
  const sortedTokens = useMemo(() => {
    return [...supportedTokens].sort((a, b) => {
      const tokenA = SUPPORTED_TOKENS.find(
        (token) => token.ticker.toUpperCase() === a.ticker.toUpperCase(),
      );
      const tokenB = SUPPORTED_TOKENS.find(
        (token) => token.ticker.toUpperCase() === b.ticker.toUpperCase(),
      );

      // Default order for tokens not found in SUPPORTED_TOKENS
      const orderA = tokenA?.assetDisplayOrder || 999;
      const orderB = tokenB?.assetDisplayOrder || 999;

      return orderA - orderB;
    });
  }, [supportedTokens]);

  // Filter only for display in the list
  const visibleTokens = useMemo(() => {
    return showDeprecated
      ? sortedTokens
      : sortedTokens.filter((token) => !token.deprecated);
  }, [sortedTokens, showDeprecated]);

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          {/* Always pass ALL tokens to MarketStats to maintain stable hook calls */}
          <MarketStats
            tokens={sortedTokens as SupportedToken[]}
            prices={prices}
            showDeprecated={showDeprecated}
          />
          <div className={styles.marketsList}>
            {(visibleTokens as SupportedToken[]).map((token) => (
              <MarketRow key={token.ticker} token={token} prices={prices} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Wrap the Markets component with the context provider
const Markets: React.FC = () => {
  return (
    <DeprecatedTokensProvider>
      <MarketsContent />
    </DeprecatedTokensProvider>
  );
};

export default Markets;
