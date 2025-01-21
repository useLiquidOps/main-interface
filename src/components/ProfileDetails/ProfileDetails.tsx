import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ProfileDetails.module.css";
import { useUpdateAOProfile } from "@/hooks/data/useUpdateAOProfile";

interface ProfileDetailsProps {
  profile: {
    thumbnail?: string;
    username?: string;
    profileId?: string;
  };
  isProfileLoading: boolean;
  address: string;
  isCopied: boolean;
  onCopy: (text: string) => void;
}

const MAX_USERNAME_LENGTH = 12;

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profile,
  isProfileLoading,
  address,
  isCopied,
  onCopy,
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [inputWidth, setInputWidth] = useState("auto");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  const { createProfile, updateProfile, isCreating, isUpdating } = useUpdateAOProfile();

  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(`${width}px`);
    }
  }, [newUsername]);

  useEffect(() => {
    setNewUsername(profile?.username || "");
  }, [profile?.username]);

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 5)}...${addr.slice(-5)}`;

  const formatUsername = (username: string) => {
    return username.length > MAX_USERNAME_LENGTH 
      ? `${username.slice(0, MAX_USERNAME_LENGTH)}...`
      : username;
  };

  const handleImageClick = () => {
    if (!profile?.username) {
      alert("Please set a username first before uploading a profile picture.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPendingImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = async () => {
    if (!pendingImage) return;

    const baseData = {
      userName: profile?.username || "",
      displayName: profile?.username || "",
      description: "",
      thumbnail: pendingImage,
    };

    try {
      // Only use updateProfile since we require a username first
      if (!profile?.username) return;
      
      if (profile.profileId) {
        await updateProfile({
          ...baseData,
          profileId: profile.profileId
        });
      } else {
        await createProfile(baseData);
      }
      setPendingImage(null);
    } catch (error) {
      console.error("Failed to update profile image:", error);
    }
  };

  const handleUsernameConfirm = async () => {
    if (!newUsername.trim()) return;

    try {
      if (profile?.profileId) {
        await updateProfile({
          userName: newUsername.slice(0, MAX_USERNAME_LENGTH),
          displayName: newUsername.slice(0, MAX_USERNAME_LENGTH),
          description: "",
          thumbnail: profile.thumbnail || "/icons/user.svg",
          profileId: profile.profileId
        });
      } else {
        await createProfile({
          userName: newUsername.slice(0, MAX_USERNAME_LENGTH),
          displayName: newUsername.slice(0, MAX_USERNAME_LENGTH),
          description: "",
          thumbnail: "/icons/user.svg"
        });
      }
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  const handleUsernameClick = () => {
    if (!isProfileLoading) {
      setIsEditingUsername(true);
    }
  };

  return (
    <div className={styles.profileDetails}>
      <div className={styles.profileImageContainer}>
        <img
          src={
            pendingImage || 
            (!isProfileLoading && profile?.thumbnail
              ? `https://arweave.net/${profile.thumbnail}`
              : "/icons/user.svg")
          }
          alt="Profile image"
          width={42}
          height={42}
          className={styles.profileImage}
          onClick={handleImageClick}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/icons/user.svg";
          }}
          style={{ cursor: profile?.username ? 'pointer' : 'default' }}
        />
        {(isCreating || isUpdating) && (
          <div className={styles.imageOverlay}>
            <span className={styles.loadingSpinner} />
          </div>
        )}
        {pendingImage && !isCreating && !isUpdating && (
          <div className={styles.confirmImageOverlay} onClick={handleConfirmImage}>
            <Image
              src="/icons/check.svg"
              alt="Confirm"
              width={16}
              height={16}
            />
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className={styles.hidden}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className={styles.profileName}>
        {isEditingUsername ? (
          <div className={styles.usernameEditContainer}>
            <span 
              ref={measureRef} 
              className={styles.measureText}
            >
              {newUsername || "Set username"}
            </span>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value.slice(0, MAX_USERNAME_LENGTH))}
              className={styles.usernameInput}
              autoFocus
              placeholder={!profile?.username ? "Set username" : ""}
              style={{ width: inputWidth }}
              maxLength={MAX_USERNAME_LENGTH}
            />
            {newUsername !== profile?.username && newUsername.trim() !== "" && (
              <button 
                className={styles.confirmUsernameButton}
                onClick={handleUsernameConfirm}
              >
                <Image
                  src="/icons/check.svg"
                  alt="Confirm"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        ) : (
          <p 
            className={styles.userName}
            onClick={handleUsernameClick}
          >
            {!isProfileLoading && profile?.username
              ? formatUsername(profile.username)
              : "Click to create profile"}
          </p>
        )}
        <div className={styles.addressContainer}>
          <span>{shortenAddress(address)}</span>
          <button
            className={styles.copyButton}
            onClick={() => onCopy(address)}
          >
            <Image
              src={isCopied ? "/icons/copyActive.svg" : "/icons/copy.svg"}
              alt="Copy"
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;