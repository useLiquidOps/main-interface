import React from "react";
import styles from "./DropDown.module.css";
import Image from "next/image";

interface DropdownButtonProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  flipArrow?: boolean
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  isOpen,
  onToggle,
  flipArrow
}) => {
  const iconSrc = flipArrow 
    ? "/icons/dropdownLeftRight.svg" 
    : "/icons/dropdownUpDown.svg";
    
  return (
    <button
      className={`${styles.dropdownButton} ${isOpen ? styles.open : ""}`}
      onClick={onToggle}
    >
      <Image
        src={iconSrc}
        alt="Dropdown"
        width={10}
        height={5}
        className={styles.dropdownIcon}
      />
    </button>
  );
};

export default DropdownButton;