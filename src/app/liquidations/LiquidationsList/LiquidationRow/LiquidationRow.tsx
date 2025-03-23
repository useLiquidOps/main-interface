import React from 'react';
import styles from './LiquidationRow.module.css';
import Image from 'next/image';
import { formatTMB } from '@/components/utils/utils';
import { Quantity } from 'ao-tokens';

interface TokenData {
  name: string;
  symbol: string;
  icon: string;
  available: Quantity;
  price: Quantity;
}

interface LiquidationRowProps {
  fromToken: TokenData;
  toToken: TokenData;
  onLiquidate: () => void;
  getTokenPrice: (symbol: string) => Quantity;
}

const LiquidationRow: React.FC<LiquidationRowProps> = ({
  fromToken,
  toToken,
  onLiquidate,
  getTokenPrice,
}) => {
  return (
    <div className={styles.liquidationRowWrapper}>
      <div
        className={styles.liquidationRow}
        onClick={onLiquidate}
      >
        <div className={styles.tokenInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={fromToken.icon}
              alt={fromToken.name}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{fromToken.name}</h2>
            <p className={styles.symbol}>{fromToken.symbol}</p>
          </div>
        </div>

        <div className={styles.arrowContainer}>
          <Image
            src="/icons/arrow-right.svg"
            alt="arrow"
            width={20}
            height={20}
          />
        </div>

        <div className={styles.tokenInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={toToken.icon}
              alt={toToken.name}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{toToken.name}</h2>
            <p className={styles.symbol}>{toToken.symbol}</p>
          </div>
        </div>

        <div className={styles.metricBox}>
          <div className={styles.metricValue}>
            <p style={{ paddingRight: "2px", margin: "0px" }}>
              {formatTMB(toToken.available)}
            </p>
            <p style={{ paddingLeft: "2px", margin: "0px" }}>
              {toToken.symbol}
            </p>
          </div>
          <p className={styles.metricLabel}>Profit</p>
        </div>

        <div className={styles.metricBox}>
          <p className={styles.metricValue}>
            <span style={{ paddingRight: "2px", margin: "0px" }}>
              {formatTMB(toToken.available)}
            </span>
            <span style={{ paddingLeft: "2px", margin: "0px" }}>
              {toToken.symbol}
            </span>
          </p>
          <p className={styles.metricLabel}>Available</p>
        </div>

        <div className={styles.metricBox}>
          <p className={styles.metricValue}>
            $
            {getTokenPrice(fromToken.symbol).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </p>
          <p className={styles.metricLabel}>Price</p>
        </div>
      </div>
      <button
        className={styles.liquidateButton}
        onClick={onLiquidate}
      >
        <Image
          src="/icons/liquidate.svg"
          alt="Liquidate"
          width={20}
          height={20}
          className={styles.liquidateIcon}
        />
        <span>Liquidate</span>
      </button>
    </div>
  );
};

export default LiquidationRow;