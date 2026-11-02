import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { WarrantyGo } from "../typechain-types";

describe("WarrantyGo Smart Contract", function () {
  let warrantyGo: any;
  let seller: any;
  let buyer: any;
  let otherSeller: any;

  beforeEach(async function () {
    [seller, buyer, otherSeller] = await ethers.getSigners();
    const WarrantyGoFactory = await ethers.getContractFactory("WarrantyGo");
    warrantyGo = await WarrantyGoFactory.deploy();
    await warrantyGo.waitForDeployment();
  });

  describe("Warranty Registration", function () {
    it("should register a warranty with valid inputs", async function () {
      const tx = await warrantyGo.connect(seller).registerWarranty(
        "iPhone 15 Pro",
        "Space Black 256GB - Serial: AP982137",
        365
      );
      await tx.wait();

      expect(await warrantyGo.getTotalWarranties()).to.equal(1n);

      const warranty = await warrantyGo.getWarranty(1001);
      expect(warranty.id).to.equal(1001n);
      expect(warranty.seller).to.equal(seller.address);
      expect(warranty.productName).to.equal("iPhone 15 Pro");
      expect(warranty.productDescription).to.equal("Space Black 256GB - Serial: AP982137");
      expect(warranty.durationDays).to.equal(365n);
      expect(warranty.status).to.equal(0); // Status.Active = 0
    });

    it("should generate unique incremental Warranty IDs", async function () {
      await warrantyGo.connect(seller).registerWarranty("MacBook Pro", "M3 Max 32GB", 365);
      await warrantyGo.connect(seller).registerWarranty("Sony WH-1000XM5", "Silver ANC headphones", 180);

      const w1 = await warrantyGo.getWarranty(1001);
      const w2 = await warrantyGo.getWarranty(1002);

      expect(w1.id).to.equal(1001n);
      expect(w2.id).to.equal(1002n);
      expect(await warrantyGo.getTotalWarranties()).to.equal(2n);
    });

    it("should reject registration with empty product name", async function () {
      await expect(
        warrantyGo.connect(seller).registerWarranty("", "No name provided", 90)
      ).to.be.revertedWithCustomError(warrantyGo, "EmptyProductName");
    });

    it("should reject registration with zero warranty duration", async function () {
      await expect(
        warrantyGo.connect(seller).registerWarranty("iPad Air", "64GB Starlight", 0)
      ).to.be.revertedWithCustomError(warrantyGo, "InvalidDuration");
    });

    it("should correctly calculate expiry timestamps based on duration", async function () {
      const durationDays = 30n;
      const tx = await warrantyGo.connect(seller).registerWarranty(
        "PlayStation 5",
        "Digital Edition",
        durationDays
      );
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      const blockTimestamp = BigInt(block!.timestamp);

      const warranty = await warrantyGo.getWarranty(1001);
      expect(warranty.registrationTimestamp).to.equal(blockTimestamp);
      expect(warranty.expiryTimestamp).to.equal(blockTimestamp + durationDays * 86400n);
    });

    it("should emit WarrantyRegistered event", async function () {
      await expect(
        warrantyGo.connect(seller).registerWarranty("AirPods Pro 2", "USB-C MagSafe", 180)
      )
        .to.emit(warrantyGo, "WarrantyRegistered")
        .withArgs(1001n, seller.address, "AirPods Pro 2", 180n, (anyVal: any) => true, (anyVal: any) => true);
    });
  });

  describe("Warranty Retrieval & Verification", function () {
    beforeEach(async function () {
      await warrantyGo.connect(seller).registerWarranty("Dell XPS 15", "OLED 32GB RAM", 90);
    });

    it("should retrieve warranty details by valid ID", async function () {
      const warranty = await warrantyGo.getWarranty(1001);
      expect(warranty.productName).to.equal("Dell XPS 15");
      expect(warranty.seller).to.equal(seller.address);
      expect(warranty.status).to.equal(0); // Active
    });

    it("should revert if warranty ID does not exist", async function () {
      await expect(warrantyGo.getWarranty(9999)).to.be.revertedWithCustomError(
        warrantyGo,
        "WarrantyNotFound"
      );
    });

    it("should automatically detect expired warranties after expiry timestamp", async function () {
      // Register 30-day warranty
      await warrantyGo.connect(seller).registerWarranty("Logitech MX Master 3S", "Graphite", 30);
      const warrantyBefore = await warrantyGo.getWarranty(1002);
      expect(warrantyBefore.status).to.equal(0); // Active

      // Fast forward time by 31 days
      await time.increase(31 * 86400);

      const warrantyAfter = await warrantyGo.getWarranty(1002);
      expect(warrantyAfter.status).to.equal(1); // Expired = 1
    });

    it("should return seller-specific warranties with getMyWarranties", async function () {
      await warrantyGo.connect(seller).registerWarranty("Monitor LG 27GP850", "QHD 165Hz", 365);
      await warrantyGo.connect(otherSeller).registerWarranty("Keychron Q1", "Brown Switches", 180);

      const sellerWarranties = await warrantyGo.connect(seller).getMyWarranties();
      expect(sellerWarranties.length).to.equal(2);
      expect(sellerWarranties[0].productName).to.equal("Dell XPS 15");
      expect(sellerWarranties[1].productName).to.equal("Monitor LG 27GP850");

      const otherWarranties = await warrantyGo.connect(otherSeller).getMyWarranties();
      expect(otherWarranties.length).to.equal(1);
      expect(otherWarranties[0].productName).to.equal("Keychron Q1");
    });
  });

  describe("Warranty Cancellation & Permissions", function () {
    beforeEach(async function () {
      await warrantyGo.connect(seller).registerWarranty("GoPro Hero 12", "Black Edition", 365);
    });

    it("should allow original seller to cancel a warranty", async function () {
      await expect(warrantyGo.connect(seller).updateWarrantyStatus(1001, 2)) // Status.Cancelled = 2
        .to.emit(warrantyGo, "WarrantyStatusUpdated")
        .withArgs(1001n, 2, seller.address);

      const warranty = await warrantyGo.getWarranty(1001);
      expect(warranty.status).to.equal(2); // Cancelled
    });

    it("should prevent unauthorized callers from cancelling warranty", async function () {
      await expect(
        warrantyGo.connect(buyer).updateWarrantyStatus(1001, 2)
      ).to.be.revertedWithCustomError(warrantyGo, "OnlySellerAllowed");
    });

    it("should prevent cancelled warranties from being updated again", async function () {
      await warrantyGo.connect(seller).updateWarrantyStatus(1001, 2);

      // Attempting to cancel again
      await expect(
        warrantyGo.connect(seller).updateWarrantyStatus(1001, 2)
      ).to.be.revertedWithCustomError(warrantyGo, "WarrantyAlreadyCancelled");
    });

    it("should prevent cancelled warranties from being reactivated", async function () {
      await warrantyGo.connect(seller).updateWarrantyStatus(1001, 2);

      // Attempting to set back to Active (0)
      await expect(
        warrantyGo.connect(seller).updateWarrantyStatus(1001, 0)
      ).to.be.revertedWithCustomError(warrantyGo, "WarrantyAlreadyCancelled");
    });

    it("should reject setting status to Active even if not cancelled", async function () {
      // Trying to set active on an already active warranty
      await expect(
        warrantyGo.connect(seller).updateWarrantyStatus(1001, 0)
      ).to.be.revertedWithCustomError(warrantyGo, "CannotReactivateCancelledWarranty");
    });
  });
});
