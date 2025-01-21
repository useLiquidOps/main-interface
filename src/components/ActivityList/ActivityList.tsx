"use client";
import React from "react";
import Image from "next/image";
import styles from "./ActivityList.module.css";
import { formatTMB } from "../utils/utils";
import { oTokens } from "liquidops";

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
    if (tags["Action"] === "Borrow") return "Borrowed";
    if (tags["Action"] === "Transfer" && tags["X-Action"] === "Repay")
      return "Repaid";
    if (tags["Action"] === "Transfer" && tags["X-Action"] === "Mint")
      return "Lent";
    if (tags["Action"] === "Redeem") return "Unlent";
    return "Unknown";
  };

  const getTokenIcon = (tags: Transaction["tags"]) => {
    const target = tags["Target"];
    if (!target) {
      throw new Error("No target found in transaction tags");
    }

    // Find the token ticker from oTokens that matches the target address
    const tokenEntries = Object.entries(oTokens);
    const matchingToken = tokenEntries.find(
      ([_, address]) => address === target,
    );

    if (!matchingToken) {
      throw new Error(`No matching token found for target address: ${target}`);
    }

    // Remove the 'o' prefix from token name (e.g 'oDAI' to 'dai')
    return matchingToken[0].slice(1).toLowerCase();
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
        {transactions
          .map((tx: Transaction) => {
            let tokenIcon: string;
            try {
              tokenIcon = getTokenIcon(tx.tags);
            } catch (error) {
              console.error("Error getting token icon:", error);
              return null;
            }

            return (
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
                      src="/icons/activityLent.svg"
                      alt="activity"
                      width={18}
                      height={18}
                    />
                    <div className={styles.actionDetails}>
                      <p className={styles.action}>
                        {getTransactionType(tx.tags)}
                      </p>
                      <p className={styles.amount}>
                        {formatTMB(Number(tx.tags["Quantity"]))}
                      </p>
                      <Image
                        src={`/tokens/${tokenIcon}.svg`}
                        alt={tokenIcon}
                        width={14}
                        height={14}
                      />
                    </div>
                  </div>
                  <p className={styles.timestamp}>
                    {formatTimestamp(tx.block.timestamp)}
                  </p>
                </div>
              </a>
            );
          })
          .filter(Boolean)}
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
