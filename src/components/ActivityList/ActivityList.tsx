"use client";
import React from "react";
import Image from "next/image";
import styles from "./ActivityList.module.css";
import { formatTMB } from "../utils/utils";
import { tokens } from "liquidops";
import { Quantity } from "ao-tokens"

export interface Transaction {
  id: string;
  tags: Record<string, string>;
  block: {
    timestamp: number;
  };
}

interface ActivityListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  transactions,
  isLoading,
}) => {
  const getTransactionType = (tags: Transaction["tags"]) => {
    if (tags["Analytics-Tag"] === "Borrow") return "Borrowed";
    if (tags["Analytics-Tag"] === "Repay") return "Repaid";
    if (tags["Analytics-Tag"] === "Lend") return "Lent";
    if (tags["Analytics-Tag"] === "UnLend") return "Unlent";
    return "Unknown";
  };

  const getActivityIcon = (tags: Transaction["tags"]) => {
    // Find the token ticker by looking up the address in the tokens object
    const tokenAddress = tags["token"];
    const tokenTicker =
      Object.entries(tokens)
        .find(([_, address]) => address === tokenAddress)?.[0]
        ?.toLowerCase() || "unknown";
    return `/tokens/${tokenTicker}.svg`;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
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
          <a
            key={tx.id}
            target="_blank"
            href={`https://www.ao.link/#/message/${tx.id}`}
            className={styles.activityLink}
            rel="noopener noreferrer"
          >
            <div className={styles.activityItemContainer}>
              <div className={styles.actionContainer}>
                <Image
                  src={getActivityIcon(tx.tags)}
                  alt="activity"
                  width={18}
                  height={18}
                />
                <div className={styles.actionDetails}>
                  <p className={styles.action}>{getTransactionType(tx.tags)}</p>
                  <p className={styles.amount}>
                    {/** this is hardcoded, fix it with the proper denomination */}
                    {formatTMB(new Quantity(tx.tags["Quantity"], 12n))}
                  </p>
                </div>
              </div>
              <p className={styles.timestamp}>
                {formatTimestamp(Number(tx.tags["timestamp"]))}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.activityContainer}>
      <p className={styles.activityTitle}>Activity</p>
      <div className={styles.activity}>{renderContent()}</div>
    </div>
  );
};

export default ActivityList;
