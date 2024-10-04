import styles from "./ConnectButton.module.css";
import { useState, useEffect } from "react";

const ConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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
            setWalletAddress(address);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const handleConnectClick = async () => {
    // @ts-ignore (Add wallet kit later)
    if (!window.arweaveWallet) {
      alert("Please download ArConnect.io");
    } else {
      if (walletAddress) {
        // @ts-ignore (Add wallet kit later)
        await window.arweaveWallet.disconnect();
        setWalletAddress(null);
        window.location.reload();
      } else {
        // @ts-ignore (Add wallet kit later)
        await window.arweaveWallet.connect([
          "ACCESS_ADDRESS",
          "SIGN_TRANSACTION",
        ]);
        // @ts-ignore (Add wallet kit later)
        const address = await window.arweaveWallet.getActiveAddress();
        setWalletAddress(address);
        window.location.reload();
      }
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 6) {
      return address;
    }
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <button className={styles.connectButton} onClick={handleConnectClick}>
      {walletAddress ? formatAddress(walletAddress) : "Connect"}
    </button>
  );
};

export default ConnectButton;
