import { DM_Sans } from "next/font/google";
import styles from "./Layout.module.css";
import { MenuProvider } from "../components/Menu/MenuContext";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "interest",
  icons: {
    icon: "https://5jtgl5q4a7ktbbxoja2rnj3ad7h53copv7gxwljy2mnuovfjq2oq.arweave.net/6mZl9hwH1TCG7kg1FqdgH8_dic-vzXstONMbR1Sphp0",
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
        <MenuProvider>
          <div className={styles.layout}>
            <div className={styles.content}>{children}</div>
          </div>
        </MenuProvider>
      </body>
    </html>
  );
}
