import styles from "./MarketRow.module.css";
import Image from "next/image";
import Link from "next/link";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { tickerToGeckoMap } from "@/hooks/data/useTokenPrice";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

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
          {/* Asset Info */}
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

          {/* APY Info */}
          <div className={styles.aprInfo}>
            {isLoading ? (
              <>
                <SkeletonLoading className="h-6 w-16 mb-1" />
                <p className={styles.aprLabel}>Supply APY</p>
              </>
            ) : (
              <>
                <div className={styles.aprValue}>
                  <p className={styles.apr}>{data.apr.toFixed(2)}%</p>
                  <Image
                    src={
                      stats.data.percentChange.outcome
                        ? "/icons/APRUp.svg"
                        : "/icons/APRDown.svg"
                    }
                    alt="APR trend"
                    width={16}
                    height={16}
                  />
                </div>
                <p className={styles.aprLabel}>Supply APY</p>
              </>
            )}
          </div>

          {/* Supplied Metric */}
          <div className={styles.metricBox}>
            {isLoading ? (
              <>
                <SkeletonLoading className="h-6 w-20 mb-1" />
                <p className={styles.metricLabel}>Supplied</p>
              </>
            ) : (
              <>
                <p className={styles.metricValue}>
                  $
                  {Number(
                    formatTMB(Quantity.__mul(data.unLent, price)),
                  ).toFixed(2)}
                </p>
                <p className={styles.metricLabel}>Supplied</p>
              </>
            )}
          </div>

          {/* Borrowed Metric */}
          <div className={styles.metricBox}>
            {isLoading ? (
              <>
                <SkeletonLoading className="h-6 w-20 mb-1" />
                <p className={styles.metricLabel}>Borrowed</p>
              </>
            ) : (
              <>
                <p className={styles.metricValue}>
                  $
                  {Number(
                    formatTMB(Quantity.__mul(data.borrows, price)),
                  ).toFixed(2)}
                </p>
                <p className={styles.metricLabel}>Borrowed</p>
              </>
            )}
          </div>

          {/* Utilization Metric */}
          <div className={styles.metricBox}>
            {isLoading ? (
              <>
                <SkeletonLoading className="h-6 w-16 mb-1" />
                <p className={styles.metricLabel}>Utilization</p>
              </>
            ) : (
              <>
                <p className={styles.metricValue}>
                  {data.utilizationRate.toNumber().toFixed(2)}%
                </p>
                <p className={styles.metricLabel}>Utilization</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
