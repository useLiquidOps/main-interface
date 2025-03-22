import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { ModalProvider } from "./[ticker]/PopUp/PopUp";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@/components/GoogleAnalytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: "LiquidOps | Lending & Borrowing on Arweave & AO",
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
  keywords: [
    "LiquidOps",
    "Arweave",
    "lending protocol",
    "borrowing protocol",
    "AO",
    "DeFi",
    "over-collateralised",
    "Arweave yield farming",
    "AO yield farming",
    "lending",
    "borrowing",
    "Arweave lending",
    "AO lending",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LiquidOps | Lending & Borrowing on Arweave & AO",
    description:
      "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
    url: "https://liquidops.io/qAR",
    siteName: "LiquidOps",
    images: [
      {
        url: "https://liquidops.io/SEO/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LiquidOps",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://liquidops.io/qAR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiquidOps | Lending & Borrowing on Arweave & AO",
    description:
      "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
    images: ["https://liquidops.io/SEO/og-image.jpg"],
  },
  robots: "index, follow",
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: "LiquidOps",
      description:
        "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
      url: "https://liquidops.io/qAR",
      provider: {
        "@type": "Organization",
        name: "LiquidOps",
        url: "https://liquidops.io",
      },
    }),
  },
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
          <Providers>{children}</Providers>
          <GoogleAnalytics />
        </body>
      </ModalProvider>
    </html>
  );
}
