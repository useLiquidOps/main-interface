import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
// @ts-ignore, no aoprofile types
import AOProfile from "@permaweb/aoprofile";
import { arweave } from "@/utils/Arweave";
import { signer } from "@/utils/AO";
import { ao } from "@/utils/AO";

export function useAOProfile() {
  const { data: walletAddress } = useWalletAddress();
  const { getProfileByWalletAddress } = AOProfile.init({
    ao,
    signer,
    arweave,
  });

  return useQuery({
    queryKey: ["ao-profile", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");
      console.log(await getProfileByWalletAddress({ address: walletAddress }));
      return await getProfileByWalletAddress({ address: walletAddress });
    },
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
