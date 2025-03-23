import React from 'react';
import styles from './TokenFiltersContainer.module.css';
import TokenFilter from '../TokenFilter';

interface TokenInfo {
  ticker: string;
  icon: string;
}

interface TokenFiltersContainerProps {
  receiveTokens: TokenInfo[];
  sendTokens: TokenInfo[];
  selectedReceiveToken: TokenInfo;
  selectedSendToken: TokenInfo;
  showReceiveDropdown: boolean;
  showSendDropdown: boolean;
  toggleReceiveDropdown: () => void;
  toggleSendDropdown: () => void;
  setSelectedReceiveToken: (token: TokenInfo) => void;
  setSelectedSendToken: (token: TokenInfo) => void;
  setShowReceiveDropdown: (show: boolean) => void;
  setShowSendDropdown: (show: boolean) => void;
}

const TokenFiltersContainer: React.FC<TokenFiltersContainerProps> = ({
  receiveTokens,
  sendTokens,
  selectedReceiveToken,
  selectedSendToken,
  showReceiveDropdown,
  showSendDropdown,
  toggleReceiveDropdown,
  toggleSendDropdown,
  setSelectedReceiveToken,
  setSelectedSendToken,
  setShowReceiveDropdown,
  setShowSendDropdown,
}) => {
  return (
    <div className={styles.filterContainer}>
      <TokenFilter
        label="Send"
        selectedToken={selectedSendToken}
        tokens={sendTokens}
        showDropdown={showSendDropdown}
        toggleDropdown={toggleSendDropdown}
        onSelectToken={(token) => {
          setSelectedSendToken(token);
          setShowSendDropdown(false);
        }}
      />
      <TokenFilter
        label="Receive"
        selectedToken={selectedReceiveToken}
        tokens={receiveTokens}
        showDropdown={showReceiveDropdown}
        toggleDropdown={toggleReceiveDropdown}
        onSelectToken={(token) => {
          setSelectedReceiveToken(token);
          setShowReceiveDropdown(false);
        }}
      />
    </div>
  );
};

export default TokenFiltersContainer;