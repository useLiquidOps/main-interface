export const walletInfo = {
  name: "LiquidOps",
  logo: "https://arweave.net/crrW3xFrtKTdEODVu08XCJB_XPpqhlNDG2f8H8O4iSw",
};

export const shortenAddress = (addr: string) =>
  `${addr.slice(0, 5)}...${addr.slice(-5)}`;