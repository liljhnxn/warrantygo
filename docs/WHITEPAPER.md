# WarrantyGo Whitepaper
**A Decentralized, Tamper-Proof On-Chain Warranty Registry & Verification Protocol**

*Version 1.0 — November 2026*  
*Target Network: Botchain (Chain ID: 968)*  
*Smart Contract Address:* `0x94C031c1e7D0243bb0dC68a80B8b37EBA46AB29B`  
*Explorer:* [BohrScan Contract](https://scan.bohr.life/address/0x94C031c1e7D0243bb0dC68a80B8b37EBA46AB29B#code)  

---

## 1. Executive Summary

Consumer electronics, mobile gadgets, and appliance retail represent a multi-hundred-billion-dollar global market. However, post-sale warranty management remains fundamentally broken. Retailers rely on thermal paper receipts that fade within months, fragile paper guarantee cards, or closed centralized databases vulnerable to data loss and disputes.

**WarrantyGo** is a decentralized protocol built on **Botchain** that transforms physical product warranties into permanent, verifiable on-chain certificates. It enables electronics shops, gadget retailers, and independent merchants to issue immutable warranty records with custom terms and automated lifecycles. Crucially, **customers can instantly verify warranty authenticity and remaining coverage without creating an account, installing an app, or connecting a crypto wallet.**

---

## 2. Problem Statement

Modern retail warranty administration suffers from three critical failure modes:

1. **Receipt Degradation & Customer Loss:**  
   Over 70% of physical thermal receipts fade or become illegible within 6 to 12 months. When a device malfunctions, customers struggle to prove warranty validity, causing friction and negative brand experiences.

2. **Warranty Fraud & Counterfeiting:**  
   Secondary market buyers have no reliable way to verify if a pre-owned smartphone, laptop, or gaming console is genuinely covered by seller warranty. Fraudulent claims and altered paper invoices cost small retailers billions annually.

3. **Centralized Silos & High Maintenance Overheads:**  
   SaaS warranty solutions require expensive monthly subscriptions, vendor lock-in, and constant database maintenance. If a retailer closes or migrates software, historical customer warranty claims are lost.

---

## 3. The WarrantyGo Solution

WarrantyGo bridges retail commerce and Web3 infrastructure by providing:

* **Zero-Barrier Public Verification:** Anyone with a Warranty ID can query the public blockchain RPC node in real-time, receiving verifiable proof of coverage, purchase date, and exact expiration.
* **Autonomous On-Chain Lifecycles:** The smart contract natively calculates expiration dates and dynamically transitions warranty states (`Active` → `Expired`) without requiring recurring transactions, cron bots, or gas expenditure.
* **Immutable Seller Authority:** Only the original issuing seller wallet retains permission to cancel or void a warranty record (e.g. upon full refund or customer fraud). Once voided, a record can never be reactivated.
* **Privacy by Design:** Zero Personally Identifiable Information (PII) such as customer names, residential addresses, or phone numbers is committed to the public ledger.

---

## 4. Technical Architecture

### 4.1 System Overview

```text
+-----------------------------------------------------------------+
|                         WARRANTYGO dAPP                         |
|   (Next.js 14 App Router, TypeScript, Tailwind CSS, wagmi v2)   |
+-------------------------------+---------------------------------+
                                |
             +------------------+------------------+
             |                                     |
    [Seller Actions]                       [Customer Lookup]
    (MetaMask / Injected Wallet)            (Public RPC Client - No Wallet)
             |                                     |
             v                                     v
+-----------------------------------------------------------------+
|                       BOTCHAIN TESTNET                          |
|             (Chain ID: 968 | RPC: https://rpc.bohr.life)         |
|                                                                 |
|   +---------------------------------------------------------+   |
|   |                   WarrantyGo.sol                        |   |
|   |  - registerWarranty(name, desc, durationDays)           |   |
|   |  - getWarranty(warrantyId)                              |   |
|   |  - getMyWarranties()                                    |   |
|   |  - updateWarrantyStatus(warrantyId, status)             |   |
|   +---------------------------------------------------------+   |
+-----------------------------------------------------------------+
```

### 4.2 Core Smart Contract Specification (`WarrantyGo.sol`)

* **Solidity Version:** `^0.8.24` (EVM target: Paris, optimized with 200 runs).
* **Storage Optimization:** Sequential counter-based indexing starting from `1001` for human-readable IDs.
* **State Machine:**
  * `Active (0)`: Valid, non-expired coverage.
  * `Expired (1)`: Auto-evaluated dynamic state when `block.timestamp > expiryTimestamp`.
  * `Cancelled (2)`: Explicitly marked by original seller; permanent and irrevocable.

```solidity
struct Warranty {
    uint256 id;
    address seller;
    string productName;
    string productDescription;
    uint256 durationDays;
    uint256 registrationTimestamp;
    uint256 expiryTimestamp;
    Status status;
}
```

### 4.3 Custom Errors and Gas Optimization
Rather than consuming storage for verbose revert strings, WarrantyGo utilizes EVM custom errors:
* `EmptyProductName()`
* `InvalidDuration()`
* `WarrantyNotFound(uint256 warrantyId)`
* `OnlySellerAllowed(address caller, address seller)`
* `WarrantyAlreadyCancelled()`
* `CannotReactivateCancelledWarranty()`

---

## 5. Security & Privacy Model

1. **Non-Custodial & Payment-Free:** WarrantyGo executes pure logic operations. The contract does not accept, hold, or route ETH/BOT tokens, eliminating reentrancy and drainage attack vectors.
2. **Access Control:** Mutation methods (`updateWarrantyStatus`) strictly compare `msg.sender == warranty.seller`.
3. **No Central Admin Backdoor:** There is no contract owner, paused state, or upgrade proxy that can alter past issued warranties.
4. **GDPR / CCPA Alignment:** Because no personal identities or contact details are recorded, records remain fully compliant with consumer privacy mandates.

---

## 6. Synergy with Botchain Ecosystem

Botchain provides the ideal high-throughput, low-latency trust rail for WarrantyGo:
* **Sub-Cent Gas Fees:** Retailers can issue thousands of warranty certificates with negligible operational overhead.
* **EVM Compatibility:** Seamless integration with standard tooling (Hardhat, Viem, Wagmi, MetaMask).
* **AI Agent Readiness:** Future AI warranty agents can autonomously verify and approve repair claims using BohrScan API endpoints.

---

## 7. Roadmap

* **Phase 1 (Completed):** Smart contract deployment on Botchain Testnet, complete unit test coverage, and responsive Next.js frontend with zero-wallet public verification.
* **Phase 2 (Q1 2027):** QR Code generation on registration receipts for instant in-store scanning at checkout.
* **Phase 3 (Q2 2027):** Optional Soulbound NFT / ERC-721 digital warranty card claimable by the buyer.
* **Phase 4 (Q3 2027):** Merchant POS (Point of Sale) SDK plugins for Shopify, WooCommerce, and Square.

---

## 8. Conclusion

WarrantyGo demonstrates how decentralized ledger technology directly solves tangible retail pain points. By eliminating paper waste, preventing warranty fraud, and prioritizing customer privacy, WarrantyGo establishes a new benchmark for post-purchase trust and transparency.
