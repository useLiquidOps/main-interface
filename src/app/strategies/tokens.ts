export interface TokenDetails {
  name: string;
  ticker: string;
  fairLaunchID?: string;
}

const tokens: TokenDetails[] = [
  {
    name: "USD Circle",
    ticker: "wUSDC",
  },
  {
    name: "USD Tether",
    ticker: "wUSDT",
  },
  {
    name: "Quantum Arweave",
    ticker: "qAR",
  },
  {
    name: "Wrapped Arweave",
    ticker: "wAR",
  },
  {
    name: "AO",
    ticker: "AO",
  },
  // fair launches
  {
    name: "APUS Network",
    ticker: "APUS",
    fairLaunchID: "jHZBsy0SalZ6I5BmYKRUt0AtLsn-FCFhqf_n6AgwGlc",
  },
  {
    name: "Botega",
    ticker: "BOTG",
    fairLaunchID: "UcBPqkaVI7W4I_YMznrt2JUoyc_7TScCdZWOOSBvMSU",
  },
  {
    name: "Action",
    ticker: "ACTION",
    fairLaunchID: "NXZjrPKh-fQx8BUCG_OXBUtB4Ix8Xf0gbUtREFoWQ2Q",
  },
  {
    name: "Protocol Land",
    ticker: "PL",
    fairLaunchID: "Wc8Rg-owsWSvrmb5XAlmSs3_4UtHo9i5ui2o9UCFuTk",
  },
  {
    name: "AR.IO",
    ticker: "ARIO",
    fairLaunchID: "rW7h9J9jE2Xp36y4SKn2HgZaOuzRmbMfBRPwrFFifHE",
  },
  {
    name: "PIXL",
    ticker: "PIXL",
    fairLaunchID: "3eZ6_ry6FD9CB58ImCQs6Qx_rJdDUGhz-D2W1AqzHD8",
  },
];

export const tokenMap: Record<string, TokenDetails> = {};
tokens.forEach((token) => {
  tokenMap[token.ticker] = token;
});
