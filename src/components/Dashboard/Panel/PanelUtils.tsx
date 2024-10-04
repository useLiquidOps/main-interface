import styles from "./Panel.module.css";
import { lend } from "@/utils/ao/pool/lend/lend";
import { unLend } from "@/utils/ao/pool/lend/unLend";
import { borrow } from "@/utils/ao/pool/borrow/borrow";
import { repay } from "@/utils/ao/pool/borrow/repay";
import { Transaction } from "@/utils/ao/getData/getTags";
import { payInterest } from "@/utils/ao/pool/borrow/payInterest";
import { Token } from "@/utils/ao/utils/tokenInfo";
import { tokenInfo } from "@/utils/ao/utils/tokenInfo";

const formatDate = (timestamp: number) => {
  if (timestamp === undefined) {
    return "Not found";
  }
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getStatusCircleColor = (errorValue: string | undefined) => {
  if (errorValue === "false") {
    return styles.statusCircleGreen;
  } else if (errorValue === undefined) {
    return styles.statusCircleAmber;
  } else {
    return styles.statusCircleRed;
  }
};

const getStatusTooltip = (errorValue: string | undefined) => {
  if (errorValue === "false") {
    return "Success";
  } else if (errorValue === undefined) {
    return "Not sure";
  } else {
    return errorValue;
  }
};

export const openTransactionTable = (transactionId: string) => {
  window.open(`https://ao.link/message/${transactionId}`, "_blank");
};

export const handlePanelSubmit = async (
  isLendMode: boolean,
  isBorrowMode: boolean,
  isAPIMode: boolean,
  amount: number,
  selectedToken: Token | undefined,
  borrowID: string,
) => {
  if (!selectedToken) {
    throw new Error("Cannot find selectedToken");
  }

  if (isLendMode) {
    if (isBorrowMode) {
      await lend(selectedToken.poolID, selectedToken.address, amount);
    } else {
      await unLend(selectedToken.poolID, amount, selectedToken.address);
    }
  } else {
    if (isBorrowMode) {
      if (isAPIMode) {
        await payInterest(
          selectedToken.poolID,
          selectedToken.address,
          amount,
          borrowID,
        );
      } else {
        await borrow(selectedToken.poolID, selectedToken.address, amount);
      }
    } else {
      await repay(
        selectedToken.poolID,
        selectedToken.address,
        amount,
        borrowID,
      );
    }
  }
  window.location.reload();
};

export const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  const timestamp = Number(
    transaction.tags.find((tag) => tag.name === "timestamp")?.value,
  );
  const action =
    transaction.tags.find((tag) => tag.name === "X-Action")?.value ||
    transaction.tags.find((tag) => tag.name === "Action")?.value;
  const quantity = transaction.tags.find(
    (tag) => tag.name === "Quantity",
  )?.value;
  const errorTag = transaction.tags.find((tag) => tag.name === "Error");
  const errorValue = errorTag?.value;

  const tokenIDTag = transaction.tags.find((tag) => tag.name === "tokenID");
  const tokenIDTagValue = tokenIDTag?.value;
  const ticker = tokenInfo.find((token) => token.address === tokenIDTagValue);

  const statusCircleColor = getStatusCircleColor(errorValue);
  const statusTooltip = getStatusTooltip(errorValue);

  let statusText;
  if (errorValue === "false") {
    statusText = "Success";
  } else if (errorValue === undefined) {
    statusText = "Pending";
  } else {
    statusText = "Failed";
  }

  return (
    <li
      key={transaction.id}
      className={styles.transactionItem}
      onClick={() => openTransactionTable(transaction.id)}
    >
      <span className={styles.transactionItemSpan}>
        {formatDate(timestamp)}
      </span>
      <div className={`${styles.transactionItemAction}`}>{action}</div>
      <span className={styles.transactionItemSpan}>
        {(Number(quantity) / 1000000000000).toLocaleString()} {ticker?.ticker}
      </span>
      <div className={styles.transactionItemStatusContainer}>
        <span className={styles.transactionItemSpan} style={{ margin: "0" }}>
          {statusText}
        </span>
        <span className={styles.statusCircleContainer}>
          <div
            className={`${styles.statusCircle} ${statusCircleColor}`}
            title={statusTooltip}
          ></div>
        </span>
      </div>
    </li>
  );
};

export const handleTokenChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  params: { ticker: string; tab: string },
) => {
  const selectedToken = tokenInfo.find(
    (token) => token.ticker === event.target.value,
  );
  if (selectedToken) {
    const newUrl =
      params.tab.startsWith("deposit") || params.tab.startsWith("withdraw")
        ? `/lend/${selectedToken.ticker}/deposit`
        : `/borrow/${selectedToken.ticker}/borrow`;
    window.history.pushState(null, "", newUrl);
    window.location.reload();
  }
};

export const maxBalance = (
  setAmount: React.Dispatch<React.SetStateAction<number>>,
  selectedTokenBalance: number,
) => {
  setAmount(Number(selectedTokenBalance.toLocaleString().replace(/,/g, "")));
};
