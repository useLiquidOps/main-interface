"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DeprecatedTokensContextType {
  showDeprecated: boolean;
  toggleDeprecated: () => void;
  setShowDeprecated: (show: boolean) => void;
}

const DeprecatedTokensContext = createContext<
  DeprecatedTokensContextType | undefined
>(undefined);

export const useDeprecatedTokens = () => {
  const context = useContext(DeprecatedTokensContext);
  if (!context) {
    throw new Error(
      "useDeprecatedTokens must be used within a DeprecatedTokensProvider",
    );
  }
  return context;
};

interface DeprecatedTokensProviderProps {
  children: ReactNode;
}

export const DeprecatedTokensProvider: React.FC<
  DeprecatedTokensProviderProps
> = ({ children }) => {
  const [showDeprecated, setShowDeprecated] = useState(false);

  const toggleDeprecated = () => {
    setShowDeprecated((prev) => !prev);
  };

  return (
    <DeprecatedTokensContext.Provider
      value={{
        showDeprecated,
        toggleDeprecated,
        setShowDeprecated,
      }}
    >
      {children}
    </DeprecatedTokensContext.Provider>
  );
};
