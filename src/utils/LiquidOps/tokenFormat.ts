import { Quantity } from "ao-tokens";

export function formatQty(qty: Quantity) {
  let maximumFractionDigits: BigIntToLocaleStringOptions["maximumFractionDigits"] = 2;
  if (Quantity.lt(qty, new Quantity(1n, 0n))) {
    maximumFractionDigits = 6;
  }

  return qty.toLocaleString(undefined, { maximumFractionDigits });
}
