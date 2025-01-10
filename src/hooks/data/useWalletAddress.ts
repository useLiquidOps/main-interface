import { useQuery } from "@tanstack/react-query";

export function useWalletAddress() {
  return useQuery({
    queryKey: ["wallet-address"],
    queryFn: async () => {
      return await window.arweaveWallet.getActiveAddress();
    },
  });
}
