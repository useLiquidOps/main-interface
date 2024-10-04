import styles from "./Footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <p className={styles.title}>interest</p>
      </div>
      <div className={styles.footerContainer}>
        <p>Resources</p>
        <Link href="/media-kit">Media Kit</Link>
      </div>
      <div className={styles.footerContainer}>
        <p>Company</p>
        <Link href="/blog">Blog</Link>
      </div>
      <div className={styles.footerContainer}>
        <p>Legal</p>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-service">Terms of Service</Link>
        <p className={styles.copyright}>Copyright © 2024</p>
      </div>
      <div className={styles.footerContainer}>
        <p>Follow Us</p>
        <div className={styles.socialIcons}>
          <Link href="https://x.com" target="_blank">
            <img src="/images/x.svg" alt="X" />
          </Link>
          <Link href="https://github.com" target="_blank">
            <img src="/images/github.svg" alt="Github" />
          </Link>
          <Link href="https://discord.com" target="_blank">
            <img src="/images/discord.svg" alt="Discord" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
