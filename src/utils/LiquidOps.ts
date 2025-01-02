// @ts-ignore, due to bun link not importing types
import LiquidOps from "liquidops";
import { createDataItemSigner } from "@permaweb/aoconnect";

const arweaveWallet = window.arweaveWallet;
const signer = createDataItemSigner(arweaveWallet);

export const LiquidOpsClient = new LiquidOps(signer);
