"use client";
import styles from "./markets.module.css";
import Header from "../../components/Header/Header";
import Image from "next/image";
import Link from "next/link";
import { marketData } from "../data";

const Markets = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.marketsList}>
            {marketData.map((market, index) => (
              <Link
                href={`/${market.symbol}`}
                key={market.symbol}
                className={styles.marketLink}
              >
                <div className={styles.marketRowWrapper}>
                  <div className={styles.marketRow}>
                    <div className={styles.assetInfo}>
                      <div className={styles.iconWrapper}>
                        <Image
                          src={market.icon}
                          alt={market.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className={styles.nameSymbol}>
                        <h2 className={styles.name}>{market.name}</h2>
                        <p className={styles.symbol}>{market.symbol}</p>
                      </div>
                    </div>

                    <div className={styles.aprInfo}>
                      <div className={styles.aprValue}>
                        <p className={styles.apr}>{market.apy}%</p>
                        <Image
                          src="/icons/APRUp.svg"
                          alt="APR trend"
                          width={16}
                          height={16}
                        />
                      </div>
                      <p className={styles.aprLabel}>APY</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        {market.utilization}%
                      </p>
                      <p className={styles.metricLabel}>Utilization</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        {market.utilization2}%
                      </p>
                      <p className={styles.metricLabel}>Utilization</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        {market.available} {market.availableCurrency}
                      </p>
                      <p className={styles.metricLabel}>Available</p>
                    </div>

                    <div className={styles.metricBox}>
                      <p className={styles.metricValue}>
                        {market.lent} {market.lentCurrency}
                      </p>
                      <p className={styles.metricLabel}>Lent</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
