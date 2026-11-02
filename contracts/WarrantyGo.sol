// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WarrantyGo
 * @notice Decentralized warranty registration and verification for electronics shops, gadget sellers, and small businesses.
 * @dev Deployed on Botchain Testnet (Chain ID: 968).
 */
contract WarrantyGo {
    enum Status {
        Active,
        Expired,
        Cancelled
    }

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

    // State Variables
    uint256 private _totalWarranties;
    uint256 private _nextWarrantyId = 1001;

    mapping(uint256 => Warranty) private _warranties;
    mapping(address => uint256[]) private _sellerWarrantyIds;

    // Events
    event WarrantyRegistered(
        uint256 indexed warrantyId,
        address indexed seller,
        string productName,
        uint256 durationDays,
        uint256 registrationTimestamp,
        uint256 expiryTimestamp
    );

    event WarrantyStatusUpdated(
        uint256 indexed warrantyId,
        Status newStatus,
        address indexed updatedBy
    );

    // Custom Errors
    error EmptyProductName();
    error InvalidDuration();
    error WarrantyNotFound(uint256 warrantyId);
    error OnlySellerAllowed(address caller, address seller);
    error WarrantyAlreadyCancelled();
    error CannotReactivateCancelledWarranty();
    error InvalidStatusTransition();

    /**
     * @notice Register a new warranty for a sold product.
     * @param productName Name of the product (cannot be empty).
     * @param productDescription Short description or serial notes.
     * @param durationDays Duration in days for which warranty is valid (must be > 0).
     * @return warrantyId The unique ID generated for this warranty.
     */
    function registerWarranty(
        string calldata productName,
        string calldata productDescription,
        uint256 durationDays
    ) external returns (uint256) {
        if (bytes(productName).length == 0) {
            revert EmptyProductName();
        }
        if (durationDays == 0) {
            revert InvalidDuration();
        }

        uint256 warrantyId = _nextWarrantyId++;
        uint256 registrationTime = block.timestamp;
        uint256 expiryTime = registrationTime + (durationDays * 1 days);

        Warranty memory newWarranty = Warranty({
            id: warrantyId,
            seller: msg.sender,
            productName: productName,
            productDescription: productDescription,
            durationDays: durationDays,
            registrationTimestamp: registrationTime,
            expiryTimestamp: expiryTime,
            status: Status.Active
        });

        _warranties[warrantyId] = newWarranty;
        _sellerWarrantyIds[msg.sender].push(warrantyId);
        _totalWarranties++;

        emit WarrantyRegistered(
            warrantyId,
            msg.sender,
            productName,
            durationDays,
            registrationTime,
            expiryTime
        );

        return warrantyId;
    }

    /**
     * @notice Retrieve details of a warranty by its ID.
     * @dev Automatically reflects the Expired status if expiryTimestamp has passed.
     * @param warrantyId The unique ID of the warranty.
     * @return warranty The warranty struct with calculated live status.
     */
    function getWarranty(uint256 warrantyId) external view returns (Warranty memory) {
        Warranty memory warranty = _warranties[warrantyId];
        if (warranty.id == 0) {
            revert WarrantyNotFound(warrantyId);
        }

        // Compute dynamic status
        warranty.status = _resolveStatus(warranty);
        return warranty;
    }

    /**
     * @notice Retrieve all warranties registered by the calling seller.
     * @dev Returns an array of warranties with dynamic live statuses.
     * @return sellerWarranties Array of warranties registered by msg.sender.
     */
    function getMyWarranties() external view returns (Warranty[] memory) {
        uint256[] memory ids = _sellerWarrantyIds[msg.sender];
        Warranty[] memory list = new Warranty[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            Warranty memory w = _warranties[ids[i]];
            w.status = _resolveStatus(w);
            list[i] = w;
        }

        return list;
    }

    /**
     * @notice Get total number of warranties registered across the platform.
     */
    function getTotalWarranties() external view returns (uint256) {
        return _totalWarranties;
    }

    /**
     * @notice Update warranty status (e.g. mark as Cancelled).
     * @dev Only the original seller can update. A cancelled warranty can never be reactivated.
     * @param warrantyId The unique ID of the warranty.
     * @param newStatus The new status to apply.
     */
    function updateWarrantyStatus(uint256 warrantyId, Status newStatus) external {
        Warranty storage warranty = _warranties[warrantyId];
        if (warranty.id == 0) {
            revert WarrantyNotFound(warrantyId);
        }
        if (warranty.seller != msg.sender) {
            revert OnlySellerAllowed(msg.sender, warranty.seller);
        }
        if (warranty.status == Status.Cancelled) {
            revert WarrantyAlreadyCancelled();
        }
        if (newStatus == Status.Active) {
            revert CannotReactivateCancelledWarranty();
        }

        warranty.status = newStatus;

        emit WarrantyStatusUpdated(warrantyId, newStatus, msg.sender);
    }

    /**
     * @dev Internal helper to determine dynamic status: Cancelled, Expired, or Active.
     */
    function _resolveStatus(Warranty memory warranty) internal view returns (Status) {
        if (warranty.status == Status.Cancelled) {
            return Status.Cancelled;
        }
        if (block.timestamp > warranty.expiryTimestamp) {
            return Status.Expired;
        }
        return Status.Active;
    }
}

