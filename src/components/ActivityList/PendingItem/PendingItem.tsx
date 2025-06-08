import { PendingTransaction } from "@/components/PendingTransactions/PendingTransactions";
import styles from "../TransactionItem/TransactionItem.module.css";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TOKEN_DECIMAL_PLACES } from "@/utils/tokenMappings";
import Spinner from "@/components/Spinner/Spinner";
import { Quantity } from "ao-tokens";

export const PendingItem: React.FC<{ tx: PendingTransaction }> = ({ tx }) => {
  const action = useMemo(() => {
    if (tx.action === "borrow") return "Borrowing";
    else if (tx.action === "lend") return "Lending";
    else if (tx.action === "repay") return "Repaying";
    return "Unlending";
  }, [tx]);

  const formatQty = (qty: Quantity) => {
    let maximumFractionDigits: BigIntToLocaleStringOptions["maximumFractionDigits"] = 2;
    if (Quantity.lt(qty, new Quantity(1n, 0n))) {
      maximumFractionDigits = 6;
    }

    return qty.toLocaleString(undefined, { maximumFractionDigits });
  };

  return (
    <Link
      key={tx.id}
      target="_blank"
      href={`https://www.ao.link/#/message/${tx.id}`}
      className={styles.activityLink}
      rel="noopener noreferrer"
    >
      <div className={styles.activityItemContainer}>
        <div className={styles.left}>
          <Image
            src={`./tokens/${tx.ticker}.svg`}
            alt="activity"
            width={25}
            height={25}
          />

          <div className={styles.actionDetailsContainer}>
            <div className={styles.actionDetails}>
              <p>{action}</p>
              <p>{formatQty(tx.qty)}</p>
            </div>

            <p className={styles.timestamp}>
              {new Date(tx.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className={styles.right}>
          <Spinner />
        </div>
      </div>
    </Link>
  );
};
