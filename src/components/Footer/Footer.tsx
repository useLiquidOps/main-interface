import styles from "./Footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.socials}>
        <a href="https://x.com/Liquid_Ops" target="_blank">
          <Image src="/socials/x.svg" alt="X" height={15} width={15} />
        </a>
        <a href="https://discord.gg/Jad4v8ykgY" target="_blank">
          <Image
            src="/socials/discord.svg"
            alt="Discord"
            height={15}
            width={15}
          />
        </a>
        <a href="https://github.com/useLiquidOps" target="_blank">
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
