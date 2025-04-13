"use client";
import styles from "./strategies.module.css";
import Header from "../../components/Header/Header";
import { usePrices } from "@/hooks/data/useTokenPrice";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { StratergyStats } from "./StratergyStats/StratergyStats";
import { StratergyRow } from "./StratergyRow/StratergyRow";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

interface Token {
  ticker: string;
  name: string;
  icon: string;
}

const Strategies: React.FC = () => {
  const { data: supportedTokens = [] } = useSupportedTokens();
  const { data: prices } = usePrices();

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <StratergyStats tokens={supportedTokens as Token[]} prices={prices} />
          <div className={styles.marketsList}>
            {(supportedTokens as Token[]).map((token) => (
              <StratergyRow key={token.ticker} token={token} prices={prices} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Strategies;
