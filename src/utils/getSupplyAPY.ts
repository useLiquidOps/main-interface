import { Quantity } from "ao-tokens";

interface SupplyAPYArgs {
  /** The borrow rate */
  borrowAPY: number;
  /** The reserve factor for the current pool in percentage */
  reserveFactor: number;
  /** The total amount borrowed */
  totalBorrows: Quantity;
  /** The total amout pooled (borrowed + not borrowed) */
  totalPooled: Quantity
}

/**
 * Get the supply rate from the borrow rate, reserve factor, total borrows and total pooled
 */
export default function getSupplyAPY({
  borrowAPY,
  reserveFactor,
  totalBorrows,
  totalPooled
}: SupplyAPYArgs) {
  // calculate the utilization rate and transform it
  // into a number (since the maximum value is 1)
  const utilizationRate = Quantity.__div(
    totalBorrows,
    totalPooled
  ).toNumber();

  // reserve factor in fractions
  const reserveFactorFract = reserveFactor / 100;

  // ln(1+Borrow APY)
  const lnRes = Math.log(1 + borrowAPY);

  return Math.exp(lnRes * (1 - reserveFactorFract) * utilizationRate) - 1;
}
