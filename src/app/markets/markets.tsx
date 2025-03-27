"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { MarketStats } from "./MarketStats/MarketStats";
import { MarketRow } from "./MarketRow/MarketRow";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

interface Token {
  ticker: string;
  name: string;
  icon: string;
}

const Markets: React.FC = () => {
  const { data: supportedTokens = [] } = useSupportedTokens();
  const { data: prices } = usePrices();

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <MarketStats tokens={supportedTokens as Token[]} prices={prices} />
          <div className={styles.marketsList}>
            {(supportedTokens as Token[]).map((token) => (
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
