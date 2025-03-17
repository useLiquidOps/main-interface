"use client";
import styles from "./faucet.module.css";
import Header from "../../../components/Header/Header";
import Market from "../../[ticker]/Market/Market";
import MintTokens from "@/components/MintTokens/MintTokens";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

const Faucet = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;
  return (
    <div className={styles.page}>
      <LoadingScreen
        loadingState="loading"
        action="lending"
        tokenTicker="qAR"
        amount="132"
        txId="12121"
      />
      {/* <Banner />
      <Header mode="faucet" currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <MintTokens ticker={ticker} />
            </div>
            <div className={styles.rightColumn}>
              <Market ticker={ticker} />
            </div>
          </div>

          <div />
        </div>
      </div>
      <Footer /> */}
    </div>
  );
};

export default Faucet;
