import React, { useState, useEffect } from "react";
import styles from "./Connect.module.css";
import Account from "arweave-account";
import { useClickOutside } from "../utils/utils";

interface TokenInfo {
  symbol: string;
  balance: number;
  icon: string;
}

const Connect: React.FC = () => {
  const connected = true; // TODO remove when arwkit fixed
  const address = "psh5nUh3VF22Pr8LoV1K2blRNOOnoVH0BbZ85yRick"; // TODO replace with actual address when arwkit fixed
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const tokens: TokenInfo[] = [
    { symbol: "DAI", balance: 1736.55, icon: "/tokens/DAI.svg" }, // TODO: render from somewhere
    { symbol: "qAR", balance: 3745.62, icon: "/tokens/qAR.svg" }, // TODO: render from somewhere
    { symbol: "stETH", balance: 394.11, icon: "/tokens/stETH.svg" }, // TODO: render from somewhere
  ];

  const shortenAddress = (addr: string): string => {
    return `${addr.slice(0, 3)}...${addr.slice(-3)}`;
  };

  const formatBalance = (balance: number): string => {
    return balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (address) {
        const account = new Account({
          cacheIsActivated: true,
          cacheSize: 100,
          cacheTime: 60,
        });
        try {
          const profileData = await account.get(address);
          console.log(profileData);
          setProfile(profileData);
        } catch (error) {
          //   console.error("Error fetching profile:", error); TODO uncomment when bazar profile ready
        }
      }
    };

    fetchProfile();
  }, [address]);

  const handleConnectClick = async () => {
    try {
      console.log("login");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("logout");
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.connectContainer} ref={dropdownRef}>
      {connected && address ? (
        <div className={styles.profileContainer}>
          <button className={styles.dropdownButton} onClick={toggleDropdown}>
            <img
              src="/icons/dropdown.svg"
              alt="Dropdown"
              className={styles.dropdownIcon}
            />
          </button>
          <img
            src={profile?.profile?.avatarURL || "/icons/user.png"}
            alt="Profile image"
            className={styles.connectImage}
          />
          {isOpen && (
            <div className={styles.dropdown}>
              <div className={styles.addressContainer}>
                <span>{shortenAddress(address)}</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(address)}
                >
                  <img src="/icons/copy.svg" alt="Copy" />
                </button>
              </div>

              {tokens.map((token, index) => (
                <div key={index} className={styles.balance}>
                  <img src={token.icon} alt={token.symbol} />
                  <span>
                    {formatBalance(token.balance)} {token.symbol}
                  </span>
                </div>
              ))}

              <div className={styles.logoutButtonContainer}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className={styles.connectButton} onClick={handleConnectClick}>
          Login
        </button>
      )}
    </div>
  );
};

export default Connect;
