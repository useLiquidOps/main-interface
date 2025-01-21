import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { oTokens } from "liquidops";

interface FaucetResponse {
  status: boolean;
  remainingHours?: number;
}

interface FaucetParams {
  ticker: string;
  walletAddress: string;
  amount: string;
}

interface UseFaucetOptions {
  onSuccess?: (data: FaucetResponse) => void;
  onError?: (error: Error) => void;
}

type SubmitStatus = "idle" | "loading" | "success" | "error" | "pending";

export function useFaucet(options: UseFaucetOptions = {}) {
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async ({
      ticker,
      walletAddress,
      amount,
    }: FaucetParams): Promise<FaucetResponse> => {
      const tokenKey = `o${ticker.toUpperCase()}` as keyof typeof oTokens;
      const tokenAddress = oTokens[tokenKey];

      if (!tokenAddress) {
        throw new Error(`No token address found for ${ticker}`);
      }

      try {
        const cleanAmount = amount.replace(/,/g, "");
        const response = await api.post("/faucet", {
          tokenAddress,
          walletAddress,
          amount: cleanAmount,
        });
        return response.data;
      } catch (error) {
        console.error("Error posting faucet request:", error);
        throw new Error("Failed to claim tokens from faucet");
      }
    },
    onSuccess: async (data, variables) => {
      if (data.status) {
        // First invalidate the balance query
        await queryClient.invalidateQueries({
          queryKey: ["user-balance", variables.ticker],
        });

        // Let the UI update first with success state
        setTimeout(() => {
          alert(
            `Successfully claimed ${variables.amount} ${variables.ticker} tokens`,
          );
          options.onSuccess?.(data);
        }, 500);
      } else if (data.remainingHours) {
        throw new Error(
          `Minted max tokens, please wait ${data.remainingHours.toLocaleString()} hours.`,
        );
      }
    },
    onError: (error) => {
      // Let the UI update first with error state
      setTimeout(() => {
        alert(
          error instanceof Error ? error.message : "Failed to claim tokens",
        );
        options.onError?.(error as Error);
      }, 500);
    },
  });

  const getStatus = (): SubmitStatus => {
    if (claimMutation.isPending) return "pending";
    if (claimMutation.isSuccess) return "success";
    if (claimMutation.isError) return "error";
    return "idle";
  };

  return {
    claim: claimMutation.mutate,
    status: getStatus(),
    isLoading: claimMutation.isPending,
    error: claimMutation.error as Error | null,
    reset: () => {
      claimMutation.reset();
    },
  };
}
