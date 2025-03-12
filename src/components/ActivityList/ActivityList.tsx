import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ActivityList.module.css";
import {
  TransactionItem,
  Transaction,
} from "./TransactionItem/TransactionItem";
import { exportTransactionsAsCSV } from "@/utils/CSVExport";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";

interface ActivityListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  transactions,
  isLoading,
}) => {
  const { data: supportedTokens } = useSupportedTokens();
  const [displayLimit, setDisplayLimit] = useState(5);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleExport = () => {
    exportTransactionsAsCSV(transactions, supportedTokens);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && transactions.length > displayLimit) {
          // Load 5 more transactions when the user scrolls to the bottom
          setDisplayLimit(prevLimit => prevLimit + 5);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.disconnect();
      }
    };
  }, [displayLimit, isLoading, transactions.length]);

  const renderContent = () => {
    if (isLoading && (!transactions || transactions.length === 0)) {
      return <p className={styles.statusMessage}>Loading...</p>;
    }

    if (!isLoading && (!transactions || transactions.length === 0)) {
      return <p className={styles.statusMessage}>No transactions found</p>;
    }

    // Only display transactions up to the current limit
    const displayedTransactions = transactions.slice(0, displayLimit);

    return (
      <>
        <div className={styles.transactionsList}>
          {displayedTransactions.map((tx: Transaction) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
          
          {/* Observer element at the bottom of the scrollable area */}
          {transactions.length > displayLimit && (
            <div 
              ref={observerRef} 
              style={{ padding: '10px 0', textAlign: 'center', fontSize: '12px', color: 'var(--secondary-periwinkle)' }}
            >
              {isLoading ? "Loading more..." : ""}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.activityContainer}>
      <div className={styles.activityTitleContainer}>
        <p className={styles.activityTitle}>Activity</p>
        <div onClick={handleExport} style={{ cursor: "pointer" }}>
          <Image
            src="/icons/csv-export.svg"
            alt="CSV export"
            width={9}
            height={9}
          />
        </div>
      </div>

      <div className={styles.activity}>{renderContent()}</div>
    </div>
  );
};

export default ActivityList;