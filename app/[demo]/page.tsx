import Demo from "../demo";
import { redirect } from "next/navigation";
const pages = [
  "hash",
  "block",
  "blockchain",
  "distributed",
  "tokens",
  "coinbase",
  "utxo",
  "ethereum",
  "solana",
  "keys",
  "signatures",
  "transaction",
];
export default async function DemoRoute({
  params,
}: {
  params: Promise<{ demo: string }>;
}) {
  const { demo } = await params;
  if (!pages.includes(demo)) redirect("/");
  return <Demo page={demo} />;
}
