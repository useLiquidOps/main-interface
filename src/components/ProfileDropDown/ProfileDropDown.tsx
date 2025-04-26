"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProfileDropDown.module.css";
import ActivityList from "../ActivityList/ActivityList";
import { useTransactions } from "@/hooks/LiquidOpsData/useTransactions";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import ClearCache from "../ClearCache/ClearCache";
import { shortenAddress } from "@/utils/wallets";
import Link from "next/link";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  isCopied: boolean;
  onCopy: (text: string) => void;
  onLogout: () => void;
  isProfileLoading: boolean;
  profile: {
    thumbnail?: string;
    username?: string;
    displayName?: string;
  };
}

const ProfileDropDown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  address,
  isCopied,
  onCopy,
  onLogout,
  isProfileLoading,
  profile,
}) => {
  const { data: transactions, isLoading } = useTransactions();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // If switching from edit mode to view mode, save changes
      console.log("Updated profile:", {
        username: newUsername || profile?.username || "Anonymous",
        profileImage: newProfileImage,
      });
      setIsEditMode(false);
    } else {
      // If switching to edit mode, initialize the edit form
      setNewUsername(profile?.username || "");
      // Don't reset preview image to allow for continuous editing
      setIsEditMode(true);
    }
  };

  // Get the current profile image URL
  const getProfileImage = () => {
    if (previewImage) return previewImage;
    if (profile?.thumbnail) return `https://arweave.net/${profile.thumbnail}`;
    return "/icons/user.svg";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.dropdown}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.profile}>
            <div className={styles.titleContainer}>
              <p className={styles.title}>Account</p>
              <button className={styles.close} onClick={onClose}>
                <Image
                  src="/icons/close.svg"
                  height={9}
                  width={9}
                  alt="Close"
                />
              </button>
            </div>

            <div className={styles.profileHeader}>
              <div className={styles.profileDetails}>
                <div
                  className={`${styles.profileImageContainer} ${isEditMode ? styles.editModeImage : ""}`}
                >
                  {isProfileLoading ? (
                    <SkeletonLoading className="h-full w-full rounded-full" />
                  ) : (
                    <>
                      <img
                        src={getProfileImage()}
                        alt="Profile image"
                        width={42}
                        height={42}
                        className={styles.profileImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/icons/user.svg";
                        }}
                      />
                      {isEditMode && !previewImage && (
                        <label className={styles.uploadOverlay}>
                          <Image
                            src="/icons/upload.svg"
                            width={20}
                            height={20}
                            alt="Upload"
                          />
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                      {isEditMode && previewImage && (
                        <label className={styles.editModeContainer}>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </>
                  )}
                </div>
                <div className={styles.profileName}>
                  <p className={styles.userName}>
                    {isProfileLoading ? (
                      <SkeletonLoading
                        style={{ width: "100px", height: "17px" }}
                      />
                    ) : (
                      profile.displayName
                    )}
                  </p>

                  <div className={styles.addressContainer}>
                    <span>{shortenAddress(address)}</span>
                    <button
                      className={styles.copyButton}
                      onClick={() => onCopy(address)}
                    >
                      <Image
                        src={
                          isCopied ? "/icons/copyActive.svg" : "/icons/copy.svg"
                        }
                        alt="Copy"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <button className={styles.logoutButton} onClick={onLogout}>
                <Image
                  src="/icons/logout.svg"
                  alt="logout"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            <div className={styles.profileButtons}>
              <Link
                className={styles.editProfileButton}
                href={`https://bazar.arweave.dev/#/profile/${address}/assets/`}
                target="_blank"
              >
                Edit profile
              </Link>
              <ClearCache />
            </div>
          </div>

          <ActivityList
            transactions={transactions ?? []}
            isLoading={isLoading}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropDown;

const slideVariants = {
  hidden: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};
