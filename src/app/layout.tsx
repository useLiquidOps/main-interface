import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import { siteWideSEO } from "@/utils/SEO/SEO";

const title = "LiquidOps | Home";
const imagePath = "https://liquidops.io/SEO/home.png";


export const metadata: Metadata = {
  title: title,
  description: siteWideSEO.description,
  keywords: siteWideSEO.keyWords,
  icons: siteWideSEO.icons,
  openGraph: {
    title,
    description: siteWideSEO.description,
    url: siteWideSEO.url,
    siteName: siteWideSEO.name,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: siteWideSEO.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: siteWideSEO.url,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteWideSEO.description,
    images: [imagePath],
  },
  robots: "index, follow",
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: siteWideSEO.name,
      description: siteWideSEO.description,
      url: siteWideSEO.url,
      provider: {
        "@type": "Organization",
        name: siteWideSEO.name,
        url: siteWideSEO.url,
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
      <body className={dmSans.className} style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
