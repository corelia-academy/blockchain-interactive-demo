# Corelia Blockchain Interactive Demo

An interactive learning lab for exploring hashes, blocks, distributed chains,
token ledgers, Bitcoin transactions, UTXOs, Ethereum, Solana, public/private
keys, digital signatures, and signed transactions.

Built by [Corelia Academy](https://corelia.academy/).

Live lab: [lab.corelia.academy](https://lab.corelia.academy/)

Source repository:
[corelia-academy/blockchain-interactive-demo](https://github.com/corelia-academy/blockchain-interactive-demo)

## Features

- SHA-256 hash and block demonstrations
- Linked and distributed blockchain simulations
- Token and Bitcoin transaction examples
- A standalone Bitcoin UTXO transaction explainer
- Ethereum account, nonce, and gas demonstration
- Solana slot, account, instruction, and fee demonstration
- ECDSA P-256 public/private keys and SHA-256 signatures
- Seven interface languages with English as the default
- Responsive Corelia Academy interface

All blockchain addresses, hashes, signatures, and transactions shown in the
application are simulated educational data. They are not mainnet records.

## Requirements

- Node.js 22.13.0 or newer
- npm

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm test
```

This runs the production build and ESLint checks.

## Netlify Deployment

The repository includes `netlify.toml` and a static export workflow for
Netlify. Netlify should use the settings committed in that file:

- Build command: `npm run build:netlify`
- Publish directory: `dist-netlify`
- Node.js version: `22.13.0`

To verify the Netlify output locally:

```bash
npm run build:netlify
```

The regular `npm run build` command remains available for the existing vinext
and Cloudflare-compatible build.

## Credits

This educational project is inspired by and builds upon the teaching approach,
sample data, and interactive concepts from Anders Brownworth's open-source
blockchain demonstrations:

- [anders94/blockchain-demo](https://github.com/anders94/blockchain-demo)
- [anders94/public-private-key-demo](https://github.com/anders94/public-private-key-demo)

The interface, expanded Bitcoin and UTXO explanations, Ethereum and Solana
examples, internationalization, responsive styling, and Corelia Academy
branding were developed for this repository.

Please refer to the upstream repositories for their original source and license
terms.

## License

This repository is released under the [MIT License](LICENSE).
