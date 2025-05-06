import { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { siteWideSEO } from "@/utils/SEO/SEO";

const title = "LiquidOps | 404";
const url = "https://liquidops.io/404";
const imagePath = "https://liquidops.io/SEO/notfound.png";

export const metadata: Metadata = {
  title,
  description: siteWideSEO.notfoundDescription,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description: siteWideSEO.notfoundDescription,
    url,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteWideSEO.notfoundDescription,
    images: [imagePath],
  },
};

const Page = () => {
  return (
    <div className={styles.content}>
      <p className={styles.title}>404</p>
      <p className={styles.description}>Sorry we couldn't find that page.</p>
      <Link href="/" className={styles.homeButton}>
        Return home
      </Link>
    </div>
  );
};

export default Page;
