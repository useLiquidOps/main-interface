import Faucet from "../Faucet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "interest | faucet",
  icons: {
    icon: "https://pnt7fg73jxky4idq33kqbudjbuvde3t6eh33zzcnxmhm5kx3juoq.arweave.net/e2fym_tN1Y4gcN7VANBpDSoybn4h97zkTbsOzqr7TR0",
  },
};

export interface FaucetPageProps {
  params: {
    ticker: string;
  };
}

const FaucetPage = ({ params }: FaucetPageProps) => {
  const { ticker } = params;

  return <Faucet params={{ ticker }} />;
};

export default FaucetPage;
