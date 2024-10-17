import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
// import { ArweaveWalletKit } from "@arweave-wallet-kit-beta/react";
// import BrowserWalletStrategy from "@arweave-wallet-kit-beta/browser-wallet-strategy";
// import ArConnectStrategy from "@arweave-wallet-kit-beta/arconnect-strategy";
// import OthentStrategy from "@arweave-wallet-kit-beta/othent-strategy";

export const metadata: Metadata = {
  title: "LiquidOps | Home",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
};

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <ArweaveWalletKit
        config={{
          strategies: [
            new ArConnectStrategy(),
            // new OthentStrategy(),
            new BrowserWalletStrategy(),
          ],
          permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
          ensurePermissions: true,
          appInfo: {
            name: "LiquidOps",
            logo: "https://arweave.net/jgP-YC0385KYOc5YvRmqajQWxutpC1lb1_wkCsfWCBo",
          },
        }}
        theme={{
          displayTheme: "light",
          accent: { r: 72, g: 68, b: 236 },
          titleHighlight: { r: 72, g: 68, b: 236 },
          radius: "default",
        }}
      > */}
      <body className={dmSans.className} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
      {/* </ArweaveWalletKit> */}
    </html>
  );
}
