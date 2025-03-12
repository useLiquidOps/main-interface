import React from "react";
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

  const handleExport = () => {
    exportTransactionsAsCSV(transactions, supportedTokens);
  };

  const renderContent = () => {
    if (isLoading && (!transactions || transactions.length === 0)) {
      return <p className={styles.statusMessage}>Loading...</p>;
    }

    if (!isLoading && (!transactions || transactions.length === 0)) {
      return <p className={styles.statusMessage}>No transactions found</p>;
    }

    return (
      <div className={styles.transactionsList}>
        {transactions.map((tx: Transaction) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </div>
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
