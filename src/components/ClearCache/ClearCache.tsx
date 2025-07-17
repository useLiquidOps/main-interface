import React from "react";
import styles from "./ClearCache.module.css";
import { del } from "idb-keyval";

const ClearCache = () => {
  return (
    <button
      className={styles.button}
      onClick={async () => {
        await del("REACT_QUERY_OFFLINE_CACHE");
        window.location.reload();
      }}
    >
      Refresh site
    </button>
  );
};

export default ClearCache;
