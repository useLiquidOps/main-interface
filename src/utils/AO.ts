import { createDataItemSigner } from "@permaweb/aoconnect";
import { connect } from "@permaweb/aoconnect";

export const ao = connect();

const arweaveWallet = window.arweaveWallet;
export const signer = createDataItemSigner(arweaveWallet);