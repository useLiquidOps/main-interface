import { Quantity } from "ao-tokens";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

export const PendingTxContext = createContext<
  [PendingTransaction[], Dispatch<SetStateAction<PendingTransaction[]>>]
>([[], () => {}]);

export default function PendingTransactions({
  children,
}: PropsWithChildren<{}>) {
  const [state, setState] = useState<PendingTransaction[]>([]);

  return (
    <PendingTxContext.Provider value={[state, setState]}>
      {children}
    </PendingTxContext.Provider>
  );
}

export interface PendingTransaction {
  id: string;
  timestamp: number;
  qty: Quantity;
  ticker: string;
  action: "borrow" | "repay" | "lend" | "unlend";
}
