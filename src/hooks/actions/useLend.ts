import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { invalidateData } from "@/utils/caches/cacheUtils";
import { tokenInput } from "liquidops";

interface LendParams {
  token: string;
  quantity: bigint;
}

type UnlendParams = LendParams;

export function useLend() {
  const queryClient = useQueryClient();

  const lendMutation = useMutation({
    mutationFn: async ({ token, quantity }: LendParams) => {
      try {
        return await LiquidOpsClient.lend({
          token,
          quantity,
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (_, { token }) => {
      try {
        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(token.toUpperCase());

        invalidateData([
          `user-balance-${tokenAddress}-${walletAddress}`,
          `user-position-${tokenAddress}-${walletAddress}`,
          `user-position-balance-${tokenAddress}-${walletAddress}`,
          `global-position-${walletAddress}`,
        ]);
        await queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance",
          ],
        });
      } catch {}
    },
  });

  const unlendMutation = useMutation({
    mutationFn: async ({ token, quantity }: UnlendParams) => {
      try {
        return await LiquidOpsClient.unLend({
          token,
          quantity,
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (_, { token }) => {
      try {
        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(token.toUpperCase());

        invalidateData([
          `user-balance-${tokenAddress}-${walletAddress}`,
          `user-position-${tokenAddress}-${walletAddress}`,
          `user-position-balance-${tokenAddress}-${walletAddress}`,
          `global-position-${walletAddress}`,
        ]);
        await queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance",
          ],
        });
      } catch {}
    },
  });

  return {
    lend: lendMutation.mutate,
    isLending: lendMutation.isPending,
    lendError: lendMutation.error,

    unlend: unlendMutation.mutate,
    isUnlending: unlendMutation.isPending,
    unlendError: unlendMutation.error,

    reset: () => {
      lendMutation.reset();
      unlendMutation.reset();
    },
  };
}
