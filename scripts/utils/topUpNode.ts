import Irys from "@irys/sdk";
import "dotenv/config";

const DEPLOY_KEY = process.env.DEPLOY_KEY;

async function deploy() {
  if (!DEPLOY_KEY) throw new Error("DEPLOY_KEY not configured");

  const jwk = JSON.parse(DEPLOY_KEY);

  const irys = new Irys({
    network: "mainnet",
    url: "https://turbo.ardrive.io",
    token: "arweave",
    key: jwk,
  });
  irys.uploader.useChunking = false;

  const arweaveTokenAmount = irys.utils.toAtomic(3.1);
  const fundNode = await irys.fund(arweaveTokenAmount);
  console.log(
    "📜 LOG > funded:",
    irys.utils.fromAtomic(arweaveTokenAmount),
    irys.token,
    fundNode,
  );
}
deploy().then().catch(console.error);
