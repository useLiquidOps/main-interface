import React from "react";
import styles from "./TokenInfo.module.css";
import { Token } from "@/utils/ao/utils/tokenInfo";
import { PriceData } from "@/utils/ao/getData/getPriceData";
import MainToken from "../MainToken/MainToken";
import OtherTokens from "../OtherTokens/OtherTokens";
import { APY } from "@/utils/ao/getData/getAllAPYs";
import { liquidityItem } from "@/utils/ao/getData/getAllLiquidity";

interface TokenInfoProps {
  selectedToken: Token | undefined;
  price: number | undefined;
  priceData: PriceData[];
  chartRange: string;
  setChartRange: React.Dispatch<React.SetStateAction<string>>;
  tokenInfo: Token[];
  handleTokenClick: (token: Token) => void;
  linkType: "lend" | "borrow";
  tokenAPYs: APY[];
  allLiquidity: liquidityItem[];
}

const TokenInfo = ({
  selectedToken,
  price,
  priceData,
  chartRange,
  setChartRange,
  tokenInfo,
  handleTokenClick,
  linkType,
  tokenAPYs,
  allLiquidity,
}: TokenInfoProps) => {
  const mainTokenAPY = tokenAPYs.find(
    (token) => token.address === selectedToken?.address,
  )?.apy;

  return (
    <div className={styles.mainTokenContainer}>
      <MainToken
        selectedToken={selectedToken}
        price={price}
        priceData={priceData}
        chartRange={chartRange}
        setChartRange={setChartRange}
        mainTokenAPY={mainTokenAPY}
      />
      <OtherTokens
        tokenInfo={tokenInfo}
        selectedToken={selectedToken}
        handleTokenClick={handleTokenClick}
        linkType={linkType}
        tokenAPYs={tokenAPYs}
        allLiquidity={allLiquidity}
      />
    </div>
  );
};

export default TokenInfo;
