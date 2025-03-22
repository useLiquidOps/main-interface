import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import styles from "./MintTokens.module.css";
import { useFaucet } from "@/hooks/actions/useFaucet";
import { useWalletAddress } from "@/hooks/data/useWalletAddress";
import GoogleCaptchaWrapper from "@/utils/CaptchaWrapper";
import { tokens } from "liquidops";

interface MintTokensProps {
  ticker: string;
}

const MintTokensContent: React.FC<MintTokensProps> = ({ ticker }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { data: walletAddress } = useWalletAddress();

  const { claim, status, error, reset } = useFaucet({
    onSuccess: () => {
      // Reset back to idle after a delay
      setTimeout(reset, 2000);
    },
    onError: () => {
      // Reset back to idle after a delay
      setTimeout(reset, 2000);
    },
  });

  const handleSubmit = async () => {
    if (!walletAddress || !executeRecaptcha) return;

    const tokenAddress = tokens[ticker.toUpperCase()];

    if (!tokenAddress) {
      throw new Error(`No token address found for ${ticker}`);
    }

    try {
      const token = await executeRecaptcha("mintTokens");

      claim({
        tokenAddress,
        walletAddress,
        token,
      });
    } catch (error) {
      console.error("ReCaptcha error:", error);
    }
  };

  return (
    <div className={styles.mintTokens}>
      <p className={styles.title}>Mint tokens</p>

      <p className={styles.disclaimer}>
        Please note you can only claim 10 tokens every 24 hours.
      </p>

      <SubmitButton
        onSubmit={handleSubmit}
        disabled={!walletAddress}
        submitText="Claim"
      />
    </div>
  );
};

const MintTokens: React.FC<MintTokensProps> = (props) => (
  <GoogleCaptchaWrapper>
    <MintTokensContent {...props} />
  </GoogleCaptchaWrapper>
);

export default MintTokens;
