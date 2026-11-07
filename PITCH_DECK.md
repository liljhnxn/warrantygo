# WarrantyGo — Pitch Deck (10-Slide Deck)

---

### Slide 1: Cover
* **Title:** WarrantyGo 🛡️
* **Subtitle:** Decentralized, Tamper-Proof Warranty Registration & Verification Protocol
* **Built on:** BOT Chain (Chain ID: 677)
* **Tagline:** *"Your warranty, always within reach."*
* **Presenter:** WarrantyGo Team ([GitHub](https://github.com/liljhnxn/warrantygo))
* **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)

---

### Slide 2: The Problem
* **The $\$300\text{B}+$ Electronics Post-Sale Dilemma:**
  1. **Faded & Lost Receipts:** Over 70% of thermal paper receipts fade within 6-12 months.
  2. **Rampant Warranty Fraud:** Fake invoices and illegitimate secondary-market claims cost retailers billions.
  3. **High SaaS Overhead:** Traditional warranty software locks merchants into expensive monthly subscriptions.
  4. **Customer Friction:** Demanding app downloads or account logins just to check warranty validity leads to drop-offs.

---

### Slide 3: The Solution
* **WarrantyGo on BOT Chain:**
  * **On-Chain Digital Certificates:** Permanent, immutable proof of warranty issuance.
  * **Zero-Wallet Customer Lookup:** Customers verify status via public RPC in seconds—no crypto wallet or account required.
  * **Automated Expiry State:** Smart contract natively resolves expired statuses with zero gas maintenance.
  * **Seller Control:** Only verified merchant wallets can issue and manage lifecycle controls.

---

### Slide 4: How It Works
* **Step 1 — Register (Seller):**
  Seller connects MetaMask, enters device name + serial notes, selects duration (30/90/180/365 days), and signs tx.
* **Step 2 — Certificate Generated:**
  Unique Warranty ID (e.g., `#1001`) and explorer link are issued immediately.
* **Step 3 — Instant Verification (Customer):**
  Customer enters Warranty ID on the portal to view live status, remaining days, and validity.
* **Step 4 — Automated Lifecycle:**
  Dynamic smart contract resolves status: `Active` ➔ `Expired` or `Cancelled`.

---

### Slide 5: Product Architecture & Tech Stack
* **Smart Contracts:** Solidity `^0.8.24` (EVM Paris target, Hardhat, custom gas-efficient errors).
* **Blockchain:** BOT Chain (Chain ID `677`, BotScan Explorer).
* **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS (Dark Charcoal aesthetic).
* **Web3 Integration:** Wagmi v2 + Viem public client for instant RPC querying without wallet friction.

---

### Slide 6: Live Traction & Deployment
* **Live Mainnet Contract:** [`0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F`](https://scan.botchain.ai/address/0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F#code)
* **Status:** Verified on BotScan Block Explorer.
* **Testing:** 15/15 unit tests passing across all registration, retrieval, and access control edge cases.
* **Open Source Codebase:** [https://github.com/liljhnxn/warrantygo](https://github.com/liljhnxn/warrantygo)

---

### Slide 7: Market Opportunity
* **Target Audience:**
  * Independent electronics & phone repair shops.
  * Refurbished gadget sellers (Swappa / eBay / Back Market sellers).
  * Consumer electronics and smart hardware retail chains.
* **Value Proposition for Merchants:**
  * Zero recurring SaaS database fees.
  * Complete elimination of counterfeit paper receipts.
  * Enhanced trust and customer satisfaction.

---

### Slide 8: Privacy & Security
* **Zero PII on Blockchain:** No customer names, phone numbers, or residential addresses are ever stored on-chain.
* **Non-Custodial Logic:** The contract holds 0 funds, eliminating treasury drain and reentrancy risks.
* **Immutable Terms:** Warranty duration and registration timestamps cannot be tampered with after issuance.

---

### Slide 9: Roadmap
* **Phase 1 (Live):** BOT Chain mainnet deployment, verified contract, public verification portal.
* **Phase 2 (Q1 2027):** Dynamic QR code generation for checkout receipt printing.
* **Phase 3 (Q2 2027):** Soulbound Token (SBT) digital warranty cards for buyers.
* **Phase 4 (Q3 2027):** POS plugins for Shopify, WooCommerce, and Square merchants.

---

### Slide 10: The Ask & Collaboration
* **BOT Chain Ecosystem Co-Marketing:**
  * Social spotlight on BOT Chain X/Telegram/Discord channels.
  * Ecosystem directory inclusion.
  * Co-hosting community AMAs on real-world Web3 retail applications.
* **Official Links:**
  * **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
  * **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
  * **App Repo:** [github.com/liljhnxn/warrantygo](https://github.com/liljhnxn/warrantygo)
  * **Contract:** [scan.botchain.ai/address/0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F](https://scan.botchain.ai/address/0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F)
