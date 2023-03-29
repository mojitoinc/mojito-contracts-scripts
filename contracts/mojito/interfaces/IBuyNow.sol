// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

/**
 * @title Interface for Sale Houses
 */
interface IBuyNow {
    struct Sale {
        // ID for the ERC721 or ERC1155 token
        uint256 tokenId;
        // Address for the ERC721 or ERC1155 contract
        address tokenContract;
        // Whether or not the curator has approved the sale to start
        bool approved;
        // The  price of the NFT
        uint256 fixedPrice;
        // The address that should receive the funds once the NFT is sold.
        address tokenOwner;
        // The address of the buyer
        address payable buyer;

        // The quantity of the token
        uint256 quantity;
        // Whitelisted Address
        address whitelistedBuyer;
        // The address of the ERC-20 currency to run the sale with.
        // If set to 0x0, the sale will be run in ETH
        address saleCurrency;
    }

    event SaleCreated(
        uint256 indexed saleId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        uint256 fixedPrice,
        address tokenOwner,
        address curator,
        uint8 curatorFeePercentage,
        address saleCurrency,
        uint256 quantity,
        address whitelistedBuyer
    );

    event SaleApprovalUpdated(
        uint256 indexed saleId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        bool approved
    );

    event SaleFixedPriceUpdated(
        uint256 indexed saleId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        uint256 fixedPrice
    );

    event SaleEnded(
        uint256 indexed saleId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address tokenOwner,
        address curator,
        address buyer,
        uint256 amount,
        uint256 curatorFee,
        address saleCurrency,
        uint256 quantity
    );

    event SaleCanceled(
        uint256 indexed saleId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address tokenOwner,
        uint256 quantity
    );

    event RoyaltyPayout(
        address indexed tokenContract,
        uint256 indexed tokenId,
        address recipient,
        uint256 amount
    );

    function createSale(
        uint256 tokenId,
        address tokenContract,
        uint256 fixedPrice,
        uint256 quantity,
        address saleCurrency,
        address whitelistedBuyer
    ) external returns (uint256);

    function setSaleApproval(uint256 saleId, bool approved) external;

    function setSaleFixedPrice(uint256 saleId, uint256 fixedPrice) external;

    function buy(uint256 saleId, uint256 amount) external payable;

    function cancelSale(uint256 saleId) external;
}
