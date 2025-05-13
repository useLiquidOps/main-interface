import { TokenDetails, tokenMap } from "../tokens";
import { Quantity } from "ao-tokens";
import { getData } from "@/utils/AO/getData";

export interface FairLaunchStrategy {
  depositToken: TokenDetails;
  borrowToken: TokenDetails;
  rewardToken: TokenDetails;
  fairLaunchID?: string;
}

export async function getFairlaunchAPY(fairLaunchID: string) {
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
  const totalDistrubutionTickers = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Total-Distribution-Ticks",
  ).value;

  // get current distribution tick
  const currentDistrubutionTick = fairLaunchData.find(
    // @ts-ignore
    (tag) => tag.name === "Distribution-Tick",
  ).value;

  // get total AO given to the project so far
  const totalAOGiven = new Quantity(
    projectDelegatedAO.combined[fairLaunchID],
    BigInt(projectDenomination),
  );

  // // get project estimated AO day cycle
  // const estimatedDayCycle = totalAOGiven.toNumber() / currentDistrubutionTick
  // console.log('estimatedDayCycle', fairLaunchID,estimatedDayCycle)

  const tokenPerAOInTotal =
    totalTokenSupplyFairLaunchedScaled.toNumber() / totalAOGiven.toNumber();

  const tokenPerAOPerTick = tokenPerAOInTotal / totalDistrubutionTickers;
  const tickToYearRatio = totalDistrubutionTickers / 365;
  const tokenPerAOPerYear = tokenPerAOPerTick * tickToYearRatio;

  return tokenPerAOPerYear;
}

export const fairLaunchStrategies: FairLaunchStrategy[] = [
  // qAR
  // wUSDC
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["APUS"],
    fairLaunchID: tokenMap["APUS"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["BOTG"],
    fairLaunchID: tokenMap["BOTG"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ACTION"],
    fairLaunchID: tokenMap["ACTION"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PL"],
    fairLaunchID: tokenMap["PL"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ARIO"],
    fairLaunchID: tokenMap["ARIO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PIXL"],
    fairLaunchID: tokenMap["PIXL"].fairLaunchID,
  },
  // wUSDT
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["AO"],
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["APUS"],
    fairLaunchID: tokenMap["APUS"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["BOTG"],
    fairLaunchID: tokenMap["BOTG"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ACTION"],
    fairLaunchID: tokenMap["ACTION"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PL"],
    fairLaunchID: tokenMap["PL"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["ARIO"],
    fairLaunchID: tokenMap["ARIO"].fairLaunchID,
  },
  {
    depositToken: tokenMap["wUSDT"],
    borrowToken: tokenMap["qAR"],
    rewardToken: tokenMap["PIXL"],
    fairLaunchID: tokenMap["PIXL"].fairLaunchID,
  },
  // wAR
  // wUSDC
  {
    depositToken: tokenMap["wUSDC"],
    borrowToken: tokenMap["wAR"],
    rewardToken: tokenMap["AO"],
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
