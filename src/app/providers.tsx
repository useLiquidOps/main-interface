"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AOSyncProvider } from "@vela-ventures/aosync-sdk-react";
import { walletInfo } from "@/utils/Wallets/wallets";
import { AccountTabProvider } from "@/components/Connect/accountTabContext";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchInterval: 60 * 1000,
          },
        },
      }),
  );

  return (
    <AccountTabProvider>
      <QueryClientProvider client={queryClient}>
        <AOSyncProvider
          gatewayConfig={{
            host: "arweave.net",
            port: 443,
            protocol: "https",
          }}
          appInfo={walletInfo}
          muUrl="https://mu.ao-testnet.xyz"
        >
          {children}
        </AOSyncProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AccountTabProvider>
  );
}
