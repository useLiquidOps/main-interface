import React from "react";
import styles from "./ClearCache.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { del } from "idb-keyval";

const ClearCache = () => {
  const queryClient = useQueryClient();

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
