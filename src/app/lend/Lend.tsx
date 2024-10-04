"use client";
import React, { useState, useEffect } from "react";
import styles from "./Lend.module.css";
import { tokenInfo, Token } from "@/utils/ao/utils/tokenInfo";
import { getRecentTransactions } from "@/utils/ao/getData/getRecentTransactions";
import { Transaction } from "@/utils/ao/getData/getTags";
import { getPriceData, PriceData } from "@/utils/ao/getData/getPriceData";
import TokenInfo from "@/components/Dashboard/TokenInfo/TokenInfo";
import Panel from "@/components/Dashboard/Panel/Panel";
import { getAllAPYs } from "@/utils/ao/getData/getAllAPYs";
import { APY } from "@/utils/ao/getData/getAllAPYs";
import { getPrice } from "@/utils/ao/getData/getPrice";
import ProtocolBalances from "@/components/Dashboard/ProtocolBalances/ProtocolBalances";
import { getAllLiquidity } from "@/utils/ao/getData/getAllLiquidity";
import { liquidityItem } from "@/utils/ao/getData/getAllLiquidity";
import { getAllBalances } from "@/utils/ao/getData/getAllBalances";
import { balanceItem } from "@/utils/ao/getData/getAllBalances";
import { getCurrentDeposits } from "@/utils/ao/getData/getCurrentDeposits";
import { depositItem } from "@/utils/ao/getData/getCurrentDeposits";

const Lend = ({ params }: { params: { ticker: string; tab: string } }) => {
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>();
  const [recentLendTransactions, setRecentLendTransactions] = useState<
    Transaction[]
  >([]);
  const [recentUnLendTransactions, setRecentUnLendTransactions] = useState<
    Transaction[]
  >([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [chartRange, setChartRange] = useState<string>("1D");
  const [allAPYs, setAllAPYs] = useState<APY[]>([]);
  const [isLendMode, setIsLendMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allLiquidity, setAllLiquidity] = useState<liquidityItem[]>([]);
  const [allBalances, setAllBalances] = useState<balanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowID, setBorrowID] = useState<string>("");
  const [balancesLoaded, setBalancesLoaded] = useState(false);
  const [depositedAssets, setDepositedAssets] = useState<depositItem[]>([]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      // @ts-ignore (Add wallet kit later)
      if (window.arweaveWallet) {
        try {
          // @ts-ignore (ArConnect)
          const permissions = await window.arweaveWallet.getPermissions();
          if (permissions.includes("ACCESS_ADDRESS")) {
            // @ts-ignore (Add wallet kit later)
            const address = await window.arweaveWallet.getActiveAddress();
            setIsLoggedIn(!!address);

            if (address) {
              const fetchData = async () => {
                const token = tokenInfo.find(
                  (token) => token.ticker === params.ticker,
                );
                setSelectedToken(token);
                if (selectedToken) {
                  const lendTransactions = await getRecentTransactions(
                    address,
                    "Lend",
                    selectedToken.poolID,
                    selectedToken.address,
                  );
                  setRecentLendTransactions(lendTransactions);

                  const unLendTransactions = await getRecentTransactions(
                    address,
                    "Un-Lend",
                    selectedToken.poolID,
                    selectedToken.address,
                  );
                  setRecentUnLendTransactions(unLendTransactions);

                  const filteredPriceData = getPriceData(
                    selectedToken.address,
                    chartRange,
                  );
                  setPriceData(filteredPriceData);
                  const allAPYsReq = await getAllAPYs();
                  setAllAPYs(allAPYsReq);
                  const price = await getPrice(selectedToken.address);
                  setPrice(price);
                  const getLiquidityReq = await getAllLiquidity();
                  setAllLiquidity(getLiquidityReq);
                  const getBalancesReq = await getAllBalances(address);
                  setAllBalances(getBalancesReq);
                  const depositedAssetsReq = await getCurrentDeposits(
                    lendTransactions,
                    unLendTransactions,
                  );
                  setDepositedAssets(depositedAssetsReq);
                  setBalancesLoaded(true);
                }
              };
              fetchData();
            }
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnection();
  }, [selectedToken, chartRange, isLoggedIn]);

  useEffect(() => {
    if (params.tab === "withdraw") {
      setIsLendMode(false);
    } else {
      setIsLendMode(true);
    }
  }, [params.tab]);

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
  };

  const handleTabChange = (mode: boolean) => {
    setIsLendMode(mode);
  };

  if (isLoading || !balancesLoaded) {
    return (
      <div className={styles.loadingState}>
        <img src="/icons/loading.webp" alt="loading" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.connectWalletReminder}>
        <p>Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <TokenInfo
        selectedToken={selectedToken}
        price={price}
        priceData={priceData}
        chartRange={chartRange}
        setChartRange={setChartRange}
        tokenInfo={tokenInfo}
        handleTokenClick={handleTokenClick}
        linkType="lend"
        tokenAPYs={allAPYs}
        allLiquidity={allLiquidity}
      />
      <div>
        <Panel
          className={styles.depositFunction}
          selectedToken={selectedToken}
          selectedTokenPrice={price}
          allBalances={allBalances}
          amount={depositAmount}
          setAmount={setDepositAmount}
          recentLendTransactions={recentLendTransactions}
          recentUnLendTransactions={recentUnLendTransactions}
          recentBorrowTransactions={[]}
          recentRepayTransactions={[]}
          recentInterestTransactions={[]}
          isLendMode={true}
          isBorrowMode={isLendMode}
          handleTabChange={handleTabChange}
          isAPIMode={false}
          handleAPIToggle={() => {}}
          tokenAPYs={allAPYs}
          params={params}
          borrowID={borrowID}
          setBorrowID={setBorrowID}
        />

        <ProtocolBalances
          allBalances={allBalances}
          isLendMode={true}
          borrowedAssets={[]}
          depositedAssets={depositedAssets}
        />
      </div>
    </div>
  );
};

export default Lend;
