import { formatTMB } from "@/components/utils/utils";
import { tokens } from "liquidops";
import { Quantity } from "ao-tokens";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { useGetResult } from "@/hooks/LiquidOpsData/useGetResult";
import { GetResultRes } from "liquidops";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";
import styles from "./TransactionItem.module.css";
import Tooltip from "@/components/Tooltip/Tooltip";

export interface Transaction {
  id: string;
  tags: Record<string, string>;
  block: {
    timestamp: number;
  };
}

type TransactionAction = "lend" | "unLend" | "borrow" | "repay";

// Map of analytics tags to their display and action values
const TRANSACTION_TYPES = {
  Borrow: { display: "Borrowed", action: "borrow" as TransactionAction },
  Repay: { display: "Repaid", action: "repay" as TransactionAction },
  Lend: { display: "Lent", action: "lend" as TransactionAction },
  UnLend: { display: "Unlent", action: "unLend" as TransactionAction },
};

// Map of result status to icon paths
const STATUS_ICONS = {
  pending: "/icons/activity/pending.svg",
  success: "/icons/activity/true.svg",
  failure: "/icons/activity/false.svg",
};

export const TransactionItem = ({ tx }: { tx: Transaction }) => {
  const { data: supportedTokens } = useSupportedTokens();

  const getTokenDenomination = (tokenAddress: string) => {
    const token = supportedTokens?.find((t) => {
      const ticker = Object.entries(tokens)
        .find(([_, addr]) => addr === tokenAddress)?.[0]
        ?.toLowerCase();
      return ticker === t.ticker.toLowerCase();
    });
    return token?.denomination ?? 0n;
  };

  const getTokenTicker = (tokenAddress: string) => {
    return (
      Object.entries(tokens)
        .find(([_, address]) => address === tokenAddress)?.[0]
        ?.toLowerCase() || "unknown"
    );
  };

  const getTransactionInfo = (tags: Transaction["tags"]) => {
    const analyticsTag = tags["Analytics-Tag"];
    if (!analyticsTag) {
      throw new Error(
        "Unable to find Analytics-Tag, tags: " + JSON.stringify(tags),
      );
    }

    // Type guard to ensure analyticsTag is a valid key
    if (!(analyticsTag in TRANSACTION_TYPES)) {
      throw new Error("Unable to find transaction tag action: " + analyticsTag);
    }

    return TRANSACTION_TYPES[analyticsTag as keyof typeof TRANSACTION_TYPES];
  };

  const getResultStatusIcon = (status: GetResultRes | undefined) => {
    if (status === undefined) {
      return null;
    }

    if (status === "pending") {
      return STATUS_ICONS.pending;
    }

    return status ? STATUS_ICONS.success : STATUS_ICONS.failure;
  };

  const { display, action } = getTransactionInfo(tx.tags);
  const tokenTicker = getTokenTicker(tx.tags["token"]);
  const activityIcon = `/tokens/${tokenTicker}.svg`;

  const { data: resultData, isLoading: resultIsLoading } = useGetResult(
    tx.id,
    tx.tags["token"],
    action,
  );

  const resultStatus = resultIsLoading ? undefined : resultData;
  const statusIcon = getResultStatusIcon(resultStatus);

  let toolTipText;
  if (resultStatus === true) {
    toolTipText = "Success";
  } else if (resultStatus === false) {
    toolTipText = "Failed";
  } else if (resultStatus === "pending") {
    toolTipText = "Pending";
  } else {
    toolTipText = "Loading";
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
          <Image src={activityIcon} alt="activity" width={25} height={25} />

          <div className={styles.actionDetailsContainer}>
            <div className={styles.actionDetails}>
              <p>{display}</p>
              <p>
                {formatTMB(
                  new Quantity(
                    tx.tags["Quantity"],
                    getTokenDenomination(tx.tags["token"]),
                  ),
                )}
              </p>
            </div>

            <p className={styles.timestamp}>
              {new Date(Number(tx.tags["timestamp"])).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <Tooltip text={toolTipText} fontSize="12px">
            {statusIcon ? (
              <Image
                src={statusIcon}
                alt={`Status: ${resultStatus}`}
                width={25}
                height={25}
              />
            ) : (
              <Spinner />
            )}
          </Tooltip>
        </div>
      </div>
    </a>
  );
};
