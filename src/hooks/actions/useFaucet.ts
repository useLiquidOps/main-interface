import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

interface FaucetResponse {
  status: boolean;
  remainingHours?: number;
  error?: string;
}

interface FaucetParams {
  tokenAddress: string;
  walletAddress: string;
  token: string;
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
      tokenAddress,
      walletAddress,
      token,
    }: FaucetParams): Promise<FaucetResponse> => {
      try {
        const response = await api.post("/faucet", {
          tokenAddress,
          walletAddress,
          token,
        });
        if (!response.data.status) {
          alert("Faucuet limit reached, please try again later.");
        }
        return response.data;
      } catch (error) {
        console.error("Error posting faucet request:", error);
        throw new Error("Failed to claim tokens from faucet");
      }
    },
    onSuccess: async (data, variables) => {
      if (data.status) {
        // Directly update the user balance in cache by adding 10
        queryClient.setQueryData(
          ["user-balance", variables.tokenAddress, variables.walletAddress],
          (oldBalance: number | undefined) => (oldBalance || 0) + 10,
        );

        setTimeout(() => {
          options.onSuccess?.(data);
        }, 500);
      } else if (data.error) {
        throw new Error(data.error);
      } else if (data.remainingHours) {
        throw new Error(
          `Please wait ${data.remainingHours} hours before claiming again.`,
        );
      }
    },
    onError: (error) => {
      setTimeout(() => {
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
