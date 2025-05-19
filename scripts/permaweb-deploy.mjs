import { ANT, ArweaveSigner } from "@ar.io/sdk";
import Irys from "@irys/sdk";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import "dotenv/config";
import { readFileSync } from "node:fs";
import { slackPing } from "./slackPing.mjs";

const DEPLOY_FOLDER = "./dist";
const DEPLOY_KEY = process.env.DEPLOY_KEY;
const DEPLOY_WALLET = process.env.DEPLOY_WALLET;
const ANT_PROCESS = "Ayie-yIUDWQZYwt2XFGQYwpbg9je77W9tr6HXMOwDkc";
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const SLACK_TOKEN = process.env.SLACK_TOKEN;

async function deploy() {
  if (!DEPLOY_KEY) throw new Error("DEPLOY_KEY not configured");
  if (!DEPLOY_WALLET) throw new Error("DEPLOY_WALLET not configured");
  if (!ANT_PROCESS) throw new Error("ANT_PROCESS not configured");
  if (!SLACK_CHANNEL_ID) throw new Error("SLACK_CHANNEL_ID not configured");
  if (!SLACK_TOKEN) throw new Error("SLACK_TOKEN not configured");

  try {
    const jwk = JSON.parse(DEPLOY_KEY);

    const irys = new Irys({
      network: "mainnet",
      url: "https://turbo.ardrive.io",
      token: "arweave",
      key: jwk,
    });
    irys.uploader.useChunking = false;

    // const arweaveTokenAmount = irys.utils.toAtomic(1);
    // const fundNode = await irys.fund(arweaveTokenAmount);
    // console.log(
    //   "📜 LOG > funded:",
    //   irys.utils.fromAtomic(arweaveTokenAmount),
    //   irys.token,
    //   fundNode,
    // );

    // check balance

    const balance = await irys.getBalance(DEPLOY_WALLET);
    console.log(
      "📜 LOG > node balance:",
      irys.utils.fromAtomic(balance),
      irys.token,
    );

    const folderSize = await getFolderSize(DEPLOY_FOLDER);
    console.log("📜 LOG > folderSize:", folderSize, "bytes");

    const price = await irys.getPrice(folderSize);
    console.log(
      "📜 LOG > total cost:",
      irys.utils.fromAtomic(price),
      irys.token,
    );

    if (irys.utils.fromAtomic(balance).lt(irys.utils.fromAtomic(price))) {
      throw new Error("Insufficient balance");
    }

    // deploy to arweave

    console.log(`Deploying ${DEPLOY_FOLDER} folder`);

    const txResult = await irys.uploadFolder(DEPLOY_FOLDER, {
      indexFile: "index.html",
      interactivePreflight: false,
      logFunction: (log) => console.log(log),
      keepDeleted: false, // Whether to keep now deleted items from previous uploads
    });

    console.log("📜 LOG > txResult:", txResult);
    await new Promise((r) => setTimeout(r, 1000));


    // fix the Next js routing issue

    const manifest = JSON.parse(readFileSync(`./dist-manifest.json`, "utf-8"))

    manifest.paths = {
      ...manifest.paths,
      // general
      "404": manifest.paths["404.html"],
      "markets": manifest.paths["markets.html"],
      "strategies": manifest.paths["strategies.html"],
      // tokens
      "qAR": manifest.paths["qAR.html"],
      "wAR": manifest.paths["wAR.html"],
      "wUSDC": manifest.paths["wUSDC.html"],
      "wUSDT": manifest.paths["wUSDT.html"],
      "wETH": manifest.paths["wETH.html"],
    } 
    
    const tags = [
      { name: "Type", value: "manifest" },
      { name: "Content-Type", value: "application/x.arweave-manifest+json" },
    ];
    const manifestReceipt = await irys.upload(JSON.stringify(manifest), { tags });
    console.log("📜 LOG > deploy > receipt:", manifestReceipt);
  
    // upload to ARNS 

    const ant = ANT.init({
      signer: new ArweaveSigner(jwk),
      processId: ANT_PROCESS,
    });

    const info = await ant.getInfo();

    console.log("📜 LOG > ANT INFO:", info);

    const { id: txId } = await ant.setRecord(
      {
        undername: "@",
        transactionId: manifestReceipt.id,
        ttlSeconds: 900,
      },
      {
        tags: [
          {
            name: "Protocol-Name",
            value: "LiquidOps",
          },
          {
            name: "GIT-HASH",
            value: process.env.GITHUB_SHA || "local-deploy",
          },
        ],
      },
    );

    console.log(`📜 LOG > Deployed TxId ${txId}, `);

    const slackMessage = `Deployed Permasite TxId ${txId}, ${irys.utils.fromAtomic(balance)} ${irys.token}`
    await slackPing(slackMessage, SLACK_CHANNEL_ID, SLACK_TOKEN)
    
  } catch (error) {
    console.error(error);
  }
}

deploy().then().catch(console.error);


async function getFolderSize(folderPath) {
  let totalSize = 0;

  async function calculateSize(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await calculateSize(fullPath);
      } else {
        const stats = await stat(fullPath);
        totalSize += stats.size;
      }
    }
  }

  await calculateSize(folderPath);
  return totalSize;
}