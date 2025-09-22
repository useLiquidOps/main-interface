"use client";
import LiquidOps, { DryRunFIFO } from "liquidops";
import { createDataItemSigner } from "@permaweb/aoconnect";

const arweaveWallet = window.arweaveWallet;
const signer = createDataItemSigner(arweaveWallet);

LiquidOps.dryRunFifo = new DryRunFIFO([
  "https://cu1.ao-testnet.xyz",
  "https://cu24.ao-testnet.xyz",
  "https://cu-af.dataos.so",
  "https://cu.perplex.finance",
  "https://cu.arweave.asia",
  "https://cu.ardrive.io",
]);
export const LiquidOpsClient = new LiquidOps(signer);
