"use client";
import React from "react";
import styles from "./ticker.module.css";
import Header from "../../components/Header/Header";
import PositionSummary from "./PositionSummary/PositionSummary";
import { tokens } from "liquidops";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Link from "next/link";
import Image from "next/image";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import APRInfo from "./APRInfo/APRInfo";
import TickerInfo from "./TickerInfo/TickerInfo";
import { useAccountTab } from "@/components/Connect/accountTabContext";

const Ticker = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;

  const { data: supportedTokens = [] } = useSupportedTokens();
  const tokenData = supportedTokens.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const tokenTickers = Object.keys(tokens);

  if (!tokenTickers.includes(ticker.toUpperCase())) {
    redirect("/404");
  }

  const { setAccountTab } = useAccountTab();

  const handleOpenAccountTab = async () => {
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.length > 0) {
      setAccountTab(true);
    } else {
      alert("Please connect your wallet by logging in.");
    }
  };

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.titleWrapper}>
            <Link href="/" className={styles.titleLink}>
              <Image
                src="/icons/back.svg"
                alt="Back"
                width={24}
                height={24}
                className={styles.backIcon}
              />
              <h2 className={styles.title}>{tokenData?.name}</h2>
            </Link>
            <button className={styles.viewTxns} onClick={handleOpenAccountTab}>
              View transactions
            </button>
          </div>

          <div className={styles.topContainer}>
            <TickerInfo ticker={ticker} />
            <APRInfo ticker={ticker} />
          </div>

          <div className={styles.grid}>
            <PositionSummary ticker={ticker} />
            <div></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ticker;
