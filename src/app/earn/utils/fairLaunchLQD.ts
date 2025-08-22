// utils/fairLaunchLQD.ts

import { connect } from "@permaweb/aoconnect";
import { createDataItemSigner } from "@permaweb/aoconnect";

// LQD Token FLP ID
const LQD_FLP_ID = "N0L1lUC-35wgyXK31psEHRjySjQMWPs_vHtTas5BJa8";
export const PI_FLP_ID = "rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE";

const FLP_DELEGATION_PROCESS_ID = "cuxSKjGJ-WDB9PzSkVkVVrIBSh3DrYHYz44usQOj5yE";

// Use connect with default config
const aoInstance = connect({ MODE: "legacy" });

interface DelegationUpdateResult {
  success: boolean;
  error?: string;
  previousDelegations?: Record<string, number>;
  newDelegations?: Record<string, number>;
}

/**
 * Get wallet address from window.arweaveWallet
 */
async function getActiveAddress(): Promise<string | null> {
  try {
    return await window.arweaveWallet.getActiveAddress();
  } catch {
    return null;
  }
}

/**
 * Get current delegation info from AO process
 */
async function getDelegationInfo(
  address: string,
): Promise<Record<string, number>> {
  try {
    const dryrunRes = await aoInstance.dryrun({
      process: FLP_DELEGATION_PROCESS_ID,
      tags: [
        { name: "Action", value: "Get-Delegations" },
        { name: "Wallet", value: address },
      ],
    });

    const message = dryrunRes.Messages?.[0];
    const data = JSON.parse(message?.Data || "[]");
    const delegationPrefs = data?.delegationPrefs || [];

    if (delegationPrefs.length === 0) {
      return { [PI_FLP_ID]: 100 };
    }

    const delegationInfo = delegationPrefs.reduce((acc: any, pref: any) => {
      acc[pref.walletTo] = pref.factor / 100;
      return acc;
    }, {}) as Record<string, number>;

    const restDelegations = Object.entries(delegationInfo).reduce(
      (acc: number, [key, value]) => {
        if (key !== address) {
          return acc + value;
        }
        return acc;
      },
      0,
    );

    delegationInfo[address] = 100 - restDelegations;

    return delegationInfo;
  } catch (error) {
    console.error("Error getting delegation info:", error);
    return { [address]: 100 };
  }
}

/**
 * Update delegation info via AO process
 */
async function updateDelegationInfo(
  delegations: Record<string, number>,
  address: string,
): Promise<void> {
  try {
    const signer = createDataItemSigner(window.arweaveWallet);

    const delegationInfoArray = Object.entries(delegations);
    delegationInfoArray.sort(([key1]) => (key1 === address ? -1 : 1));

    for (const [key, value] of delegationInfoArray) {
      await aoInstance.message({
        process: FLP_DELEGATION_PROCESS_ID,
        tags: [{ name: "Action", value: "Set-Delegation" }],
        signer: signer,
        data: JSON.stringify({
          walletFrom: address,
          walletTo: key,
          factor: value * 100,
        }),
      });
    }
  } catch (error) {
    console.error("Error updating delegation info:", error);
    throw error;
  }
}

/**
 * Set LQD token delegation to a specific percentage
 */
export async function setLQDTokenDelegation(
  delegationPercentage: number,
): Promise<DelegationUpdateResult> {
  try {
    if (delegationPercentage < 0 || delegationPercentage > 100) {
      return {
        success: false,
        error: "Delegation percentage must be between 0 and 100",
      };
    }

    const userAddress = await getActiveAddress();
    if (!userAddress) {
      return {
        success: false,
        error: "No active address found",
      };
    }

    const currentDelegations = await getDelegationInfo(userAddress);
    const currentLQDPercentage = currentDelegations[LQD_FLP_ID] || 0;

    // If percentage is 0, remove LQD from delegations
    if (delegationPercentage === 0) {
      if (currentLQDPercentage === 0) {
        return {
          success: true,
          previousDelegations: currentDelegations,
          newDelegations: currentDelegations,
        };
      }

      const newDelegations = { ...currentDelegations };
      delete newDelegations[LQD_FLP_ID];
      newDelegations[userAddress] =
        (newDelegations[userAddress] || 0) + currentLQDPercentage;

      await updateDelegationInfo(newDelegations, userAddress);

      return {
        success: true,
        previousDelegations: currentDelegations,
        newDelegations,
      };
    }

    // Calculate new delegations
    const newDelegations = { ...currentDelegations };
    const percentageDiff = delegationPercentage - currentLQDPercentage;

    newDelegations[LQD_FLP_ID] = delegationPercentage;

    // Adjust user's delegation
    const newUserPercentage =
      (newDelegations[userAddress] || 0) - percentageDiff;

    if (newUserPercentage < 0) {
      return {
        success: false,
        error: "Insufficient user delegation to accommodate this change",
      };
    }

    newDelegations[userAddress] = newUserPercentage;

    await updateDelegationInfo(newDelegations, userAddress);

    return {
      success: true,
      previousDelegations: currentDelegations,
      newDelegations,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get current LQD token delegation percentage
 */
export async function getLQDTokenDelegationPercentage(): Promise<number> {
  const userAddress = await getActiveAddress();
  if (!userAddress) return 0;

  const delegations = await getDelegationInfo(userAddress);
  return delegations[LQD_FLP_ID] || 0;
}

/**
 * Check if LQD token is in fair launch preferences
 */
export async function isLQDTokenInFairLaunchPreferences(): Promise<boolean> {
  const percentage = await getLQDTokenDelegationPercentage();
  return percentage > 0;
}

// Legacy functions for backward compatibility
export async function addLQDTokenToFairLaunchPreferences(
  delegationPercentage: number,
): Promise<DelegationUpdateResult> {
  const currentPercentage = await getLQDTokenDelegationPercentage();
  return setLQDTokenDelegation(currentPercentage + delegationPercentage);
}

export async function removeLQDTokenFromFairLaunchPreferences(): Promise<DelegationUpdateResult> {
  return setLQDTokenDelegation(0);
}

export async function updateLQDTokenDelegation(
  delegationPercentage: number,
): Promise<DelegationUpdateResult> {
  return setLQDTokenDelegation(delegationPercentage);
}
