import styles from "./FairLaunchRow.module.css";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { FairLaunchStrategy } from "../adapters/fairLaunch";

interface FairLaunchRowProps {
  strategy: FairLaunchStrategy;
}

export const FairLaunchRow: React.FC<FairLaunchRowProps> = ({ strategy }) => {
  //   const isLoading = stats.isLoading TODO: may need to add

  return (
    <div className={styles.fairLaunchRowWrapper}>
      <div className={styles.fairLaunchRow}>
        {/* Deposit asset Info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${strategy.borrowToken.ticker}.svg`}
              alt={strategy.borrowToken.name}
              width={40}
              height={40}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{strategy.borrowToken.name}</h2>
            <p className={styles.symbol}>{strategy.borrowToken.ticker}</p>
          </div>
        </div>

        {/* Available */}
        <div className={styles.metricBox}>
          <p className={styles.metricValue}>{strategy.available}</p>
          <p className={styles.metricLabel}>Available</p>
        </div>

        {/* APY Info */}
        <div className={styles.aprInfo}>
          <div className={styles.aprValue}>
            <Image
              src={`/icons/APYStars.svg`}
              alt={`Stars icon`}
              width={10}
              height={10}
            />
            <p className={styles.apr}>{strategy.apy.toFixed(2)}%</p>
          </div>
          <p className={styles.aprLabel}>Supply APY</p>
        </div>
      </div>
    </div>
  );
};
