"use client";
import React from "react";
import styles from "./Panel.module.css";
import { Token } from "@/utils/ao/utils/tokenInfo";
import { Transaction } from "@/utils/ao/getData/getTags";
import { tokenInfo } from "@/utils/ao/utils/tokenInfo";
import {
  TransactionItem,
  handlePanelSubmit,
  handleTokenChange,
  maxBalance,
} from "./PanelUtils";
import { balanceItem } from "@/utils/ao/getData/getAllBalances";
import { APY } from "@/utils/ao/getData/getAllAPYs";

interface PanelProps {
  selectedToken: Token | undefined;
  selectedTokenPrice: number | undefined;
  allBalances: balanceItem[];
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  recentLendTransactions: Transaction[];
  recentUnLendTransactions: Transaction[];
  recentBorrowTransactions: Transaction[];
  recentRepayTransactions: Transaction[];
  recentInterestTransactions: Transaction[];
  className: string;
  isLendMode: boolean;
  isBorrowMode: boolean;
  handleTabChange: (mode: boolean) => void;
  isAPIMode: boolean;
  handleAPIToggle: (isInterest: boolean) => void;
  tokenAPYs: APY[];
  params: { ticker: string; tab: string };
  borrowID: string;
  setBorrowID: React.Dispatch<React.SetStateAction<string>>;
}

const Panel: React.FC<PanelProps> = ({
  selectedToken,
  selectedTokenPrice,
  allBalances,
  amount,
  setAmount,
  recentLendTransactions,
  recentUnLendTransactions,
  recentBorrowTransactions,
  recentRepayTransactions,
  recentInterestTransactions,
  isLendMode,
  isBorrowMode,
  handleTabChange,
  isAPIMode,
  handleAPIToggle,
  tokenAPYs,
  params,
  borrowID,
  setBorrowID,
}) => {
  const handleSubmit = () => {
    handlePanelSubmit(
      isLendMode,
      isBorrowMode,
      isAPIMode,
      amount,
      selectedToken,
      borrowID,
    );
  };

  if (!selectedTokenPrice) {
    selectedTokenPrice = 0;
  }

  const handleTabChangeWithURL = (
    mode: boolean,
    isInterest: boolean = false,
  ) => {
    handleTabChange(mode);
    handleAPIToggle(isInterest);
    const ticker = selectedToken?.ticker || "";
    let tab = "";

    if (isLendMode) {
      tab = mode ? "deposit" : "withdraw";
    } else {
      if (isInterest) {
        tab = "interest";
      } else {
        tab = mode ? "borrow" : "repay";
      }
    }

    const newUrl = isLendMode
      ? `/lend/${ticker}/${tab}`
      : `/borrow/${ticker}/${tab}`;
    window.history.pushState(null, "", newUrl);
  };

  const recentTransactions = isLendMode
    ? isBorrowMode
      ? recentLendTransactions
      : recentUnLendTransactions
    : isBorrowMode
      ? isAPIMode
        ? recentInterestTransactions
        : recentBorrowTransactions
      : recentRepayTransactions;

  const getBalance = (tokenAddress: string | undefined) => {
    const balance = allBalances.find((item) => item.address === tokenAddress);
    return balance ? balance.balance : 0;
  };

  const getAPY = (tokenAddress: string | undefined) => {
    const APY = tokenAPYs.find((item) => item.address === tokenAddress);
    return APY ? APY.apy : 0;
  };

  return (
    <div className={`${styles.panelContainer}`}>
      <div className={styles.panelTop}>
        <div className={styles.panelToggle}>
          {isLendMode ? (
            <>
              <button
                className={`${styles.panelButton} ${
                  isBorrowMode ? styles.panelButtonActive : ""
                } ${styles.panelButtonLeft}`}
                onClick={() => handleTabChangeWithURL(true)}
              >
                Deposit
              </button>
              <button
                className={`${styles.panelButton} ${
                  !isBorrowMode ? styles.panelButtonActive : ""
                } ${styles.panelButtonRight}`}
                onClick={() => handleTabChangeWithURL(false)}
              >
                Withdraw
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.panelButton} ${
                  isBorrowMode && !isAPIMode ? styles.panelButtonActive : ""
                } ${styles.panelButtonLeft}`}
                onClick={() => handleTabChangeWithURL(true)}
              >
                Borrow
              </button>
              {!isLendMode && (
                <button
                  className={`${styles.panelButton} ${
                    isAPIMode ? styles.panelButtonActive : ""
                  } ${styles.panelButtonMiddle}`}
                  onClick={() => handleTabChangeWithURL(true, true)}
                >
                  API
                </button>
              )}
              <button
                className={`${styles.panelButton} ${
                  !isBorrowMode && !isAPIMode ? styles.panelButtonActive : ""
                } ${styles.panelButtonRight}`}
                onClick={() => handleTabChangeWithURL(false)}
              >
                Repay
              </button>
            </>
          )}
        </div>
        <div className={styles.panelForm}>
          <div className={styles.greyContainer}>
            <div className={styles.greyContainerDiv}>
              <input
                type="text"
                value={amount.toLocaleString()}
                onChange={(e) =>
                  setAmount(Number(e.target.value.replace(/,/g, "")))
                }
                placeholder="0"
                className={styles.panelInput}
              />
              <p className={styles.USDBalance}>
                ${(amount * selectedTokenPrice).toLocaleString()} tUSDA
              </p>
            </div>
            <div className={styles.greyContainerDiv}>
              <div className={styles.toggleToken}>
                <img
                  className={styles.toggleTokenIcon}
                  src={selectedToken?.iconPath}
                  alt={selectedToken?.name}
                />
                <select
                  id="token"
                  value={selectedToken?.name}
                  onChange={(event) => handleTokenChange(event, params)}
                  className={styles.selectBox}
                >
                  {tokenInfo.map((token) => (
                    <option key={token.ticker} value={token.ticker}>
                      {token.ticker}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.balanceContainer}>
                <img
                  className={styles.balanceContainerImg}
                  src="/images/wallet-icon.svg"
                  alt="Wallet icon"
                />
                <div className={styles.balanceContainerDiv}>
                  <span className={styles.balanceContainerSpan}>
                    {(
                      getBalance(selectedToken?.address) / 1000000000000
                    ).toLocaleString()}
                  </span>
                  <span className={styles.balanceContainerSpan}>|</span>
                  <button
                    className={styles.balanceContainerButtonMax}
                    onClick={() =>
                      maxBalance(
                        setAmount,
                        getBalance(selectedToken?.address) / 1000000000000,
                      )
                    }
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.confirmationDiv}>
            <div>
              {!isLendMode && (!isBorrowMode || isAPIMode) && (
                <input
                  type="text"
                  value={borrowID}
                  onChange={(e) => setBorrowID(e.target.value)}
                  placeholder="Enter borrow ID..."
                  className={styles.borrowIDInput}
                />
              )}
              {!isLendMode && isBorrowMode && !isAPIMode && (
                <p
                  className={styles.greyContainerP}
                  style={{ marginTop: "1rem" }}
                >
                  tUSDA 2X collateral: $
                  {(amount * selectedTokenPrice * 2).toLocaleString()}
                </p>
              )}
              {isLendMode && (
                <p className={styles.greyContainerP}>
                  Estimated APY: {getAPY(selectedToken?.address)}%
                </p>
              )}
              <p
                className={styles.greyContainerP}
                style={{ marginBottom: "1rem" }}
              >
                Network fee: $0 tUSDA
              </p>
            </div>
            <div>
              <img
                className={styles.settings}
                src="/images/settings.svg"
                alt="Settings"
              />
            </div>
          </div>
          <button onClick={handleSubmit} className={styles.panelSubmitButton}>
            Submit
          </button>
        </div>
      </div>
      <div className={styles.transactionContainer}>
        <h5 className={styles.transactionsTitle}>Recent transactions</h5>
        <div className={styles.transactionsSection}>
          {recentTransactions.length > 0 ? (
            <ul className={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.noTransactions}>No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
