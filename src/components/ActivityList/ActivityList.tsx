import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ActivityList.module.css";
import {
  TransactionItem,
  Transaction,
} from "./TransactionItem/TransactionItem";
import { exportTransactionsAsCSV } from "@/utils/exports/CSVExport";
import { exportTransactionsAsJSON } from "@/utils/exports/JSONExport";
import Link from "next/link";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { useHighestAPY } from "@/hooks/LiquidOpsData/useHighestAPY";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

interface ActivityListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onClose: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  transactions,
  isLoading,
  onClose,
}) => {
  const { data: supportedTokens } = useSupportedTokens();
  const [displayLimit, setDisplayLimit] = useState(5);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const { data: highestAPYData, isLoading: isApyLoading } =
    useHighestAPY(supportedTokens);

  const highestAPY = highestAPYData?.highestAPY || 0;
  const highestTicker = highestAPYData?.highestTicker || "";

  const handleCsvExport = () => {
    exportTransactionsAsCSV(transactions, supportedTokens);
  };

  const handleJsonExport = () => {
    exportTransactionsAsJSON(transactions, supportedTokens);
  };

  const handleRefreshClick = () => {
    setIsRotating(true);

    setTimeout(() => {
      setIsRotating(false);
    }, 500); // animation duration in CSS
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isLoading &&
          transactions.length > displayLimit
        ) {
          // Load 9 more transactions when the user scrolls to the bottom
          setDisplayLimit((prevLimit) => prevLimit + 9);
        }
      },
      { threshold: 0.5 },
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
      return (
        <div className={styles.noTransactionsContainer}>
          <Image
            src="/icons/noAssets.svg"
            alt="No assets"
            width={100}
            height={100}
          />
          <div className={styles.noTxnTextContainer}>
            <p className={styles.noTransactionsFound}>No assets supplied yet</p>
            <div className={styles.highestAPY}>
              <span>Supplying liquidity can</span>

              <div className={styles.highestAPYText}>
                <span>earn you up to</span>
                {isApyLoading ? (
                  <SkeletonLoading style={{ width: "60px", height: "15px" }} />
                ) : (
                  <Link
                    onClick={onClose}
                    className={styles.apyNumber}
                    href={`/${highestTicker}`}
                  >
                    {highestAPY.toFixed(2)}% APY
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      );
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
              style={{
                padding: "10px 0",
                textAlign: "center",
                fontSize: "12px",
                color: "var(--secondary-periwinkle)",
              }}
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
        <div className={styles.left}>
          <p className={styles.activityTitle}>Transactions</p>
          <Image
            src="/icons/refresh.svg"
            alt="Refresh icon"
            width={14}
            height={14}
            className={`${styles.refreshIcon} ${isRotating ? styles.rotating : ""}`}
            onClick={handleRefreshClick}
          />
        </div>

        <div className={styles.right}>
          <div
            onClick={handleCsvExport}
            style={{ cursor: "pointer" }}
            className={styles.exportContainer}
          >
            <Image
              src="/icons/csv-export.svg"
              alt="CSV export"
              width={15}
              height={15}
            />
            <p className={styles.exportText}>.CSV</p>
          </div>

          <div
            onClick={handleJsonExport}
            style={{ cursor: "pointer" }}
            className={styles.exportContainer}
          >
            <Image
              src="/icons/csv-export.svg"
              alt="CSV export"
              width={15}
              height={15}
            />
            <p className={styles.exportText}>.JSON</p>
          </div>
        </div>
      </div>

      <div className={styles.activity}>{renderContent()}</div>
    </div>
  );
};

export default ActivityList;
