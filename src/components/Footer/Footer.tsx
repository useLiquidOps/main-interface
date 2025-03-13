import styles from "./Footer.module.css";
import Image from "next/image";

const Footer = () => {
  // Use the environment variable set at build time from next.config.mjs
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH || "unknown";

  return (
    <div className={styles.footer}>
      <div className={styles.version}>
        <p>v0.1.0</p>
        <p>·</p>
        <p>{gitHash}</p>
      </div>
      <div className={styles.socials}>
        <a
          href="https://x.com/Liquid_Ops"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/socials/x.svg" alt="X" height={15} width={15} />
        </a>
        <a
          href="https://discord.gg/Jad4v8ykgY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/socials/discord.svg"
            alt="Discord"
            height={15}
            width={15}
          />
        </a>
        <a
          href="https://github.com/useLiquidOps"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/socials/github.svg"
            alt="GitHub"
            height={15}
            width={15}
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
