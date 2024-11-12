import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { ModalProvider } from "./[ticker]/PopUp/PopUp";

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
      <ModalProvider>
        <body className={dmSans.className} style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </ModalProvider>
    </html>
  );
}
