import { TokenDetails, tokenMap } from "../../tokens";
import { Quantity } from "ao-tokens-lite";
import { getData } from "@/utils/AO/getData";

export interface FairLaunchStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
  fairLaunchID: string;
}

export const AOPerAR = 0.016;

export async function getFairlaunchAPY(fairLaunchID: string) {
  if (fairLaunchID === "ao") {
    return AOPerAR;
  }

  // get total AO delegated so far
  const aoWatcherRes = await getData({
    Target: "NRP0xtzeV9MHgwLmgD254erUB7mUjMBhBkYkNYkbNEo",
    Action: "Get-Total-Delegated-AO-By-Project",
  });

  const projectDelegatedAO = JSON.parse(aoWatcherRes.Messages[0].Data);

  // get fair launch stats

  const getFairLaunch = await getData({
    Target: fairLaunchID,
    Action: "Info",
  });

  const fairLaunchData = getFairLaunch.Messages[0].Tags;

  // get project token denomination
  const projectDenomination = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Token-Denomination",
  ).value;

  // get total supply being fair launched
  const totalTokenSupplyFairLaunched = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Token-Supply-To-Use",
  ).value;
  const totalTokenSupplyFairLaunchedScaled = new Quantity(
    totalTokenSupplyFairLaunched,
    BigInt(projectDenomination),
  );

  // get total distribution ticks
  const totalDistrubedTokens = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Distributed-Quantity",
  ).value;

  // get current distribution tick
  const currentDistrubutionTick = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Distribution-Tick",
  ).value;

  // get total AO given to the project so far
  const totalAOGiven = new Quantity(
    projectDelegatedAO.combined[fairLaunchID],
    BigInt(12),
  );

  // get project estimated AO day cycle
  const estimatedDayCycle = totalAOGiven.toNumber() / currentDistrubutionTick;
  // console.log("estimatedDayCycle", fairLaunchID, estimatedDayCycle);

  const tokenPerAOInTotal =
    totalDistrubedTokens.toNumber() / totalAOGiven.toNumber();

  const tokenPerAOPerTick = tokenPerAOInTotal / estimatedDayCycle;
  const tokenPerAOPerYear = tokenPerAOPerTick * 365;

  return tokenPerAOPerYear;
}

export const fairLaunchStrategies: FairLaunchStrategy[] = [
  // wAR
  // wUSDC
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["AO"],
    fairLaunchID: tokenMap["AO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["APUS"],
    fairLaunchID: tokenMap["APUS"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["BOTG"],
    fairLaunchID: tokenMap["BOTG"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["ACTION"],
    fairLaunchID: tokenMap["ACTION"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["PL"],
    fairLaunchID: tokenMap["PL"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["ARIO"],
    fairLaunchID: tokenMap["ARIO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["PIXL"],
    fairLaunchID: tokenMap["PIXL"].fairLaunchID,
  },
  // wUSDT
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["AO"],
    fairLaunchID: tokenMap["AO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["APUS"],
    fairLaunchID: tokenMap["APUS"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["BOTG"],
    fairLaunchID: tokenMap["BOTG"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["ACTION"],
    fairLaunchID: tokenMap["ACTION"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["PL"],
    fairLaunchID: tokenMap["PL"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["ARIO"],
    fairLaunchID: tokenMap["ARIO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["PIXL"],
    fairLaunchID: tokenMap["PIXL"].fairLaunchID,
  },
];

export async function fairLaunchAdapter(): Promise<FairLaunchStrategy[]> {
  return [...fairLaunchStrategies];
}
