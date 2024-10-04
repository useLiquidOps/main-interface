import Borrow from "../../Borrow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "interest | borrow",
  icons: {
    icon: "https://g6vwrztpej6gsaqr44k2mgjluv246obce55gi4gxlebd6cym5oka.arweave.net/N6to5m8ifGkCEecVphkrpXXPOCInemRw11kCPwsM65Q",
  },
};

interface BorrowPageProps {
  params: {
    ticker: string;
    tab: string;
  };
}

const BorrowPage = ({ params }: BorrowPageProps) => {
  const { ticker, tab } = params;

  return <Borrow params={{ ticker, tab }} />;
};

export default BorrowPage;
