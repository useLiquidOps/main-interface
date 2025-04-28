"use client";
import React from "react";
import styles from "./ticker.module.css";
import Header from "../../components/Header/Header";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import { tokens } from "liquidops";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";
import Link from "next/link";
import Image from "next/image";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import APRInfo from "./APRInfo/APRInfo";

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
          </div>

          <div className={styles.grid}>
            <APRInfo ticker={ticker} />
            <APRInfo ticker={ticker} />
            <Market ticker={ticker} />
            <PositionSummary ticker={ticker} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ticker;
