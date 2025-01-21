import React from "react";
import styles from "./SearchInput.module.css";
import Image from "next/image";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelText?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  labelText = "Search",
}) => {
  return (
    <div className={styles.searchInputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={labelText}
          className={styles.searchInput}
        />
        <div className={styles.searchIconContainer}>
          <Image src="/icons/search.svg" alt="Search" width={16} height={16} />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
