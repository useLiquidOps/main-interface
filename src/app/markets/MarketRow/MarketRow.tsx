import styles from "./MarketRow.module.css";
import Image from "next/image";
import Link from "next/link";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { tickerToGeckoMap } from "@/hooks/data/useTokenPrice";

interface Token {
  ticker: string;
  name: string;
  icon: string;
}

interface PriceData {
  [geckoId: string]: {
    usd: number;
  };
}

interface MarketRowProps {
  token: Token;
  prices: PriceData | undefined;
}

export const MarketRow: React.FC<MarketRowProps> = ({ token, prices }) => {
  const stats = useProtocolStats(token.ticker.toUpperCase());
  const geckoId = tickerToGeckoMap[token.ticker.toUpperCase()];
  const price = new Quantity(0n, 12n).fromNumber(prices?.[geckoId]?.usd ?? 0);

  const isLoading = stats.isLoading || !stats.data;
  const data = isLoading
    ? {
        apr: 0,
        protocolBalance: new Quantity(0n, 12n),
        unLent: new Quantity(0n, 12n),
        borrows: new Quantity(0n, 12n),
        utilizationRate: new Quantity(0n, 12n),
      }
    : stats.data;

  return (
    <Link href={`/${token.ticker}`} className={styles.marketLink}>
      <div className={styles.marketRowWrapper}>
        <div className={styles.marketRow}>
          <div className={styles.assetInfo}>
            <div className={styles.iconWrapper}>
              <Image
                src={token.icon}
                alt={token.name || token.ticker}
                width={40}
                height={40}
              />
            </div>
            <div className={styles.nameSymbol}>
              <h2 className={styles.name}>{token.name || token.ticker}</h2>
              <p className={styles.symbol}>{token.ticker}</p>
            </div>
          </div>

          <div className={styles.aprInfo}>
            <div className={styles.aprValue}>
              <p className={styles.apr}>{data.apr.toFixed(2)}%</p>
              <Image
                src={
                  isLoading
                    ? "/icons/APRUp.svg"
                    : stats.data.percentChange.outcome
                      ? "/icons/APRUp.svg"
                      : "/icons/APRDown.svg"
                }
                alt="APR trend"
                width={16}
                height={16}
              />
            </div>
            <p className={styles.aprLabel}>APY</p>
          </div>

          <div className={styles.metricBox}>
            <p className={styles.metricValue}>
              ${formatTMB(Quantity.__mul(data.protocolBalance, price))}
            </p>
            <p className={styles.metricLabel}>TVL</p>
          </div>

          <div className={styles.metricBox}>
            <p className={styles.metricValue}>
              ${formatTMB(Quantity.__mul(data.unLent, price))}
            </p>
            <p className={styles.metricLabel}>Collateral</p>
          </div>

          <div className={styles.metricBox}>
            <p className={styles.metricValue}>
              ${formatTMB(Quantity.__mul(data.borrows, price))}
            </p>
            <p className={styles.metricLabel}>Borrowed</p>
          </div>

          <div className={styles.metricBox}>
            <p className={styles.metricValue}>
              {data.utilizationRate.toNumber().toFixed(2)}%
            </p>
            <p className={styles.metricLabel}>Utilization</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
