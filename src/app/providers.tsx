"use client";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AOSyncProvider } from "@vela-ventures/aosync-sdk-react";
import { walletInfo } from "@/utils/Wallets/wallets";
import { AccountTabProvider } from "@/components/Connect/accountTabContext";
import PendingTransactions from "@/components/PendingTransactions/PendingTransactions";
import NotificationProvider from "@/components/notifications/NotificationProvider";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { persister } from "@/utils/caches/persister";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        gcTime: 5 * 60 * 1000
      },
    },
  }));

  return (
    <AccountTabProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateQuery: () => true
          }
        }}
      >
        <AOSyncProvider
          gatewayConfig={{
            host: "arweave.net",
            port: 443,
            protocol: "https",
          }}
          appInfo={walletInfo}
          muUrl="https://mu.ao-testnet.xyz"
        >
          <NotificationProvider>
            <PendingTransactions>{children}</PendingTransactions>
          </NotificationProvider>
        </AOSyncProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </AccountTabProvider>
  );
}
