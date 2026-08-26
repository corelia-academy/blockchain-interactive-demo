"use client";

import { Footer, Header } from "./demo";
import { I18nProvider, useI18n } from "./i18n";

const groups = [
  { title: "Foundations", demos: [
    ["hash", "Hash", "See how data becomes a SHA-256 hash."],
    ["block", "Block", "Change block data and restore a valid hash."],
    ["blockchain", "Blockchain", "Explore how hashes connect a chain of blocks."],
    ["distributed", "Distributed", "Compare independent copies of the same chain."],
    ["tokens", "Tokens", "Follow token transfers across blocks and peers."],
  ] },
  { title: "Blockchain Networks", demos: [
    ["coinbase", "Bitcoin", "Explore Bitcoin transactions, fees and block rewards."],
    ["utxo", "UTXO", "Build one Bitcoin transaction from an unspent output."],
    ["ethereum", "Ethereum", "Learn accounts, nonces, gas and block validation."],
    ["solana", "Solana", "Explore slots, instructions and transaction fees."],
  ] },
  { title: "Cryptography", demos: [
    ["keys", "Keys", "Generate a public and private key pair."],
    ["signatures", "Signatures", "Sign a message and verify its signature."],
    ["transaction", "Transaction", "Create and verify a signed transaction."],
  ] },
] as const;

function HomeContent() {
  const { t } = useI18n();
  return (
    <div className="homeShell">
      <Header page="" />
      <main className="homeMain">
        <section className="homeIntro">
          <h1>{t("Blockchain Lab")}</h1>
          <p>{t("Choose a demo and explore each concept interactively.")}</p>
        </section>
        <div className="homeGroups">
          {groups.map((group) => (
            <section className="homeGroup" key={group.title}>
              <h2>{t(group.title)}</h2>
              <div className="demoGrid">
                {group.demos.map(([slug, title]) => (
                  <a className="demoChoice" href={`/${slug}`} key={slug}>
                    <span>{t(title)}</span><b aria-hidden="true">→</b>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return <I18nProvider><HomeContent /></I18nProvider>;
}
