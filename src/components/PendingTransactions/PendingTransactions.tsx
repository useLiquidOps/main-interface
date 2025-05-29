import { usePendingTxSync } from "@/hooks/LiquidOpsData/useSyncPendingTransactions";
import { unWrapQuantity, wrapQuantity } from "@/utils/caches/cacheUtils";
import { Quantity } from "ao-tokens";
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
    const loaded: PendingTransaction[] = [];

    if (cached) {
      for (const raw of cached) {
        loaded.push({ ...raw, qty: unWrapQuantity(raw.qty) });
      }

      setState(loaded);
    }
    setLoadedCache(true);
  }, []);

  // save
  useEffect(() => {
    if (!loadedCache) return;
    const raw = [];

    for (const pending of state) {
      raw.push({ ...pending, qty: wrapQuantity(pending.qty) });
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(raw));
  }, [state, loadedCache]);

  return (
    <PendingTxContext.Provider value={[state, setState]}>
      <SyncComponent>{children}</SyncComponent>
    </PendingTxContext.Provider>
  );
}

// consumer for pending tx context
const SyncComponent = ({ children }: PropsWithChildren<{}>) => {
  // sync
  usePendingTxSync();

  return children;
};

export interface PendingTransaction {
  id: string;
  timestamp: number;
  qty: Quantity;
  ticker: string;
  action: "borrow" | "repay" | "lend" | "unlend";
}
