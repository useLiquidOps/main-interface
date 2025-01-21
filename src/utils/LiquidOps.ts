"use client";
// @ts-ignore, due to bun link not importing types
import LiquidOps from "liquidops";
import { signer } from "./AO";

export const LiquidOpsClient = new LiquidOps(signer);
