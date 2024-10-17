import React, { useState, useRef, useEffect } from "react";
import styles from "./Connect.module.css";
import Account from "arweave-account";

const Connect: React.FC = () => {
  const connected = true; // TODO remove when arwkit fixed
  const address = "psh5nUh3VF22Pr8LoV1K2blRNOOnoVH0BbZ85yRick"; // TODO replace with actual address when arwkit fixed
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      console.error("Error disconnecting wallet:", error);
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
            alt="Connected"
            className={styles.connectImage}
          />
          {isOpen && (
            <div className={styles.tooltip}>
              <button onClick={handleLogout}>Logout</button>
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
