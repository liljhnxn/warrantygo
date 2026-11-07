# WarrantyGo 🛡️

**Decentralized On-Chain Warranty Registration & Verification Protocol on BOT Chain**

WarrantyGo is a lightweight, tamper-proof Web3 application built for electronics retail shops, gadget vendors, and small businesses to register products and issue immutable on-chain warranty certificates. Customers can instantly verify warranty coverage and validity directly against the blockchain without creating an account or connecting a crypto wallet.

---

## 🌐 BOT Chain Network & Ecosystem Details

* **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
* **Network Name:** BOT Chain
* **Chain ID:** `677`
* **Currency Symbol:** `BOT`
* **RPC URL:** `https://rpc.botchain.ai`
* **Deployed & Verified Contract Address:** [`0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F`](https://scan.botchain.ai/address/0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F#code)
* **Deployment Tx:** [`0x5fd3cb0cb74f7bd9a5cb28a8a6aa9f3cc4e388580b6ff5aac554428f5378dff3`](https://scan.botchain.ai/tx/0x5fd3cb0cb74f7bd9a5cb28a8a6aa9f3cc4e388580b6ff5aac554428f5378dff3)

---

## 🌟 Key Features

* **Instant Customer Lookup (No Wallet Required):** Customers can check the authentic status of any Warranty ID directly from the BOT Chain RPC node.
* **Seller Portal (MetaMask / Injected):** Authorized sellers connect their wallet to register new warranties and manage their registered inventory.
* **Automated Expiry Calculation:** Automatically calculates warranty expiry based on selected duration (30, 90, 180, 365 days, or custom days) and dynamically updates status without requiring periodic cron jobs or transactions.
* **Strict On-Chain Permissions:** Only the original seller who registered a warranty has permissions to cancel or void it. Once cancelled, a warranty can never be reactivated.
* **Privacy by Design:** Zero personally identifiable information (customer names, phone numbers, home addresses) is stored on-chain.
* **BotScan Explorer Integration:** Direct links to transaction and account records on BotScan explorer (`https://scan.botchain.ai`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (v14 App Router), [React](https://react.dev/) 18, [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Icons** | [Tailwind CSS](https://tailwindcss.com/) (Custom charcoal theme with purple & green accents), [Lucide React](https://lucide.dev/) |
| **Web3 Client** | [wagmi](https://wagmi.sh/) v2, [viem](https://viem.sh/) v2, [TanStack React Query](https://tanstack.com/query) |
| **Smart Contracts** | [Solidity](https://soliditylang.org/) `^0.8.24` |
| **Development & Testing** | [Hardhat](https://hardhat.org/), `@nomicfoundation/hardhat-toolbox`, Chai, Mocha |
| **Target Blockchain** | **BOT Chain** (Chain ID: `677`, RPC: `https://rpc.botchain.ai`) |

---

## 📁 Project Structure

```text
WarrantyGo/
├── contracts/               # Solidity Smart Contracts
│   └── WarrantyGo.sol       # Core Warranty Registry contract with custom errors & events
├── scripts/                 # Automation & Deployment Scripts
│   └── deploy.ts            # Botchain deployment script
├── test/                    # Comprehensive Contract Test Suite
│   └── WarrantyGo.test.ts   # 15 tests covering registration, lookups, expiry & security
├── app/                     # Next.js App Router
│   ├── globals.css          # Tailwind CSS and dark charcoal styling
│   ├── layout.tsx           # Root HTML layout and Web3 providers
│   └── page.tsx             # Interactive one-page application with BOT Chain ecosystem links
├── components/              # Modular UI Components
│   ├── Header.tsx           # Brand header, chain switch, and wallet connection
│   ├── WarrantyLookup.tsx   # Public customer verification interface
│   ├── WarrantyRegistration.tsx # Seller warranty issuance form
│   └── MyWarranties.tsx     # Seller's registered warranties management & cancellation
├── lib/                     # Web3 & Helper Utilities
│   ├── chains.ts            # BOT Chain viem chain definition
│   ├── contract.ts          # Contract ABI, addresses, types & badge helpers
│   ├── providers.tsx        # React Query & Wagmi context provider
│   └── wagmi.ts             # Wagmi client configuration
├── hardhat.config.ts        # Hardhat configuration with BOT Chain network
├── package.json             # Project dependencies & npm scripts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js**: v18.x or later
* **npm** or **pnpm**
* **MetaMask** or any EVM-compatible browser extension wallet

### 2. Installation

Clone or enter the project directory and install dependencies:

```bash
npm install
```

### 3. Environment Variables Configuration

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your environment:

```env
# BOT Chain Network
BOTCHAIN_RPC_URL="https://rpc.botchain.ai"
BOTCHAIN_EXPLORER_URL="https://scan.botchain.ai"
NEXT_PUBLIC_CHAIN_ID="677"

# Deployed WarrantyGo Contract Address
NEXT_PUBLIC_WARRANTY_CONTRACT_ADDRESS="0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F"

# Deployer Private Key for Hardhat (Keep safe, never commit to git!)
PRIVATE_KEY="your_private_key_here"
```

---

## 🧪 Smart Contract Testing & Compilation

### Compile the Solidity Contract:
```bash
npx hardhat compile
```

### Run the Smart Contract Tests:
```bash
npx hardhat test
```

All 15 test suites verify:
- Registration with valid product names and durations.
- Unique incremental Warranty IDs starting from `1001`.
- Rejecting empty product names (`EmptyProductName`).
- Rejecting zero duration (`InvalidDuration`).
- Calculating accurate expiry timestamps.
- Retrieving warranty details.
- Automatic status transition to `Expired` after expiry time passes.
- Seller filtering via `getMyWarranties()`.
- Authorized warranty cancellation by original sellers.
- Rejection of unauthorized cancellations (`OnlySellerAllowed`).
- Enforcing permanent cancellation (cannot reactivate voided warranties).

---

## 🚢 Deploying to BOT Chain

```bash
npm run deploy
```

To verify the contract on BotScan:
```bash
npm run verify <CONTRACT_ADDRESS>
```

---

## 💻 Running the Frontend

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm run start
```

---

## 🔒 Security and Privacy

* **Zero PII on-chain**: Only product identifiers, descriptions/notes, timestamps, and seller wallet addresses are stored.
* **Decentralized Access Control**: Built directly into the Solidity contract using custom errors and require statements.
* **Immutability**: Once registered, terms and duration cannot be retroactively modified.

---

## 🔗 Official Ecosystem Links

* **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
* **GitHub Repository:** [https://github.com/liljhnxn/warrantygo](https://github.com/liljhnxn/warrantygo)
