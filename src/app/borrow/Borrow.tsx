"use client";
import React, { useState, useEffect } from "react";
import styles from "./Borrow.module.css";
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
import { getCurrentLoans } from "@/utils/ao/getData/getCurrentLoans";
import { loanItem } from "@/utils/ao/getData/getCurrentLoans";

const Borrow = ({ params }: { params: { ticker: string; tab: string } }) => {
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>();
  const [recentBorrowTransactions, setRecentBorrowTransactions] = useState<
    Transaction[]
  >([]);
  const [recentRepayTransactions, setRecentRepayTransactions] = useState<
    Transaction[]
  >([]);
  const [recentInterestTransactions, setRecentInterestTransactions] = useState<
    Transaction[]
  >([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [chartRange, setChartRange] = useState<string>("1D");
  const [allAPYs, setAllAPYs] = useState<APY[]>([]);
  const [isBorrowMode, setIsBorrowMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAPIMode, setIsAPIMode] = useState(false);
  const [allLiquidity, setAllLiquidity] = useState<liquidityItem[]>([]);
  const [allBalances, setAllBalances] = useState<balanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowedAssets, setBorrowedAssets] = useState<loanItem[]>([]);
  const [borrowID, setBorrowID] = useState<string>("");
  const [balancesLoaded, setBalancesLoaded] = useState(false);

  const handleAPIToggle = (isInterest: boolean) => {
    setIsAPIMode(isInterest);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      // @ts-ignore (Add wallet kit later)
      if (window.arweaveWallet) {
        try {
          // @ts-ignore (Add wallet kit later)
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
                  const borrowTransactions = await getRecentTransactions(
                    address,
                    "Borrow",
                    selectedToken.poolID,
                    "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
                  );
                  setRecentBorrowTransactions(borrowTransactions);

                  const repayTransactions = await getRecentTransactions(
                    address,
                    "Repay",
                    selectedToken.poolID,
                    "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
                  );
                  setRecentRepayTransactions(repayTransactions);

                  const interestTransactions = await getRecentTransactions(
                    address,
                    "Pay-Interest",
                    selectedToken.poolID,
                    "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
                  );
                  setRecentInterestTransactions(interestTransactions);

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
                  const borrowedAssetsReq = await getCurrentLoans(
                    borrowTransactions,
                    repayTransactions,
                  );
                  setBorrowedAssets(borrowedAssetsReq);
                  setBalancesLoaded(true);
                }
              };
              fetchData();
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setIsLoading(false);
        }
      }
    };
    checkWalletConnection();
  }, [selectedToken, chartRange, isLoggedIn]);

  useEffect(() => {
    if (params.tab === "borrow") {
      setIsBorrowMode(true);
    } else if (params.tab === "interest") {
      setIsBorrowMode(false);
      setIsAPIMode(true);
    } else {
      setIsBorrowMode(false);
      setIsAPIMode(false);
    }
  }, [params.tab]);

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
  };

  const handleTabChange = (mode: boolean) => {
    setIsBorrowMode(mode);
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
        linkType="borrow"
        tokenAPYs={allAPYs}
        allLiquidity={allLiquidity}
      />
      <div>
        <Panel
          className={styles.depositFunction}
          selectedToken={selectedToken}
          selectedTokenPrice={price}
          allBalances={allBalances}
          amount={borrowAmount}
          setAmount={setBorrowAmount}
          recentLendTransactions={[]}
          recentUnLendTransactions={[]}
          recentBorrowTransactions={recentBorrowTransactions}
          recentRepayTransactions={recentRepayTransactions}
          recentInterestTransactions={recentInterestTransactions}
          isLendMode={false}
          isBorrowMode={isBorrowMode}
          handleTabChange={handleTabChange}
          isAPIMode={isAPIMode}
          handleAPIToggle={handleAPIToggle}
          tokenAPYs={allAPYs}
          params={params}
          borrowID={borrowID}
          setBorrowID={setBorrowID}
        />
        <ProtocolBalances
          allBalances={allBalances}
          isLendMode={false}
          borrowedAssets={borrowedAssets}
          depositedAssets={[]}
        />
      </div>
    </div>
  );
};

export default Borrow;
