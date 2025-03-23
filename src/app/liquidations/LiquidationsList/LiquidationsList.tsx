import React from 'react';
import styles from './LiquidationsList.module.css';
import LiquidationRow from './LiquidationRow/LiquidationRow';
import { Quantity } from 'ao-tokens';

interface TokenData {
  name: string;
  symbol: string;
  icon: string;
  available: Quantity;
  price: Quantity;
}

interface Liquidation {
  fromToken: TokenData;
  toToken: TokenData;
  offMarketPrice?: number;
}

interface LiquidationsListProps {
  liquidations: Liquidation[];
  onLiquidate: (liquidation: Liquidation) => void;
  getTokenPrice: (symbol: string) => Quantity;
}

const LiquidationsList: React.FC<LiquidationsListProps> = ({
  liquidations,
  onLiquidate,
  getTokenPrice,
}) => {
  return (
    <div className={styles.liquidationsList}>
      {liquidations.length > 0 ? (
        liquidations.map((liquidation, index) => (
          <LiquidationRow
            key={index}
            fromToken={liquidation.fromToken}
            toToken={liquidation.toToken}
            onLiquidate={() => onLiquidate(liquidation)}
            getTokenPrice={getTokenPrice}
          />
        ))
      ) : (
        <div className={styles.noLiquidations}>
          <p>No liquidations found</p>
        </div>
      )}
    </div>
  );
};

export default LiquidationsList;