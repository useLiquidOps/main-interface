import React from "react";
import styles from "./ProtocolBalances.module.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { balanceItem } from "@/utils/ao/getData/getAllBalances";
import { loanItem } from "@/utils/ao/getData/getCurrentLoans";
import { depositItem } from "@/utils/ao/getData/getCurrentDeposits";

interface ProtocolBalancesProps {
  allBalances: balanceItem[];
  isLendMode: boolean;
  borrowedAssets: loanItem[];
  depositedAssets: depositItem[];
}

const ProtocolBalances = ({
  allBalances,
  isLendMode,
  borrowedAssets,
  depositedAssets,
}: ProtocolBalancesProps) => {
  const getColors = (hoursTillAPI: number) => {
    if (hoursTillAPI < 4) {
      return "#FF0000";
    } else if (hoursTillAPI < 12) {
      return "#FF8A00";
    } else {
      return "#10C600";
    }
  };

  const getSecondaryColor = (hoursTillAPI: number) => {
    if (hoursTillAPI < 4) {
      return "#FF8989";
    } else if (hoursTillAPI < 12) {
      return "#FFAF51";
    } else {
      return "#41E23E";
    }
  };

  const earnedAPY = 1;

  const handleCopyTransactionId = (transactionId: string) => {
    navigator.clipboard.writeText(transactionId);
  };

  // const filteredBalances = allBalances.filter(
  //   (token) => token.protocolBalance > 0,
  // );

  return (
    <div className={styles.protocolBalances}>
      <div className={styles.titleContainer}>
        <div className={styles.titleAsset}>
          <p>{isLendMode ? "Loaned Assets" : "Borrowed Assets"}</p>
        </div>
        <div className={styles.titleAPY}>
          <p>{isLendMode ? "APY Earned" : "Hours till API"}</p>
        </div>
        <div className={styles.titleBalance}>
          <p>Balance</p>
        </div>
      </div>
      <div className={styles.tokenList}>
        {isLendMode ? (
          depositedAssets && depositedAssets.length > 0 ? (
            depositedAssets.map((token, index) => (
              <div key={index} className={`${styles.tokenItem}`}>
                <div className={styles.tokenInfoWrapper}>
                  <div className={styles.tokenInfo}>
                    <img
                      src={token.iconPath}
                      alt={token.name}
                      className={styles.tokenIcon}
                    />
                    <div className={styles.tokenTextInfo}>
                      <p className={styles.tokenTicker}>{token.ticker}</p>
                      <p className={styles.tokenName}>{token.name}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.apyInfoWrapper}>
                  <div className={styles.apyInfo}>
                    <p className={styles.tokenAPY}>{earnedAPY}</p>
                    {/* <p className={styles.tokenAPYWorth}>
                      ${(token.price * earnedAPY).toLocaleString()}
                    </p> */}
                  </div>
                </div>
                <div className={styles.balanceWrapper}>
                  <p className={styles.tokenBalance}>
                    {token.balance
                      ? (
                          parseFloat(token.balance) / 1000000000000
                        ).toLocaleString()
                      : "0"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noAssetsWrapper}>
              <p className={styles.noAssets}>No loaned assets</p>
            </div>
          )
        ) : borrowedAssets && borrowedAssets.length > 0 ? (
          borrowedAssets.map((transaction, index) => (
            <div key={index} className={`${styles.tokenItem}`}>
              <div
                className={styles.copyIconWrapper}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyTransactionId(transaction.id);
                }}
              >
                <img
                  src="/icons/copy.svg"
                  alt="copy"
                  className={styles.copyIcon}
                />
              </div>
              <div className={styles.tokenInfoWrapper}>
                <div className={styles.tokenInfo}>
                  <img
                    src={transaction.iconPath}
                    alt={transaction.name}
                    className={styles.tokenIcon}
                  />
                  <div className={styles.tokenTextInfo}>
                    <p className={styles.tokenTicker}>{transaction.ticker}</p>
                    <p className={styles.tokenName}>{transaction.name}</p>
                  </div>
                </div>
              </div>
              <div className={styles.countdownWrapper}>
                <CountdownCircleTimer
                  isPlaying
                  duration={24 * 3600}
                  initialRemainingTime={getElapsedSeconds(
                    transaction.timestamp,
                  )}
                  colors={getColors(getRemainingHours(transaction.timestamp))}
                  size={24}
                  strokeWidth={4}
                  trailColor={getSecondaryColor(
                    getRemainingHours(transaction.timestamp),
                  )}
                >
                  {({ remainingTime }) => {
                    const hours = Math.floor(remainingTime / 3600);
                    return (
                      <span className={styles.countdownNumber}>{hours}</span>
                    );
                  }}
                </CountdownCircleTimer>
              </div>
              <div className={styles.balanceWrapper}>
                <p className={styles.tokenBalance}>
                  {transaction.balance
                    ? parseFloat(transaction.balance).toLocaleString()
                    : "0"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noAssetsWrapper}>
            <p className={styles.noAssets}>No borrowed assets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolBalances;

function getElapsedSeconds(timestamp: string | undefined) {
  if (!timestamp) {
    timestamp = "0";
  }
  const timestampMillis = parseInt(timestamp, 10);
  const currentDate = new Date();
  const targetDate = new Date(timestampMillis);
  targetDate.setHours(targetDate.getHours() + 24);

  const remainingMillis = targetDate.getTime() - currentDate.getTime();
  const remainingSeconds = Math.floor(remainingMillis / 1000);
  return remainingSeconds;
}

function getRemainingHours(timestamp: string | undefined) {
  if (!timestamp) {
    timestamp = "0";
  }
  const timestampMillis = parseInt(timestamp, 10);
  const currentDate = new Date();
  const targetDate = new Date(timestampMillis);
  targetDate.setHours(targetDate.getHours() + 24);

  const remainingMillis = targetDate.getTime() - currentDate.getTime();
  const remainingHours = Math.floor(remainingMillis / 1000 / 3600);
  return remainingHours;
}

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
