import styles from "./LeverageRow.module.css";
import Image from "next/image";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { LeverageStrategy } from "../adapters/leverage";
import { Prices } from "@/hooks/data/useTokenPrice";
import { tickerToGeckoMap } from "@/utils/tokenMappings";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";

interface LeverageRowRowProps {
  leverage: LeverageStrategy;
  prices: Prices | undefined;
}

export const LeverageRow: React.FC<LeverageRowRowProps> = ({
  leverage,
  prices,
}) => {

  const borrowTokenStats = useProtocolStats(
    leverage.borrowToken.ticker.toUpperCase(),
  );

  const leverageTokenStats = useProtocolStats(
    leverage.leverageToken.ticker.toUpperCase(),
  );

  const geckoId = tickerToGeckoMap[leverage.borrowToken.ticker.toUpperCase()];
  const borrowTokenPrice = new Quantity(0n, 12n).fromNumber(
    prices?.[geckoId]?.usd ?? 0,
  );

  const isLoadingBorrowStats =
    borrowTokenStats.isLoading || !borrowTokenStats.data;
  const isLoadingLeverageStats =
    leverageTokenStats.isLoading || !leverageTokenStats.data;

  const totalLeverageFee = getTotalLeverageFee(
    leverageTokenStats.data?.supplyAPR ?? 0,
    borrowTokenStats.data?.info.collateralFactor ?? "0",
    borrowTokenStats.data?.borrowAPR ?? 0,
  );

  const maxLeverages = getLeverageValues({
    type: leverage.type,
    // @ts-ignore, skeleton loading logic relies on it being undef
    supplyTokenCollateralFactor: leverageTokenStats.data?.info.collateralFactor,
    // @ts-ignore, skeleton loading logic relies on it being undef
    borrowTokenCollateralFactor: borrowTokenStats.data?.info.collateralFactor,
  });

  const isLoadingMaxLeverage =
    // @ts-ignore, skeleton loading logic relies on it being undef
    isNaN(maxLeverages.baseLeverage) || isNaN(maxLeverages.maxLeverage);

  return (
    <div className={styles.leverageRowWrapper}>
      <div className={styles.leverageLaunchRow}>
        {/* Leverage type info */}
        <div className={styles.feeInfo}>
          <p className={styles.fee}>{leverage.type}</p>
        </div>

        {/* Base token info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${leverage.baseToken.ticker}.svg`}
              alt={leverage.baseToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{leverage.baseToken.name}</h2>
            <p className={styles.symbol}>{leverage.baseToken.ticker}</p>
          </div>
        </div>

        {/* Leverage token info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${leverage.leverageToken.ticker}.svg`}
              alt={leverage.leverageToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{leverage.leverageToken.name}</h2>
            <p className={styles.symbol}>{leverage.leverageToken.ticker}</p>
          </div>
        </div>

        {/* Max leverage info */}
        <div className={styles.feeInfo}>
          {isLoadingMaxLeverage ? (
            <>
              <SkeletonLoading style={{ width: "50px", height: "14px" }} />
              <SkeletonLoading style={{ width: "50px", height: "14px" }} />
            </>
          ) : (
            <>
              <p className={styles.fee}>{maxLeverages.baseLeverage}x</p>
              <p className={styles.feeLabel}>{maxLeverages.maxLeverage}x</p>
            </>
          )}
        </div>

        {/* Borrow token info */}
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image
              src={`/tokens/${leverage.borrowToken.ticker}.svg`}
              alt={leverage.borrowToken.name}
              width={30}
              height={30}
            />
          </div>

          <div className={styles.nameSymbol}>
            <h2 className={styles.name}>{leverage.borrowToken.name}</h2>
            <p className={styles.symbol}>{leverage.borrowToken.ticker}</p>
          </div>
        </div>

        {/* Available */}
        <div className={styles.metricBox}>
          {isLoadingBorrowStats ? (
            <>
              <SkeletonLoading style={{ width: "90px", height: "14px" }} />
              <SkeletonLoading style={{ width: "60px", height: "13px" }} />
            </>
          ) : (
            <>
              <p className={styles.metricValue}>
                {formatTMB(borrowTokenStats.data.unLent)}{" "}
                {leverage.borrowToken.ticker}
              </p>
              <p className={styles.metricLabel}>
                $
                {formatTMB(
                  Quantity.__mul(
                    borrowTokenStats.data.unLent,
                    borrowTokenPrice,
                  ),
                )}
              </p>
            </>
          )}
        </div>

        {/* Fee info */}
        <div className={styles.feeInfo}>
          <div className={styles.feeValue}>
            <Image
              src={`/icons/${totalLeverageFee >= 0 ? "APYStars" : "APRStars"}.svg`}
              alt={`Stars icon`}
              width={10}
              height={10}
            />
            {isLoadingBorrowStats && isLoadingLeverageStats ? (
              <SkeletonLoading style={{ width: "50px", height: "14px" }} />
            ) : (
              <p className={styles.fee}>{totalLeverageFee.toFixed(2)}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// get total APY
function getTotalLeverageFee(
  leverageTokenAPY: number,
  collateralFactor: string,
  borrowTokenAPR: number,
) {
  const totalBorrowAPR = (Number(collateralFactor) / 100) * borrowTokenAPR;
  const reloopBorrowedFundsAPY =
    (Number(collateralFactor) / 100) * leverageTokenAPY;
  const totalFeePercentage =
    leverageTokenAPY + reloopBorrowedFundsAPY - totalBorrowAPR;
  return totalFeePercentage;
}

interface GetLeverageValues {
  type: "Short" | "Long";
  supplyTokenCollateralFactor: string;
  borrowTokenCollateralFactor: string;
}

interface GetLeverageValuesRes {
  maxLeverage: string | undefined;
  baseLeverage: string | undefined;
}

function getLeverageValues({
  type,
  supplyTokenCollateralFactor,
  borrowTokenCollateralFactor,
}: GetLeverageValues): GetLeverageValuesRes {
  // Convert string percentages to decimal numbers
  const supplyFactor = Number(supplyTokenCollateralFactor) / 100;
  const borrowFactor = Number(borrowTokenCollateralFactor) / 100;

  let baseLeverage: number;
  let maxLeverage: number;

  if (type === "Long") {
    // For long positions
    // Base leverage is 1 + what we can borrow, which is the collateral factor
    baseLeverage = 1 + supplyFactor;

    // Max leverage for longs with recursive borrowing
    maxLeverage = 1 / (1 - supplyFactor / (1 - supplyFactor * borrowFactor));
  } else {
    // For short positions
    // Base leverage is 1 + what we can borrow, which is the collateral factor
    baseLeverage = 1 + borrowFactor;

    // Max leverage for shorts with recursive borrowing
    maxLeverage = 1 / (1 - borrowFactor / (1 - supplyFactor * borrowFactor));
  }

  return {
    baseLeverage: baseLeverage.toFixed(1),
    maxLeverage: maxLeverage.toFixed(1),
  };
}
