import { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "LiquidOps | 404",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "LiquidOps is an over-collateralised lending and borrowing protocol built on Arweave's L2 AO.",
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
