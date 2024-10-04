import Lend from "../../Lend";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "interest | lend",
  icons: {
    icon: "https://mot6zgespd7wuq4zl74yfswfofvqccgge7axe55r676ckf272cfq.arweave.net/Y6fsmJJ4_2pDmV_5gsrFcWsBCMYnwXJ3sff8JRdf0Is",
  },
};

interface LendPageProps {
  params: {
    ticker: string;
    tab: string;
  };
}

const LendPage = ({ params }: LendPageProps) => {
  const { ticker, tab } = params;

  return <Lend params={{ ticker, tab }} />;
};

export default LendPage;
