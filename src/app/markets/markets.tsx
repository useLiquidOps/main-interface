"use client";
import styles from "./Markets.module.css";
import Header from "../../components/Header/Header";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import Banner from "@/components/Banner/Banner";
import { MarketStats } from "./MarketStats/MarketStats";
import { MarketRow } from "./MarketRow/MarketRow";

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
      <Banner />
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
    </div>
  );
};

export default Markets;
