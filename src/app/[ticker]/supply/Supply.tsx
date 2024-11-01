"use client";
import styles from "./Supply.module.css";
import Header from "@/components/Header/Header";
import Image from "next/image";
import ActionTab from "@/components/ActionTab/ActionTab";
import Link from "next/link";
import PositionSummary from "../PositionSummary/PositionSummary";

const Supply: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  return (
    <div className={styles.page}>
      <Header home={true} currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <Link href={`/${ticker}`} className={styles.titleWrapper}>
            <Image
              src="/icons/back.svg"
              alt="Back"
              width={24}
              height={24}
              className={styles.backIcon}
            />
            <h2 className={styles.title}>Supply assets</h2>
          </Link>

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <ActionTab ticker={ticker} mode="supply" />
            </div>
            <div className={styles.rightColumn}>
              {/* <PositionSummary /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supply;
