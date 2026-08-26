"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { I18nProvider, languages, Localized, Locale, useI18n } from "./i18n";
const nav = [
  ["hash", "Hash"],
  ["block", "Block"],
  ["blockchain", "Blockchain"],
  ["distributed", "Distributed"],
  ["tokens", "Tokens"],
  ["coinbase", "Bitcoin"],
  ["utxo", "UTXO"],
  ["ethereum", "Ethereum"],
  ["solana", "Solana"],
  ["keys", "Keys"],
  ["signatures", "Signatures"],
  ["transaction", "Transaction"],
];
const enc = (v: string) => new TextEncoder().encode(v),
  hex = (b: ArrayBuffer) =>
    Array.from(new Uint8Array(b))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join(""),
  sha = async (v: string) => hex(await crypto.subtle.digest("SHA-256", enc(v)));
export function Header({ page }: { page: string }) {
  const { locale, setLocale, t } = useI18n();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLanguage =
    languages.find((item) => item.code === locale) ?? languages[0];
  function chooseLanguage(code: Locale) {
    setLocale(code);
    setLanguageOpen(false);
  }
  return (
    <header>
      <Link className="brand" href="/">
        <Image
          src="/Corelia_Academy_Logo_Dark.png"
          alt="Corelia Academy"
          width={750}
          height={300}
          priority
        />
        <b>{t("Blockchain Demo")}</b>
      </Link>
      <button
        className="menu"
        type="button"
        aria-label={t("Navigation")}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
      <nav id="main-navigation" className={menuOpen ? "open" : ""}>
        {nav.map(([slug, label], i) => (
          <span key={slug} className={i === 9 ? "split" : ""}>
            <Link
              className={page === slug ? "active" : ""}
              href={"/" + slug}
              onClick={() => setMenuOpen(false)}
            >
              {t(label)}
            </Link>
          </span>
        ))}
      </nav>
      <div className="languagePicker">
        <button
          className="languageButton"
          aria-haspopup="listbox"
          aria-expanded={languageOpen}
          onClick={() => setLanguageOpen((open) => !open)}
        >
          <span>{currentLanguage.flag}</span>
          <span className="languageLabel">{currentLanguage.label}</span>
          <span className="languageChevron" aria-hidden="true" />
        </button>
        {languageOpen && (
          <div
            className="languageMenu"
            role="listbox"
            aria-label={t("Language")}
          >
            {languages.map((item) => (
              <button
                key={item.code}
                role="option"
                aria-selected={locale === item.code}
                className={locale === item.code ? "selected" : ""}
                onClick={() => chooseLanguage(item.code)}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="siteFooter">
      <a href="https://corelia.academy/" target="_blank" rel="noreferrer">
        Corelia Academy
      </a>
      <a
        href="https://github.com/corelia-academy/blockchain-interactive-demo"
        target="_blank"
        rel="noreferrer"
      >
        {t("View source on GitHub")}
      </a>
    </footer>
  );
}
function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={"card " + className}>
      <Localized>
        {title && <h2>{title}</h2>}
        {children}
      </Localized>
    </section>
  );
}
function HashDemo() {
  const { t } = useI18n();
  const [data, setData] = useState(""),
    [hash, setHash] = useState("");
  useEffect(() => {
    sha(data).then(setHash);
  }, [data]);
  return (
    <Card title="SHA256 Hash">
      <label>
        {t("Data")}
        <textarea
          rows={8}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </label>
      <label>
        {t("Hash")}
        <input value={hash} readOnly />
      </label>
    </Card>
  );
}
function BlockCard({
  index = 1,
  token = false,
}: {
  index?: number;
  token?: boolean;
}) {
  const { t } = useI18n();
  const initial =
      (token ? [6267, 4170, 7448, 4133, 1595] : [1075, 1866, 4020, 449, 442])[
        index - 1
      ] ?? 0,
    [nonce, setNonce] = useState(initial),
    [data, setData] = useState(token ? "10.00  Alice → Bob" : ""),
    [hash, setHash] = useState(""),
    [mining, setMining] = useState(false),
    previous = "0".repeat(64);
  useEffect(() => {
    sha(`${index}${nonce}${data}${previous}`).then(setHash);
  }, [index, nonce, data, previous]);
  async function mine() {
    setMining(true);
    let n = 0,
      h = "";
    do {
      n++;
      h = await sha(`${index}${n}${data}${previous}`);
    } while (!h.startsWith("000"));
    setNonce(n);
    setHash(h);
    setMining(false);
  }
  return (
    <Card className={hash.startsWith("000") ? "valid" : "pending"}>
      <div className="fieldRow">
        <label>
          {t("Block")}
          <input value={index} readOnly />
        </label>
        <label>
          {t("Nonce")}
          <input
            value={nonce}
            onChange={(e) => setNonce(Number(e.target.value))}
          />
        </label>
      </div>
      <label>
        {t(token ? "Transaction" : "Data")}
        <textarea
          rows={token ? 6 : 4}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </label>
      <label>
        {t("Previous")}
        <input value={previous} readOnly />
      </label>
      <label>
        {t("Hash")}
        <input value={hash} readOnly />
      </label>
      <button className="primary" onClick={mine} disabled={mining}>
        {mining ? "Mining..." : t("Mine")}
      </button>
    </Card>
  );
}
function Chain({
  distributed = false,
  token = false,
}: {
  distributed?: boolean;
  token?: boolean;
}) {
  const { t } = useI18n();
  const peers = distributed ? ["A", "B", "C"] : [""];
  return (
    <>
      {peers.map((peer) => (
        <section className="peer" key={peer}>
          {peer && (
            <h2 className="peerTitle">
              {t("Peer")} {peer}
            </h2>
          )}
          <div className="rail">
            {[1, 2, 3, 4, 5].map((n) => (
              <BlockCard key={peer + n} index={n} token={token} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
const fromHex = (value: string) =>
  new Uint8Array(value.match(/.{1,2}/g)?.map((x) => parseInt(x, 16)) ?? []);
async function createAndStorePair() {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const privateHex = hex(
      await crypto.subtle.exportKey("pkcs8", pair.privateKey),
    ),
    publicHex = hex(await crypto.subtle.exportKey("spki", pair.publicKey));
  localStorage.setItem("corelia-private-key", privateHex);
  localStorage.setItem("corelia-public-key", publicHex);
  return { pair, privateHex, publicHex };
}
function useSharedKeyPair() {
  const [pair, setPair] = useState<CryptoKeyPair | null>(null),
    [privateHex, setPrivateHex] = useState(""),
    [publicHex, setPublicHex] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const savedPrivate = localStorage.getItem("corelia-private-key"),
          savedPublic = localStorage.getItem("corelia-public-key");
        if (savedPrivate && savedPublic) {
          const privateKey = await crypto.subtle.importKey(
              "pkcs8",
              fromHex(savedPrivate),
              { name: "ECDSA", namedCurve: "P-256" },
              true,
              ["sign"],
            ),
            publicKey = await crypto.subtle.importKey(
              "spki",
              fromHex(savedPublic),
              { name: "ECDSA", namedCurve: "P-256" },
              true,
              ["verify"],
            );
          if (active) {
            setPair({ privateKey, publicKey });
            setPrivateHex(savedPrivate);
            setPublicHex(savedPublic);
          }
          return;
        }
      } catch {
        /* Invalid stored key; generate a replacement. */
      }
      const generated = await createAndStorePair();
      if (active) {
        setPair(generated.pair);
        setPrivateHex(generated.privateHex);
        setPublicHex(generated.publicHex);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  async function regenerate() {
    const generated = await createAndStorePair();
    setPair(generated.pair);
    setPrivateHex(generated.privateHex);
    setPublicHex(generated.publicHex);
  }
  return { pair, privateHex, publicHex, regenerate };
}
async function importPublicKey(value: string) {
  return crypto.subtle.importKey(
    "spki",
    fromHex(value.replace(/[^0-9a-f]/gi, "")),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"],
  );
}

function Keys() {
  const { privateHex, publicHex, regenerate } = useSharedKeyPair();
  return (
    <Card title="Public / Private Key Pairs">
      <p className="algorithmNote">
        <b>Algorithm:</b> ECDSA with the NIST P-256 curve (secp256r1).
        Signatures use SHA-256. This is not Bitcoin&apos;s secp256k1 curve.
      </p>
      <label>
        Private Key
        <div className="withButton">
          <input value={privateHex} readOnly />
          <button onClick={regenerate}>Random</button>
        </div>
      </label>
      <label>
        Public Key
        <input value={publicHex} readOnly />
      </label>
    </Card>
  );
}

function SignatureDemo() {
  const { pair, privateHex, publicHex } = useSharedKeyPair(),
    [tab, setTab] = useState<"sign" | "verify">("sign"),
    [message, setMessage] = useState("Hello blockchain"),
    [signature, setSignature] = useState(""),
    [verifyPublic, setVerifyPublic] = useState(""),
    [ok, setOk] = useState<boolean | null>(null);
  const effectivePublic = verifyPublic || publicHex;
  async function sign() {
    if (!pair) return;
    const result = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      pair.privateKey,
      enc(message),
    );
    setSignature(hex(result));
    setOk(null);
  }
  async function verify() {
    try {
      const key = await importPublicKey(effectivePublic);
      setOk(
        await crypto.subtle.verify(
          { name: "ECDSA", hash: "SHA-256" },
          key,
          fromHex(signature),
          enc(message),
        ),
      );
    } catch {
      setOk(false);
    }
  }
  return (
    <Card
      title="Signatures"
      className={ok === true ? "valid" : ok === false ? "invalid" : ""}
    >
      <div className="tabs" role="tablist">
        <button
          className={tab === "sign" ? "active" : ""}
          onClick={() => {
            setTab("sign");
            setOk(null);
          }}
        >
          Sign
        </button>
        <button
          className={tab === "verify" ? "active" : ""}
          onClick={() => {
            setTab("verify");
            setOk(null);
          }}
        >
          Verify
        </button>
      </div>
      {tab === "sign" ? (
        <>
          <label>
            Message
            <textarea
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setOk(null);
              }}
            />
          </label>
          <label>
            Private Key
            <input value={privateHex} readOnly />
          </label>
          <button
            className="primary fullButton"
            disabled={!pair}
            onClick={sign}
          >
            Sign
          </button>
          <label>
            Message Signature
            <input value={signature} readOnly />
          </label>
        </>
      ) : (
        <>
          <label>
            Message
            <textarea
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setOk(null);
              }}
            />
          </label>
          <label>
            Public Key
            <input
              value={effectivePublic}
              onChange={(e) => {
                setVerifyPublic(e.target.value);
                setOk(null);
              }}
            />
          </label>
          <label>
            Signature
            <input
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                setOk(null);
              }}
            />
          </label>
          <button
            className="primary fullButton"
            disabled={!signature}
            onClick={verify}
          >
            Verify
          </button>
        </>
      )}
      {ok !== null && (
        <p className={ok ? "success" : "error"}>
          {ok ? "Signature verified." : "Invalid signature."}
        </p>
      )}
    </Card>
  );
}

function TransactionDemo() {
  const { pair, privateHex, publicHex } = useSharedKeyPair(),
    [tab, setTab] = useState<"sign" | "verify">("sign"),
    [amount, setAmount] = useState("20.00"),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(
      "04cc955bf8e359cc7ebbb66f4c2dc616a93e8ba08e93d27996e20299ba92cba9cbd73c2ff46ed27a3727ba09486ba32b5ac35dd20c0adec020536996ca4d9f3d74",
    ),
    [signature, setSignature] = useState(""),
    [ok, setOk] = useState<boolean | null>(null);
  const effectiveFrom = from || publicHex;
  const payload = `${amount}${effectiveFrom}${to}`;
  async function sign() {
    if (!pair) return;
    setSignature(
      hex(
        await crypto.subtle.sign(
          { name: "ECDSA", hash: "SHA-256" },
          pair.privateKey,
          enc(payload),
        ),
      ),
    );
    setOk(null);
  }
  async function verify() {
    try {
      const key = await importPublicKey(effectiveFrom);
      setOk(
        await crypto.subtle.verify(
          { name: "ECDSA", hash: "SHA-256" },
          key,
          fromHex(signature),
          enc(payload),
        ),
      );
    } catch {
      setOk(false);
    }
  }
  return (
    <Card
      title="Transaction"
      className={ok === true ? "valid" : ok === false ? "invalid" : ""}
    >
      <div className="tabs" role="tablist">
        <button
          className={tab === "sign" ? "active" : ""}
          onClick={() => {
            setTab("sign");
            setOk(null);
          }}
        >
          Sign
        </button>
        <button
          className={tab === "verify" ? "active" : ""}
          onClick={() => {
            setTab("verify");
            setOk(null);
          }}
        >
          Verify
        </button>
      </div>
      <label>
        Message
        <div className="transactionMessage">
          <span>$</span>
          <input
            aria-label="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setOk(null);
            }}
          />
          <span>From</span>
          <input
            aria-label="From public key"
            value={effectiveFrom}
            onChange={(e) => {
              setFrom(e.target.value);
              setOk(null);
            }}
          />
          <span>→</span>
          <input
            aria-label="To public key"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setOk(null);
            }}
          />
        </div>
      </label>
      {tab === "sign" ? (
        <>
          <label>
            Private Key
            <input value={privateHex} readOnly />
          </label>
          <button
            className="primary fullButton"
            disabled={!pair}
            onClick={sign}
          >
            Sign
          </button>
          <label>
            Message Signature
            <input value={signature} readOnly />
          </label>
        </>
      ) : (
        <>
          <label>
            Signature
            <input
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                setOk(null);
              }}
            />
          </label>
          <button
            className="primary fullButton"
            disabled={!signature}
            onClick={verify}
          >
            Verify
          </button>
        </>
      )}
      {ok !== null && (
        <p className={ok ? "success" : "error"}>
          {ok
            ? "Transaction signature verified."
            : "Invalid transaction signature."}
        </p>
      )}
    </Card>
  );
}

type Tx = { value: string; from: string; to: string; feeSats?: number };
type LedgerBlock = {
  index: number;
  nonce: number;
  transactions: Tx[];
  previous: string;
  hash: string;
  coinbase?: { value: string; to: string };
};
const tokenSeed: LedgerBlock[] = [
  {
    index: 1,
    nonce: 139358,
    transactions: [
      { value: "25.00", from: "Darcy", to: "Bingley" },
      { value: "4.27", from: "Elizabeth", to: "Jane" },
      { value: "19.22", from: "Wickham", to: "Lydia" },
      { value: "106.44", from: "Lady Catherine de Bourgh", to: "Collins" },
      { value: "6.42", from: "Charlotte", to: "Elizabeth" },
    ],
    previous: "0".repeat(64),
    hash: "",
  },
  {
    index: 2,
    nonce: 39207,
    transactions: [
      { value: "97.67", from: "Ripley", to: "Lambert" },
      { value: "48.61", from: "Kane", to: "Ash" },
      { value: "6.15", from: "Parker", to: "Dallas" },
      { value: "10.44", from: "Hicks", to: "Newt" },
      { value: "88.32", from: "Bishop", to: "Burke" },
      { value: "45.00", from: "Hudson", to: "Gorman" },
      { value: "92.00", from: "Vasquez", to: "Apone" },
    ],
    previous:
      "00000c52990ee86de55ec4b9b32beefd745d71675dc0eddfbc7b88336e2e296b",
    hash: "",
  },
  {
    index: 3,
    nonce: 13804,
    transactions: [
      { value: "10.00", from: "Emily", to: "Jackson" },
      { value: "5.00", from: "Madison", to: "Jackson" },
      { value: "20.00", from: "Lucas", to: "Grace" },
    ],
    previous:
      "000078be183417844c14a9251ca246fb15df1074019873f5d85c1a6f4311d4e0",
    hash: "",
  },
  {
    index: 4,
    nonce: 20688,
    transactions: [
      { value: "62.19", from: "Rick", to: "Ilsa" },
      { value: "867.96", from: "Captain Louis Renault", to: "Strasser" },
      { value: "276.15", from: "Victor Laszlo", to: "Ilsa" },
      { value: "97.13", from: "Rick", to: "Sam" },
      { value: "119.63", from: "Captain Louis Renault", to: "Jan Brandel" },
    ],
    previous:
      "0000c2c95f54a49b4f2bee7056a7dc3b7c1a408706c848b520e20eac75aaceb0",
    hash: "",
  },
  {
    index: 5,
    nonce: 33083,
    transactions: [
      { value: "14.12", from: "Denise Lovett", to: "Edmund Lovett" },
      { value: "2,760.29", from: "Lord Glendenning", to: "John Moray" },
      { value: "413.78", from: "Katherine Glendenning", to: "Miss Audrey" },
    ],
    previous:
      "0000c03019ed59586405750968888fb65256e82492480d9fe0a6bd2f5e86b5ca",
    hash: "",
  },
];
const btc = {
  miner: "bc1q7r4m8p2x9k3v5n6c8s0t2w4y6z8a0d3f5g7h9j",
  alice: "bc1q3n5k7m9x2c4v6b8s0d2f4g6h8j9k3l5p7q9r2t",
  bob: "bc1q9x7v5c3n2m8k6j4h0g2f8d6s4a3p7q5r9t2w6y",
  carol: "bc1q2w4e6r8t9y7u5a3s0d8f6g4h2j9k7l5p3q8x6c",
  dave: "bc1q8m6n4b2v9c7x5z3a0s2d4f6g8h7j5k3l9p2q4w",
  erin: "bc1q5t7y9u3a6s8d2f4g0h2j6k8l9p7q5w3e4r6x8c",
};
const coinbaseSeed: LedgerBlock[] = [
  {
    index: 1,
    nonce: 104136,
    coinbase: { value: "3.1251", to: btc.miner },
    transactions: [
      { value: "0.50", from: btc.miner, to: btc.alice, feeSats: 10000 },
    ],
    previous: "0".repeat(64),
    hash: "",
  },
  {
    index: 2,
    nonce: 16011,
    coinbase: { value: "3.12518", to: btc.miner },
    transactions: [
      { value: "10.00", from: btc.miner, to: btc.alice, feeSats: 4000 },
      { value: "20.00", from: btc.miner, to: btc.bob, feeSats: 4500 },
      { value: "15.00", from: btc.miner, to: btc.carol, feeSats: 5000 },
      { value: "15.00", from: btc.miner, to: btc.dave, feeSats: 4500 },
    ],
    previous:
      "00001cc0b4b833c2289c9b99c681e975c76498179891fe4e9843ff36c124b0d1",
    hash: "",
  },
  {
    index: 3,
    nonce: 209190,
    coinbase: { value: "3.12524", to: btc.miner },
    transactions: [
      { value: "10.00", from: btc.carol, to: btc.erin, feeSats: 7000 },
      { value: "5.00", from: btc.dave, to: btc.erin, feeSats: 8000 },
      { value: "20.00", from: btc.bob, to: btc.alice, feeSats: 9000 },
    ],
    previous:
      "000040da40138452ebbf1494c0c2b4b406fa3e66f388bb8df8494d2a84a584e9",
    hash: "",
  },
  {
    index: 4,
    nonce: 134442,
    coinbase: { value: "3.12532", to: btc.miner },
    transactions: [
      { value: "15.00", from: btc.erin, to: btc.bob, feeSats: 10000 },
      { value: "5.00", from: btc.carol, to: btc.dave, feeSats: 10500 },
      { value: "8.00", from: btc.alice, to: btc.erin, feeSats: 11500 },
    ],
    previous:
      "000013a9ca534fbde7dae28906c804ed5724e26298030c305b1f7a0709499c83",
    hash: "",
  },
  {
    index: 5,
    nonce: 79214,
    coinbase: { value: "3.12545", to: btc.alice },
    transactions: [
      { value: "2.00", from: btc.erin, to: btc.carol, feeSats: 10000 },
      { value: "6.00", from: btc.bob, to: btc.dave, feeSats: 11000 },
      { value: "4.00", from: btc.bob, to: btc.alice, feeSats: 12000 },
      { value: "9.95", from: btc.alice, to: btc.miner, feeSats: 12000 },
    ],
    previous:
      "0000ffb9bdeb32e7447d8b1c14c0626040c775357df4af1a097368a5014b0513",
    hash: "",
  },
];
const cloneSeed = (seed: LedgerBlock[]) =>
  seed.map((b) => ({
    ...b,
    coinbase: b.coinbase ? { ...b.coinbase } : undefined,
    transactions: b.transactions.map((t) => ({ ...t })),
  }));
const ledgerText = (b: LedgerBlock) =>
  `${b.index}${b.nonce}${b.coinbase?.value ?? ""}${b.coinbase?.to ?? ""}${b.transactions.map((t) => `${t.value}${t.from}${t.to}${t.feeSats ?? ""}`).join("")}${b.previous}`;

function Ledger({ coinbase = false }: { coinbase?: boolean }) {
  const { t } = useI18n();
  const seed = coinbase ? coinbaseSeed : tokenSeed;
  const [peers, setPeers] = useState<LedgerBlock[][]>(() =>
    ["A", "B", "C"].map(() => cloneSeed(seed)),
  );
  const [mining, setMining] = useState("");
  useEffect(() => {
    let active = true;
    const initial = ["A", "B", "C"].map(() =>
      cloneSeed(coinbase ? coinbaseSeed : tokenSeed),
    );
    (async () => {
      const ready = await Promise.all(
        initial.map(async (chain) =>
          Promise.all(
            chain.map(async (b) => ({ ...b, hash: await sha(ledgerText(b)) })),
          ),
        ),
      );
      if (active) setPeers(ready);
    })();
    return () => {
      active = false;
    };
  }, [coinbase]);
  async function recalc(chain: LedgerBlock[], start: number) {
    const next = cloneSeed(chain);
    for (let i = start; i < next.length; i++) {
      if (i > 0) next[i].previous = next[i - 1].hash;
      next[i].hash = await sha(ledgerText(next[i]));
    }
    return next;
  }
  async function edit(
    peer: number,
    block: number,
    change: (b: LedgerBlock) => void,
  ) {
    const all = peers.map(cloneSeed);
    change(all[peer][block]);
    all[peer] = await recalc(all[peer], block);
    setPeers(all);
  }
  async function mine(peer: number, block: number) {
    const key = `${peer}-${block}`;
    setMining(key);
    const all = peers.map(cloneSeed),
      target = all[peer][block];
    let nonce = 0,
      hash = "";
    do {
      target.nonce = nonce++;
      hash = await sha(ledgerText(target));
    } while (!hash.startsWith("0000"));
    target.nonce = nonce - 1;
    target.hash = hash;
    all[peer] = await recalc(all[peer], block + 1);
    setPeers(all);
    setMining("");
  }
  return (
    <>
      {peers.map((chain, p) => (
        <section className="peer" key={p}>
          <h2 className="peerTitle">
            {t("Peer")} {String.fromCharCode(65 + p)}
          </h2>
          <div className="rail">
            {chain.map((b, i) => (
              <Card
                key={b.index}
                className={b.hash.startsWith("0000") ? "valid" : "pending"}
              >
                <div className="fieldRow">
                  <label>
                    {t("Block")}
                    <input value={b.index} readOnly />
                  </label>
                  <label>
                    {t("Nonce")}
                    <input
                      value={b.nonce}
                      onChange={(e) =>
                        edit(p, i, (x) => {
                          x.nonce = Number(e.target.value);
                        })
                      }
                    />
                  </label>
                </div>
                {b.coinbase && (
                  <label>
                    {t("Block reward transaction")}
                    <div className="transactionRow coinbaseRow">
                      <span>BTC</span>
                      <input
                        aria-label="Coinbase value"
                        value={b.coinbase.value}
                        onChange={(e) =>
                          edit(p, i, (x) => {
                            if (x.coinbase) x.coinbase.value = e.target.value;
                          })
                        }
                      />
                      <span>to</span>
                      <input
                        aria-label="Coinbase recipient"
                        value={b.coinbase.to}
                        onChange={(e) =>
                          edit(p, i, (x) => {
                            if (x.coinbase) x.coinbase.to = e.target.value;
                          })
                        }
                      />
                    </div>
                  </label>
                )}
                <label>
                  {t(coinbase ? "Bitcoin transactions" : "Token transactions")}
                  <div className="transactions">
                    {b.transactions.length === 0 && (
                      <p className="emptyTx">
                        No user transactions in the genesis block.
                      </p>
                    )}
                    {b.transactions.map((tx, t) => (
                      <div className="transactionRow" key={t}>
                        <span>{coinbase ? "BTC" : "$"}</span>
                        <input
                          aria-label="Transaction value"
                          value={tx.value}
                          onChange={(e) =>
                            edit(p, i, (x) => {
                              x.transactions[t].value = e.target.value;
                            })
                          }
                        />
                        <span>From</span>
                        <input
                          aria-label="Transaction sender"
                          value={tx.from}
                          onChange={(e) =>
                            edit(p, i, (x) => {
                              x.transactions[t].from = e.target.value;
                            })
                          }
                        />
                        <span>→</span>
                        <input
                          aria-label="Transaction recipient"
                          value={tx.to}
                          onChange={(e) =>
                            edit(p, i, (x) => {
                              x.transactions[t].to = e.target.value;
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </label>
                <label>
                  {t("Previous block hash")}
                  <input value={b.previous} readOnly />
                </label>
                <label>
                  {t("Current block hash")}
                  <input value={b.hash} readOnly />
                </label>
                <button
                  className="primary"
                  disabled={!!mining}
                  onClick={() => mine(p, i)}
                >
                  {mining === `${p}-${i}` ? "Mining..." : t("Mine")}
                </button>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

type BitcoinInput = {
  txid: string;
  vout: number;
  address: string;
  valueSats: number;
};
type BitcoinOutput = { address: string; valueSats: number };
type BitcoinTransaction = { inputs: BitcoinInput[]; outputs: BitcoinOutput[] };
type BitcoinBlock = {
  index: number;
  nonce: number;
  miner: string;
  transactions: BitcoinTransaction[];
  previous: string;
  hash: string;
};
const SATS_PER_BTC = 100_000_000,
  BLOCK_SUBSIDY_SATS = 312_500_000;
const btcValue = (sats: number) =>
  (sats / SATS_PER_BTC).toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
const parseBtc = (value: string) =>
  Math.max(0, Math.round((Number(value) || 0) * SATS_PER_BTC));
const bitcoinSeed: BitcoinBlock[] = [
  {
    index: 1,
    nonce: 117889,
    miner: btc.miner,
    transactions: [
      {
        inputs: [
          {
            txid: "9760770f4e15ed890249271522fec8fa7b8e20b1df79f3db2de26e92ba96c9fc",
            vout: 0,
            address: btc.miner,
            valueSats: 100_000_000,
          },
        ],
        outputs: [
          { address: btc.alice, valueSats: 50_000_000 },
          { address: btc.miner, valueSats: 49_990_000 },
        ],
      },
    ],
    previous: "0".repeat(64),
    hash: "",
  },
  {
    index: 2,
    nonce: 75814,
    miner: btc.miner,
    transactions: [
      {
        inputs: [
          {
            txid: "8252ddd68bcca97206aaa5ae1aa01d4e761519d8aa88dc67160ab840c5db9d55",
            vout: 1,
            address: btc.alice,
            valueSats: 50_000_000,
          },
        ],
        outputs: [
          { address: btc.bob, valueSats: 20_000_000 },
          { address: btc.alice, valueSats: 29_985_000 },
        ],
      },
    ],
    previous:
      "00004a5eace98dbca1b5a79762edd0c43e40c91a78bf8b63093d6ae296633257",
    hash: "",
  },
  {
    index: 3,
    nonce: 18716,
    miner: btc.miner,
    transactions: [
      {
        inputs: [
          {
            txid: "3856f9bdb5bd723f92fc6c313266d5202ae91b40508c751e37527b9692f02474",
            vout: 0,
            address: btc.bob,
            valueSats: 20_000_000,
          },
        ],
        outputs: [
          { address: btc.carol, valueSats: 12_000_000 },
          { address: btc.bob, valueSats: 7_980_000 },
        ],
      },
    ],
    previous:
      "00004b75c8979f4a86ede55c819332b2f2d3cdcf4586c48427b705a26c8c97aa",
    hash: "",
  },
  {
    index: 4,
    nonce: 11843,
    miner: btc.miner,
    transactions: [
      {
        inputs: [
          {
            txid: "f575848a3200d95d5e5efd0a1b5e3305299f879e72e806deeed657aee0f06143",
            vout: 0,
            address: btc.carol,
            valueSats: 12_000_000,
          },
        ],
        outputs: [
          { address: btc.dave, valueSats: 5_000_000 },
          { address: btc.carol, valueSats: 6_975_000 },
        ],
      },
    ],
    previous:
      "0000e8fa9c365bf17f82817fb20bb0a01801aba8f1973a249ad2edae36e142f1",
    hash: "",
  },
  {
    index: 5,
    nonce: 62390,
    miner: btc.miner,
    transactions: [
      {
        inputs: [
          {
            txid: "ea7fbfd163121b708f51733363129aadc7be6f2ea9b6ff0fae1e74cb8d3262cd",
            vout: 0,
            address: btc.dave,
            valueSats: 5_000_000,
          },
        ],
        outputs: [
          { address: btc.erin, valueSats: 2_000_000 },
          { address: btc.dave, valueSats: 2_970_000 },
        ],
      },
    ],
    previous:
      "0000980bf7d077c392c3676da6140e051c24685ba5e21d16599be01afeacaa33",
    hash: "",
  },
];

function BitcoinSummary() {
  const { t } = useI18n();
  const [peers, setPeers] = useState<LedgerBlock[][]>(() =>
      ["A", "B", "C"].map(() => cloneSeed(coinbaseSeed)),
    ),
    [mining, setMining] = useState("");
  useEffect(() => {
    let active = true;
    const initial = ["A", "B", "C"].map(() => cloneSeed(coinbaseSeed));
    (async () => {
      const ready = await Promise.all(
        initial.map((chain) =>
          Promise.all(
            chain.map(async (block) => ({
              ...block,
              hash: await sha(ledgerText(block)),
            })),
          ),
        ),
      );
      if (active) setPeers(ready);
    })();
    return () => {
      active = false;
    };
  }, []);
  async function recalc(chain: LedgerBlock[], start: number) {
    const next = cloneSeed(chain);
    for (let i = start; i < next.length; i++) {
      if (i > 0) next[i].previous = next[i - 1].hash;
      next[i].hash = await sha(ledgerText(next[i]));
    }
    return next;
  }
  async function edit(
    peer: number,
    block: number,
    change: (target: LedgerBlock) => void,
  ) {
    const all = peers.map(cloneSeed);
    change(all[peer][block]);
    all[peer] = await recalc(all[peer], block);
    setPeers(all);
  }
  async function mine(peer: number, block: number) {
    const key = `${peer}-${block}`;
    setMining(key);
    const all = peers.map(cloneSeed),
      target = all[peer][block];
    let nonce = 0,
      hash = "";
    do {
      target.nonce = nonce++;
      hash = await sha(ledgerText(target));
    } while (!hash.startsWith("0000"));
    target.nonce = nonce - 1;
    target.hash = hash;
    all[peer] = await recalc(all[peer], block + 1);
    setPeers(all);
    setMining("");
  }
  return (
    <>
      {peers.map((chain, p) => (
        <section className="peer" key={p}>
          <h2 className="peerTitle">
            {t("Peer")} {String.fromCharCode(65 + p)}
          </h2>
          <div className="rail">
            {chain.map((block, i) => {
              const fees = block.transactions.reduce(
                  (sum, tx) => sum + (tx.feeSats ?? 0),
                  0,
                ),
                reward = BLOCK_SUBSIDY_SATS + fees;
              return (
                <Card
                  key={block.index}
                  className={
                    block.hash.startsWith("0000") ? "valid" : "pending"
                  }
                >
                  <div className="fieldRow">
                    <label>
                      {t("Block")}
                      <input value={block.index} readOnly />
                    </label>
                    <label>
                      {t("Nonce")}
                      <input
                        value={block.nonce}
                        onChange={(e) =>
                          edit(p, i, (target) => {
                            target.nonce = Number(e.target.value);
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="rewardSummary">
                    <div>
                      <span>{t("Block subsidy")}</span>
                      <b>{btcValue(BLOCK_SUBSIDY_SATS)} BTC</b>
                    </div>
                    <div>
                      <span>{t("Transaction fees")}</span>
                      <b>{btcValue(fees)} BTC</b>
                    </div>
                    <div>
                      <span>{t("Total miner reward")}</span>
                      <b>{btcValue(reward)} BTC</b>
                    </div>
                  </div>
                  <label>
                    {t("Block reward transaction")}
                    <div className="bitcoinReward">
                      <span>{btcValue(reward)} BTC</span>
                      <span>→</span>
                      <input
                        aria-label="Miner reward address"
                        value={block.coinbase?.to ?? ""}
                        onChange={(e) =>
                          edit(p, i, (target) => {
                            if (target.coinbase)
                              target.coinbase.to = e.target.value;
                          })
                        }
                      />
                    </div>
                  </label>
                  <label>
                    {t("Bitcoin transactions")}
                    <div className="transactions">
                      {block.transactions.map((tx, t) => (
                        <div className="transactionRow" key={t}>
                          <span>BTC</span>
                          <input
                            aria-label="Transaction value"
                            value={tx.value}
                            onChange={(e) =>
                              edit(p, i, (target) => {
                                target.transactions[t].value = e.target.value;
                              })
                            }
                          />
                          <span>From</span>
                          <input
                            aria-label="Transaction sender"
                            value={tx.from}
                            onChange={(e) =>
                              edit(p, i, (target) => {
                                target.transactions[t].from = e.target.value;
                              })
                            }
                          />
                          <span>→</span>
                          <input
                            aria-label="Transaction recipient"
                            value={tx.to}
                            onChange={(e) =>
                              edit(p, i, (target) => {
                                target.transactions[t].to = e.target.value;
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </label>
                  <label>
                    {t("Previous block hash")}
                    <input value={block.previous} readOnly />
                  </label>
                  <label>
                    {t("Current block hash")}
                    <input value={block.hash} readOnly />
                  </label>
                  <button
                    className="primary"
                    disabled={!!mining}
                    onClick={() => mine(p, i)}
                  >
                    {mining === `${p}-${i}` ? "Mining..." : t("Mine")}
                  </button>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function UtxoDemo() {
  const { t } = useI18n();
  const [input, setInput] = useState<BitcoinInput>({
      ...bitcoinSeed[0].transactions[0].inputs[0],
    }),
    [recipient, setRecipient] = useState<BitcoinOutput>({
      ...bitcoinSeed[0].transactions[0].outputs[0],
    }),
    [changeAddress, setChangeAddress] = useState(
      bitcoinSeed[0].transactions[0].outputs[1].address,
    ),
    [feeSats, setFeeSats] = useState(10_000);
  const changeSats = input.valueSats - recipient.valueSats - feeSats,
    valid = changeSats >= 0;
  return (
    <>
      <Card
        title="Build a Bitcoin UTXO Transaction"
        className={valid ? "valid" : "invalid"}
      >
        <div className="utxoStory">
          {t("UTXO story", {
            input: btcValue(input.valueSats),
            recipient: btcValue(recipient.valueSats),
          })}
        </div>
        <fieldset className="utxoTransaction">
          <legend>Input: UTXO being spent</legend>
          <div className="utxoGrid inputGrid">
            <label>
              TXID
              <input
                value={input.txid}
                onChange={(e) => setInput({ ...input, txid: e.target.value })}
              />
              <small>
                The hash identifying the transaction that created this UTXO.
              </small>
            </label>
            <label>
              VOUT
              <input
                value={input.vout}
                onChange={(e) =>
                  setInput({ ...input, vout: Number(e.target.value) })
                }
              />
              <small>
                The output index in the previous transaction, starting at 0.
              </small>
            </label>
            <label>
              Owner address
              <input
                value={input.address}
                onChange={(e) =>
                  setInput({ ...input, address: e.target.value })
                }
              />
              <small>The sender address that currently owns this UTXO.</small>
            </label>
            <label>
              Available UTXO (BTC)
              <input
                value={btcValue(input.valueSats)}
                onChange={(e) =>
                  setInput({ ...input, valueSats: parseBtc(e.target.value) })
                }
              />
              <small>The BTC available to spend from this input.</small>
            </label>
          </div>
        </fieldset>
        <fieldset className="utxoTransaction">
          <legend>Payment and change</legend>
          <div className="utxoGrid outputGrid">
            <label>
              Recipient address
              <input
                value={recipient.address}
                onChange={(e) =>
                  setRecipient({ ...recipient, address: e.target.value })
                }
              />
              <small>The address receiving the payment.</small>
            </label>
            <label>
              Amount sent (BTC)
              <input
                value={btcValue(recipient.valueSats)}
                onChange={(e) =>
                  setRecipient({
                    ...recipient,
                    valueSats: parseBtc(e.target.value),
                  })
                }
              />
              <small>
                The recipient receives this exact amount; the fee is separate.
              </small>
            </label>
            <label>
              Change address
              <input
                value={changeAddress}
                onChange={(e) => setChangeAddress(e.target.value)}
              />
              <small>The sender address receiving the remaining BTC.</small>
            </label>
            <label>
              Miner fee (BTC)
              <input
                value={btcValue(feeSats)}
                onChange={(e) => setFeeSats(parseBtc(e.target.value))}
              />
              <small>The fee paid by the sender to the miner.</small>
            </label>
            <label>
              Change returned (BTC)
              <input
                value={valid ? btcValue(changeSats) : t("Invalid")}
                readOnly
              />
              <small>
                Calculated automatically: UTXO minus amount sent minus miner
                fee.
              </small>
            </label>
          </div>
        </fieldset>
        <div className={valid ? "utxoEquation" : "utxoEquation equationError"}>
          <span>
            Available UTXO <b>{btcValue(input.valueSats)} BTC</b>
          </span>
          <span>
            − Amount sent <b>{btcValue(recipient.valueSats)} BTC</b>
          </span>
          <span>
            − Miner fee <b>{btcValue(feeSats)} BTC</b>
          </span>
          <span>
            = Change returned{" "}
            <b>{valid ? btcValue(changeSats) : t("Invalid")} BTC</b>
          </span>
        </div>
        {!valid && (
          <p className="error">
            Amount sent plus miner fee exceeds the available UTXO.
          </p>
        )}
        <small className="simulationNote">
          Addresses and TXIDs are simulated and are not Bitcoin mainnet data.
        </small>
      </Card>
      <Localized>
        <section className="glossary">
          <h2>Glossary</h2>
          <dl>
            <div>
              <dt>UTXO</dt>
              <dd>
                Unspent Transaction Output: BTC that has not been spent and can
                become an input to a new transaction.
              </dd>
            </div>
            <div>
              <dt>TXID</dt>
              <dd>The hash identifier of a Bitcoin transaction.</dd>
            </div>
            <div>
              <dt>VOUT</dt>
              <dd>
                The index of the output in the transaction referenced by the
                TXID.
              </dd>
            </div>
            <div>
              <dt>Input</dt>
              <dd>
                The sender&apos;s UTXO referenced by a transaction for spending.
              </dd>
            </div>
            <div>
              <dt>Amount sent</dt>
              <dd>
                The exact BTC received by the recipient; the miner fee is
                separate.
              </dd>
            </div>
            <div>
              <dt>Change output</dt>
              <dd>The remaining BTC returned to the sender.</dd>
            </div>
            <div>
              <dt>Transaction fee</dt>
              <dd>
                The fee paid by the sender to the miner, separate from the
                received amount.
              </dd>
            </div>
            <div>
              <dt>Satoshi</dt>
              <dd>The smallest Bitcoin unit; 100,000,000 sats = 1 BTC.</dd>
            </div>
            <div>
              <dt>Block subsidy</dt>
              <dd>
                New BTC created by the protocol in a block as a miner reward.
              </dd>
            </div>
          </dl>
        </section>
      </Localized>
    </>
  );
}

type EthereumTransaction = {
  from: string;
  to: string;
  valueEth: string;
  accountNonce: number;
  gasLimit: number;
  maxFeeGwei: number;
};
type EthereumBlock = {
  number: number;
  baseFeeGwei: number;
  gasUsed: number;
  transaction: EthereumTransaction;
  previous: string;
  hash: string;
  validated: boolean;
};
const ethAddresses = {
  alice: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  bob: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  carol: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
};
const ethereumSeed: EthereumBlock[] = [
  {
    number: 21840001,
    baseFeeGwei: 12,
    gasUsed: 21000,
    transaction: {
      from: ethAddresses.alice,
      to: ethAddresses.bob,
      valueEth: "0.15",
      accountNonce: 18,
      gasLimit: 21000,
      maxFeeGwei: 18,
    },
    previous: "0".repeat(64),
    hash: "",
    validated: true,
  },
  {
    number: 21840002,
    baseFeeGwei: 14,
    gasUsed: 21000,
    transaction: {
      from: ethAddresses.bob,
      to: ethAddresses.carol,
      valueEth: "0.08",
      accountNonce: 7,
      gasLimit: 21000,
      maxFeeGwei: 20,
    },
    previous: "",
    hash: "",
    validated: true,
  },
  {
    number: 21840003,
    baseFeeGwei: 11,
    gasUsed: 42000,
    transaction: {
      from: ethAddresses.carol,
      to: ethAddresses.alice,
      valueEth: "0.025",
      accountNonce: 42,
      gasLimit: 50000,
      maxFeeGwei: 16,
    },
    previous: "",
    hash: "",
    validated: true,
  },
  {
    number: 21840004,
    baseFeeGwei: 13,
    gasUsed: 21000,
    transaction: {
      from: ethAddresses.alice,
      to: ethAddresses.carol,
      valueEth: "0.4",
      accountNonce: 19,
      gasLimit: 21000,
      maxFeeGwei: 19,
    },
    previous: "",
    hash: "",
    validated: true,
  },
  {
    number: 21840005,
    baseFeeGwei: 15,
    gasUsed: 36000,
    transaction: {
      from: ethAddresses.bob,
      to: ethAddresses.alice,
      valueEth: "0.12",
      accountNonce: 8,
      gasLimit: 45000,
      maxFeeGwei: 22,
    },
    previous: "",
    hash: "",
    validated: true,
  },
];
const cloneEthereum = (chain: EthereumBlock[]) =>
  chain.map((block) => ({ ...block, transaction: { ...block.transaction } }));
const ethereumText = (block: EthereumBlock) =>
  JSON.stringify({
    number: block.number,
    baseFeeGwei: block.baseFeeGwei,
    gasUsed: block.gasUsed,
    transaction: block.transaction,
    previous: block.previous,
  });
async function calculateEthereumChain(chain: EthereumBlock[], start = 0) {
  const next = cloneEthereum(chain);
  for (let i = start; i < next.length; i++) {
    if (i > 0) next[i].previous = next[i - 1].hash;
    next[i].hash = await sha(ethereumText(next[i]));
  }
  return next;
}

function EthereumDemo() {
  const { t } = useI18n();
  const [chain, setChain] = useState(() => cloneEthereum(ethereumSeed));
  useEffect(() => {
    let active = true;
    calculateEthereumChain(ethereumSeed).then((ready) => {
      if (active) setChain(ready);
    });
    return () => {
      active = false;
    };
  }, []);
  async function edit(index: number, change: (block: EthereumBlock) => void) {
    const next = cloneEthereum(chain);
    change(next[index]);
    for (let i = index; i < next.length; i++) next[i].validated = false;
    setChain(await calculateEthereumChain(next, index));
  }
  async function validate(index: number) {
    const next = cloneEthereum(chain);
    next[index].validated = true;
    setChain(await calculateEthereumChain(next, index));
  }
  return (
    <>
      <p className="networkIntro">
        {t(
          "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.",
        )}
      </p>
      <div className="rail networkRail">
        {chain.map((block, index) => {
          const feeEth =
            (block.gasUsed * block.transaction.maxFeeGwei) / 1_000_000_000;
          return (
            <Card
              key={block.number}
              className={block.validated ? "valid" : "pending"}
            >
              <div className="fieldRow">
                <label>
                  {t("Block")}
                  <input value={block.number} readOnly />
                  <small>The block number in this simulated chain.</small>
                </label>
                <label>
                  Base fee (Gwei)
                  <input
                    type="number"
                    min="0"
                    value={block.baseFeeGwei}
                    onChange={(e) =>
                      edit(index, (target) => {
                        target.baseFeeGwei = Number(e.target.value);
                      })
                    }
                  />
                  <small>The protocol-defined base fee for this block.</small>
                </label>
              </div>
              <fieldset className="networkTransaction">
                <legend>Ethereum transaction</legend>
                <div className="networkGrid">
                  <label>
                    Sender
                    <input
                      value={block.transaction.from}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.from = e.target.value;
                        })
                      }
                    />
                    <small>
                      The account signing and sending the transaction.
                    </small>
                  </label>
                  <label>
                    Recipient
                    <input
                      value={block.transaction.to}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.to = e.target.value;
                        })
                      }
                    />
                    <small>The account receiving ETH.</small>
                  </label>
                  <label>
                    Value (ETH)
                    <input
                      value={block.transaction.valueEth}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.valueEth = e.target.value;
                        })
                      }
                    />
                  </label>
                  <label>
                    Account nonce
                    <input
                      type="number"
                      min="0"
                      value={block.transaction.accountNonce}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.accountNonce = Number(
                            e.target.value,
                          );
                        })
                      }
                    />
                    <small>
                      The number of transactions sent by this account.
                    </small>
                  </label>
                  <label>
                    Gas limit
                    <input
                      type="number"
                      min="0"
                      value={block.transaction.gasLimit}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.gasLimit = Number(e.target.value);
                        })
                      }
                    />
                  </label>
                  <label>
                    Max fee (Gwei)
                    <input
                      type="number"
                      min="0"
                      value={block.transaction.maxFeeGwei}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.maxFeeGwei = Number(
                            e.target.value,
                          );
                        })
                      }
                    />
                  </label>
                </div>
              </fieldset>
              <div className="feeSummary">
                <span>
                  Gas used <b>{block.gasUsed.toLocaleString()}</b>
                </span>
                <span>
                  Estimated maximum fee <b>{feeEth.toFixed(8)} ETH</b>
                </span>
              </div>
              <label>
                {t("Previous block hash")}
                <input value={block.previous} readOnly />
              </label>
              <label>
                {t("Current block hash")}
                <input value={block.hash} readOnly />
              </label>
              <button className="primary" onClick={() => validate(index)}>
                {t("Validate")}
              </button>
            </Card>
          );
        })}
      </div>
      <Localized>
        <small className="simulationNote networkNote">
          Addresses and hashes are simulated and are not Ethereum mainnet data.
        </small>
      </Localized>
    </>
  );
}

type SolanaInstruction = { program: string; accounts: string; data: string };
type SolanaTransaction = {
  feePayer: string;
  signer: string;
  recentBlockhash: string;
  computeUnits: number;
  priorityFeeMicroLamports: number;
  instructions: SolanaInstruction[];
};
type SolanaSlot = {
  slot: number;
  transaction: SolanaTransaction;
  previous: string;
  hash: string;
  processed: boolean;
};
const solAddresses = {
  alice: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHZN",
  bob: "9xQeWvG816bUx9EPfEZzJ4K5n1pW6x7kV3Rr2M8hYpTa",
};
const solanaSeed: SolanaSlot[] = [
  {
    slot: 312450001,
    transaction: {
      feePayer: solAddresses.alice,
      signer: solAddresses.alice,
      recentBlockhash: "9sHkM3pV8xN2qR7tY4wC6dF1gJ5bL0aE2uK8zP3mQ6vT",
      computeUnits: 200,
      priorityFeeMicroLamports: 1000,
      instructions: [
        {
          program: "11111111111111111111111111111111",
          accounts: `${solAddresses.alice}, ${solAddresses.bob}`,
          data: "Transfer 0.25 SOL",
        },
      ],
    },
    previous: "0".repeat(64),
    hash: "",
    processed: true,
  },
  {
    slot: 312450002,
    transaction: {
      feePayer: solAddresses.bob,
      signer: solAddresses.bob,
      recentBlockhash: "4fG7hJ2kL9mN5pQ8rS1tV6wX3yZ0aB4cD7eF2gH9jK5M",
      computeUnits: 450,
      priorityFeeMicroLamports: 2000,
      instructions: [
        {
          program: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          accounts: `${solAddresses.bob}, TokenAccount8Qp2`,
          data: "Transfer checked: 12 tokens",
        },
      ],
    },
    previous: "",
    hash: "",
    processed: true,
  },
  {
    slot: 312450003,
    transaction: {
      feePayer: solAddresses.alice,
      signer: solAddresses.alice,
      recentBlockhash: "6nP2qR8sT4uV9wX1yZ5aB7cD3eF0gH6jK2mN8pQ4rS9T",
      computeUnits: 800,
      priorityFeeMicroLamports: 5000,
      instructions: [
        {
          program: "ComputeBudget111111111111111111111111111111",
          accounts: solAddresses.alice,
          data: "Set compute unit price",
        },
      ],
    },
    previous: "",
    hash: "",
    processed: true,
  },
  {
    slot: 312450004,
    transaction: {
      feePayer: solAddresses.bob,
      signer: solAddresses.bob,
      recentBlockhash: "8vW3xY7zA2bC6dE9fG4hJ1kL5mN0pQ8rS3tU7wX2yZ6A",
      computeUnits: 520,
      priorityFeeMicroLamports: 3000,
      instructions: [
        {
          program: "11111111111111111111111111111111",
          accounts: `${solAddresses.bob}, ${solAddresses.alice}`,
          data: "Transfer 0.1 SOL",
        },
      ],
    },
    previous: "",
    hash: "",
    processed: true,
  },
  {
    slot: 312450005,
    transaction: {
      feePayer: solAddresses.alice,
      signer: solAddresses.alice,
      recentBlockhash: "3cD7eF2gH9jK5mN8pQ4rS1tV6wX0yZ3aB7cD2eF8gH4J",
      computeUnits: 960,
      priorityFeeMicroLamports: 4500,
      instructions: [
        {
          program: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          accounts: `${solAddresses.alice}, TokenAccount3Lm9`,
          data: "Transfer checked: 5 tokens",
        },
      ],
    },
    previous: "",
    hash: "",
    processed: true,
  },
];
const cloneSolana = (chain: SolanaSlot[]) =>
  chain.map((item) => ({
    ...item,
    transaction: {
      ...item.transaction,
      instructions: item.transaction.instructions.map((instruction) => ({
        ...instruction,
      })),
    },
  }));
const solanaText = (item: SolanaSlot) =>
  JSON.stringify({
    slot: item.slot,
    transaction: item.transaction,
    previous: item.previous,
  });
async function calculateSolanaChain(chain: SolanaSlot[], start = 0) {
  const next = cloneSolana(chain);
  for (let i = start; i < next.length; i++) {
    if (i > 0) next[i].previous = next[i - 1].hash;
    next[i].hash = await sha(solanaText(next[i]));
  }
  return next;
}

function SolanaDemo() {
  const { t } = useI18n();
  const [chain, setChain] = useState(() => cloneSolana(solanaSeed));
  useEffect(() => {
    let active = true;
    calculateSolanaChain(solanaSeed).then((ready) => {
      if (active) setChain(ready);
    });
    return () => {
      active = false;
    };
  }, []);
  async function edit(index: number, change: (item: SolanaSlot) => void) {
    const next = cloneSolana(chain);
    change(next[index]);
    for (let i = index; i < next.length; i++) next[i].processed = false;
    setChain(await calculateSolanaChain(next, index));
  }
  async function process(index: number) {
    const next = cloneSolana(chain);
    next[index].processed = true;
    setChain(await calculateSolanaChain(next, index));
  }
  return (
    <>
      <p className="networkIntro">
        {t(
          "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.",
        )}
      </p>
      <div className="rail networkRail">
        {chain.map((item, index) => {
          const baseFee = 5000,
            priorityFee = Math.ceil(
              (item.transaction.computeUnits *
                item.transaction.priorityFeeMicroLamports) /
                1_000_000,
            ),
            totalFee = baseFee + priorityFee,
            instruction = item.transaction.instructions[0];
          return (
            <Card
              key={item.slot}
              className={item.processed ? "valid" : "pending"}
            >
              <div className="fieldRow">
                <label>
                  Slot
                  <input value={item.slot} readOnly />
                  <small>
                    A time window in which a validator may produce a block.
                  </small>
                </label>
                <label>
                  Transaction fee
                  <input
                    value={`${totalFee.toLocaleString()} lamports`}
                    readOnly
                  />
                  <small>The simulated base fee plus priority fee.</small>
                </label>
              </div>
              <fieldset className="networkTransaction">
                <legend>Solana transaction</legend>
                <div className="networkGrid">
                  <label>
                    Fee payer
                    <input
                      value={item.transaction.feePayer}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.feePayer = e.target.value;
                        })
                      }
                    />
                    <small>The account paying the transaction fee.</small>
                  </label>
                  <label>
                    Signer
                    <input
                      value={item.transaction.signer}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.signer = e.target.value;
                        })
                      }
                    />
                    <small>The account signing to authorize execution.</small>
                  </label>
                  <label className="wideField">
                    Recent blockhash
                    <input
                      value={item.transaction.recentBlockhash}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.recentBlockhash = e.target.value;
                        })
                      }
                    />
                    <small>
                      A recent hash that gives the transaction a lifetime and
                      prevents replay.
                    </small>
                  </label>
                  <label>
                    Compute units
                    <input
                      type="number"
                      min="0"
                      value={item.transaction.computeUnits}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.computeUnits = Number(
                            e.target.value,
                          );
                        })
                      }
                    />
                  </label>
                  <label>
                    Priority fee (micro-lamports per CU)
                    <input
                      type="number"
                      min="0"
                      value={item.transaction.priorityFeeMicroLamports}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.priorityFeeMicroLamports = Number(
                            e.target.value,
                          );
                        })
                      }
                    />
                  </label>
                </div>
              </fieldset>
              <fieldset className="networkTransaction">
                <legend>Instruction</legend>
                <div className="networkGrid">
                  <label>
                    Program
                    <input
                      value={instruction.program}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.instructions[0].program =
                            e.target.value;
                        })
                      }
                    />
                    <small>
                      The onchain program processing the instruction.
                    </small>
                  </label>
                  <label>
                    Accounts
                    <input
                      value={instruction.accounts}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.instructions[0].accounts =
                            e.target.value;
                        })
                      }
                    />
                    <small>
                      The accounts read or written by the instruction.
                    </small>
                  </label>
                  <label className="wideField">
                    Instruction data
                    <input
                      value={instruction.data}
                      onChange={(e) =>
                        edit(index, (target) => {
                          target.transaction.instructions[0].data =
                            e.target.value;
                        })
                      }
                    />
                  </label>
                </div>
              </fieldset>
              <label>
                Previous slot hash
                <input value={item.previous} readOnly />
              </label>
              <label>
                Current slot hash
                <input value={item.hash} readOnly />
              </label>
              <button className="primary" onClick={() => process(index)}>
                {t("Process")}
              </button>
            </Card>
          );
        })}
      </div>
      <Localized>
        <small className="simulationNote networkNote">
          Addresses, signatures and hashes are simulated and are not Solana
          mainnet data.
        </small>
      </Localized>
    </>
  );
}

function DemoContent({ page }: { page: string }) {
  const { t } = useI18n();
  let content: React.ReactNode;
  switch (page) {
    case "hash":
      content = <HashDemo />;
      break;
    case "block":
      content = <BlockCard />;
      break;
    case "blockchain":
      content = <Chain />;
      break;
    case "distributed":
      content = <Chain distributed />;
      break;
    case "tokens":
      content = <Ledger />;
      break;
    case "coinbase":
      content = <BitcoinSummary />;
      break;
    case "utxo":
      content = <UtxoDemo />;
      break;
    case "ethereum":
      content = <EthereumDemo />;
      break;
    case "solana":
      content = <SolanaDemo />;
      break;
    case "keys":
      content = <Keys />;
      break;
    case "signatures":
      content = <SignatureDemo />;
      break;
    default:
      content = <TransactionDemo />;
  }
  const narrow = [
      "hash",
      "block",
      "utxo",
      "keys",
      "signatures",
      "transaction",
    ].includes(page),
    title =
      page === "coinbase"
        ? "Real Blockchain Work with Bitcoin"
        : nav.find((n) => n[0] === page)?.[1];
  return (
    <div className="siteShell">
      <Header page={page} />
      <main className={"container " + (narrow ? "" : "fluid")}>
        <div className="pageTitle">
          <h1>{t(title ?? "")}</h1>
        </div>
        {content}
      </main>
      <Footer />
    </div>
  );
}

export default function Demo({ page }: { page: string }) {
  return (
    <I18nProvider>
      <DemoContent page={page} />
    </I18nProvider>
  );
}
