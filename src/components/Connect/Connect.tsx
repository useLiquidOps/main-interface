import React, { useState, useEffect } from "react";
import styles from "./Connect.module.css";
import Account from "arweave-account";
import { useClickOutside } from "../utils/utils";
import DropdownButton from "../DropDown/DropDown";
import Image from "next/image";

interface TokenInfo {
  symbol: string;
  balance: number;
  icon: string;
}

const Connect: React.FC = () => {
  const connected = true; // TODO remove when arwkit fixed
  const address = "psh5nUh3VF22Pr8LoV1K2blRNOOnoVH0BbZ85yRick"; // TODO replace with actual address when arwkit fixed
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const { ref: dropdownRef } = useClickOutside<HTMLDivElement>(() => {
    closeDropdown();
  });

  const closeDropdown = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

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
      closeDropdown();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      setIsVisible(true);
      setIsOpen(true);
    } else {
      closeDropdown();
    }
  };

  return (
    <div className={styles.connectContainer} ref={dropdownRef}>
      {connected && address ? (
        <div className={styles.profileContainer}>
          <DropdownButton isOpen={isOpen} onToggle={toggleDropdown} />
          <Image
            src={profile?.profile?.avatarURL || "/icons/user.svg"}
            alt="Profile image"
            width={32}
            height={32}
            className={styles.connectImage}
          />
          {isVisible && (
            <div
              className={`${styles.dropdown} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
            >
              <div className={styles.addressContainer}>
                <span>{shortenAddress(address)}</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(address)}
                >
                  <Image
                    src="/icons/copy.svg"
                    alt="Copy"
                    width={14}
                    height={14}
                  />
                </button>
              </div>

              {tokens.map((token, index) => (
                <div key={index} className={styles.balance}>
                  <Image
                    src={token.icon}
                    alt={token.symbol}
                    width={24}
                    height={24}
                  />
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
