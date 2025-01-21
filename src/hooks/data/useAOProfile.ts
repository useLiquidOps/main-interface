import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
// @ts-ignore, no aoprofile types
import AOProfile from "@permaweb/aoprofile";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";

export function useAOProfile() {
  const { data: walletAddress } = useWalletAddress();
  const ao = connect();
  const signer = createDataItemSigner(window.arweaveWallet);
  const { getProfileByWalletAddress } = AOProfile.init({
    ao,
    signer,
    arweave: Arweave.init({}),
  });

  return useQuery({
    queryKey: ["ao-profile", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");
      return await getProfileByWalletAddress({ address: walletAddress });
    },
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
