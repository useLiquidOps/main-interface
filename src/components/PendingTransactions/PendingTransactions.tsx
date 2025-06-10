import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export const PendingTxContext = createContext<
  [PendingTransaction[], Dispatch<SetStateAction<PendingTransaction[]>>]
>([[], () => {}]);

export default function PendingTransactions({
  children,
}: PropsWithChildren<{}>) {
  const CACHE_KEY = "pending-txs";
  const [state, setState] = useState<PendingTransaction[]>([]);
  const [loadedCache, setLoadedCache] = useState(false);

  // load
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
    setState(cached);
    setLoadedCache(true);
  }, []);

  // save
  useEffect(() => {
    if (!loadedCache) return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  }, [state, loadedCache]);

  return (
    <PendingTxContext.Provider value={[state, setState]}>
      {children}
    </PendingTxContext.Provider>
  );
}

export interface PendingTransaction {
  id: string;
  timestamp: number;
  qty: string;
  ticker: string;
  action: "borrow" | "repay" | "lend" | "unlend";
}
