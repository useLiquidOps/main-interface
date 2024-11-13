"use client";
import styles from "./Supply.module.css";
import Header from "@/components/Header/Header";
import Image from "next/image";
import ActionTab from "@/components/ActionTab/ActionTab";
import Link from "next/link";
import Market from "../Market/Market";

const Supply: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  return (
    <div className={styles.page}>
      <Header mode="supply" currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <Link href={`/${ticker}`} className={styles.titleWrapper}>
            <Image
              src="/icons/back.svg"
              alt="Back"
              width={20}
              height={20}
              className={styles.backIcon}
            />
            <h2 className={styles.title}>Supply assets</h2>
          </Link>

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <ActionTab ticker={ticker} mode="supply" />
            </div>
            <div className={styles.rightColumn}>
              <Market ticker={ticker} extraData={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supply;
