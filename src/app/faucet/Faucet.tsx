"use client";
import React, { useState, useEffect } from "react";
import styles from "./Faucet.module.css";
import { tokenInfo } from "@/utils/ao/utils/tokenInfo";
import { getBalance } from "@/utils/ao/getData/getBalance";
import { api } from "@/utils/api";
import { FaucetPageProps } from "./[ticker]/page";
import { useRouter } from "next/navigation";

const Faucet = ({ params }: FaucetPageProps) => {
  const router = useRouter();
  const { ticker } = params;

  const [selectedTokenObj, setSelectedTokenObj] = useState(
    tokenInfo.find((token) => token.ticker === ticker) || tokenInfo[0],
  );
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
            setWalletAddress(address);

            if (address && selectedTokenObj) {
              const fetchedBalance = await getBalance(
                address,
                selectedTokenObj.address,
              );
              setBalance(fetchedBalance);
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
  }, [selectedTokenObj]);

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokenInfo.find(
      (token) => token.ticker === event.target.value,
    );
    if (selectedToken) {
      setSelectedTokenObj(selectedToken);
      router.push(`/faucet/${selectedToken.ticker}`);
    }
  };

  const handleClaimClick = async () => {
    try {
      const claimRequest = (
        await api.post("/faucet", {
          tokenAddress: selectedTokenObj.address,
          walletAddress,
        })
      ).data;

      if (claimRequest.status) {
        alert(
          `You have successfully claimed 10 ${selectedTokenObj.ticker} testnet tokens.`,
        );
        window.location.reload();
      } else {
        alert(
          `Claim failed. Please wait ${claimRequest.remainingHours.toLocaleString()} hours before claiming again.`,
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error posting faucet request.");
    }
  };

  if (isLoading) {
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
      <div className={styles.faucetContainer}>
        <div className={styles.greyContainer}>
          <div className={styles.toggleToken}>
            <img
              className={styles.toggleTokenIcon}
              src={selectedTokenObj?.iconPath}
              alt={selectedTokenObj?.name}
            />
            <select
              id="token"
              value={selectedTokenObj?.ticker}
              onChange={handleTokenChange}
              className={styles.selectBox}
            >
              {tokenInfo.map((token) => (
                <option key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.balanceContainer}>
            <img src="/images/wallet-icon.svg" alt="Wallet Icon" />
            <p>{(balance / 1000000000000).toLocaleString()}</p>
          </div>
        </div>

        <button className={styles.claimButton} onClick={handleClaimClick}>
          Claim
        </button>
      </div>
    </div>
  );
};

export default Faucet;
