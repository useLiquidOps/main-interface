export interface TokenDetails {
  name: string;
  ticker: string;
}

const tokens: TokenDetails[] = [
  {
    name: "USD Circle",
    ticker: "USDC",
  },
  {
    name: "Quantum Arweave",
    ticker: "qAR",
  },
  {
    name: "AO",
    ticker: "AO",
  },
  {
    name: "APUS Network",
    ticker: "APUS",
  },
  {
    name: "Botega",
    ticker: "BOTG",
  },
  {
    name: "Action",
    ticker: "ACTION",
  },
  {
    name: "Protocol Land",
    ticker: "PL",
  },
  {
    name: "AR.IO",
    ticker: "ARIO",
  },
  {
    name: "PIXL",
    ticker: "PIXL",
  },
];

export const tokenMap: Record<string, TokenDetails> = {};
tokens.forEach((token) => {
  tokenMap[token.ticker] = token;
});
