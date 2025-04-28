import axios from "axios";

export async function getAPRGraph(defiLlamaId: string) {
  if (defiLlamaId === "") {
    throw new Error(
      "Error in getAPRGraph: Please specify a Defi Llama pool ID",
    );
  }

  const poolDataRes = await axios.get(
    `https://yields.llama.fi/chart/${defiLlamaId}`,
  );

  return poolDataRes.data;
}
