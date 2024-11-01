"use client";
import styles from "./faucet.module.css";
import Header from "../../../components/Header/Header";
import Market from "../../[ticker]/Market/Market";
import MintTokens from "./MintTokens/MintTokens";

const Faucet = ({ params }: { params: { ticker: string; tab: string } }) => {
  const currentToken = params.ticker as string;
  return (
    <div className={styles.page}>
      <Header faucet={true} currentToken={currentToken} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <MintTokens ticker={currentToken} />
            </div>
            <div className={styles.rightColumn}>
              <Market />
            </div>
          </div>

          <div />
        </div>
      </div>
    </div>
  );
};

export default Faucet;
