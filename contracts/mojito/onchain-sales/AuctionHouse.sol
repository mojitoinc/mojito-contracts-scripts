// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import {SafeMath} from "../../openzeppelin/utils/math/SafeMath.sol";
import {IERC721, IERC165} from "../../openzeppelin/token/ERC721/IERC721.sol";
import {ERC1155TokenReceiver} from "../../gnosis/interfaces/ERC1155TokenReceiver.sol";
import {IERC1155} from "../../openzeppelin/token/ERC1155/IERC1155.sol";
import {ReentrancyGuard} from "../../openzeppelin/security/ReentrancyGuard.sol";
import {IERC20} from "../../openzeppelin/token/ERC20/IERC20.sol";
import {SafeERC20} from "../../openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {Counters} from "../../openzeppelin/utils/Counters.sol";
import {IAuctionHouse} from "./../interfaces/IAuctionHouse.sol";
import {ICreatorCore} from "../../manifold/creator-core/core/ICreatorCore.sol";

interface IWETH {
    function deposit() external payable;

    function withdraw(uint256 wad) external;

    function transfer(address to, uint256 value) external returns (bool);
}

/**
 * @title An open auction house, enabling collectors and curators to run their own auctions
 */
contract AuctionHouse is IAuctionHouse, ReentrancyGuard, ERC1155TokenReceiver {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The minimum percentage difference between the last bid amount and the current bid.
    uint8 public minBidIncrementPercentage;

    // The address of the NFT protocol to use via this contract
    address public nftAddress;

    // / The address of the WETH contract, so that any ETH transferred can be handled as an ERC-20
    address public wethAddress;

    // A mapping of all of the auctions currently running.
    mapping(uint256 => IAuctionHouse.Auction) public auctions;

    bytes4 constant erc721_interfaceId = 0x80ac58cd; // 721 interface id
    bytes4 constant erc1155_interfaceId = 0xd9b67a26; // 1155 interface id

    Counters.Counter private _auctionIdTracker;

    /**
     * @notice Require that the specified auction exists
     */
    modifier auctionExists(uint256 auctionId) {
        require(_exists(auctionId), "Auction doesn't exist");
        _;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    /*
     * Constructor
     */
    constructor(address _nftAddress, address _weth) {
        require(
            (IERC165(_nftAddress).supportsInterface(erc721_interfaceId) ||
                IERC165(_nftAddress).supportsInterface(erc1155_interfaceId)),
            "Doesn't support NFT interface"
        );
        nftAddress = _nftAddress;
        wethAddress = _weth;
        timeBuffer = 15 * 60; // extend 15 minutes after every bid made in last 15 minutes
        minBidIncrementPercentage = 5; // 5%
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the auctions mapping and emit an AuctionCreated event.
     * If there is no curator, or if the curator is the auction creator, automatically approve the auction.
     */
    function createAuction(
        uint256 tokenId,
        address tokenContract,
        uint256 duration,
        uint256 reservePrice,
        address payable curator,
        uint8 curatorFeePercentage,
        address auctionCurrency,
        uint256 maxPrice,
        uint256 startTime
    ) public override nonReentrant returns (uint256) {
        require(
            (IERC165(tokenContract).supportsInterface(erc721_interfaceId) ||
                IERC165(tokenContract).supportsInterface(erc1155_interfaceId)),
            "tokenContract does not support ERC721 or ERC1155 interface"
        );
        require(
            curatorFeePercentage < 100,
            "curatorFeePercentage must be less than 100"
        );
        require(
            maxPrice > reservePrice,
            "maxPrice should be greater than reservePrice"
        );
        uint256 auctionId = _auctionIdTracker.current();
        uint256 quantity = 1;
        address tokenOwner;
        if (IERC165(tokenContract).supportsInterface(erc721_interfaceId)) {
            tokenOwner = IERC721(tokenContract).ownerOf(tokenId);
            require(
                msg.sender == IERC721(tokenContract).getApproved(tokenId) ||
                    msg.sender == tokenOwner,
                "Caller must be approved or owner for token id"
            );
            require(
                IERC721(tokenContract).isApprovedForAll(
                    tokenOwner,
                    address(this)
                ),
                "Contract Address should be approved"
            );
        } else {
            quantity = IERC1155(tokenContract).balanceOf(msg.sender, tokenId);
            require(
                quantity > 0,
                "There should be atleast one qty in the owner address and the tokenID"
            );
            require(
                IERC1155(tokenContract).isApprovedForAll(
                    tokenOwner,
                    address(this)
                ),
                "Contract Address should be approved"
            );
            tokenOwner = msg.sender;
        }
        auctions[auctionId] = Auction({
            tokenId: tokenId,
            tokenContract: tokenContract,
            approved: false,
            amount: 0,
            startTime: startTime,
            maxPrice: maxPrice,
            duration: duration,
            firstBidTime: 0,
            reservePrice: reservePrice,
            curatorFeePercentage: curatorFeePercentage,
            tokenOwner: tokenOwner,
            bidder: payable(address(0)),
            curator: curator,
            auctionCurrency: auctionCurrency
        });
        _auctionIdTracker.increment();

        emit AuctionCreated(
            auctionId,
            tokenId,
            tokenContract,
            duration,
            reservePrice,
            msg.sender,
            curator,
            curatorFeePercentage,
            auctionCurrency,
            quantity
        );

        if (
            auctions[auctionId].curator == address(0) || curator == msg.sender
        ) {
            _approveAuction(auctionId, true);
        }

        return auctionId;
    }

    /**
     * @notice Approve an auction, opening up the auction for bids.
     * @dev Only callable by the curator. Cannot be called if the auction has already started.
     */
    function setAuctionApproval(uint256 auctionId, bool approved)
        external
        override
        auctionExists(auctionId)
    {
        require(
            msg.sender == auctions[auctionId].curator,
            "Must be auction curator"
        );
        require(
            auctions[auctionId].firstBidTime == 0,
            "Auction has already started"
        );
        _approveAuction(auctionId, approved);
    }

    function setAuctionReservePrice(uint256 auctionId, uint256 reservePrice)
        external
        override
        auctionExists(auctionId)
    {
        require(
            msg.sender == auctions[auctionId].curator ||
                msg.sender == auctions[auctionId].tokenOwner,
            "Must be auction curator or token owner"
        );
        require(
            auctions[auctionId].firstBidTime == 0,
            "Auction has already started"
        );
        require(
            auctions[auctionId].maxPrice > reservePrice,
            "reservePrice must be less than maxPrice"
        );

        auctions[auctionId].reservePrice = reservePrice;

        emit AuctionReservePriceUpdated(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].tokenContract,
            reservePrice
        );
    }

    /**
     * @notice Create a bid on a token, with a given amount.
     * @dev If provided a valid bid, transfers the provided amount to this contract.
     * If the auction is run in native ETH, the ETH is wrapped so it can be identically to other
     * auction currencies in this contract.
     */
    function createBid(uint256 auctionId, uint256 amount)
        external
        payable
        override
        auctionExists(auctionId)
        nonReentrant
    {
        require(
            auctions[auctionId].startTime < block.timestamp,
            "auction has not yet started"
        );
        address payable lastBidder = auctions[auctionId].bidder;
        require(
            auctions[auctionId].approved,
            "Auction must be approved by curator"
        );
        require(
            auctions[auctionId].firstBidTime == 0 ||
                block.timestamp <
                auctions[auctionId].firstBidTime.add(
                    auctions[auctionId].duration
                ),
            "Auction expired"
        );
        require(
            amount >= auctions[auctionId].reservePrice,
            "Must send at least reservePrice"
        );
        require(
            amount >=
                auctions[auctionId].amount.add(
                    auctions[auctionId]
                        .amount
                        .mul(minBidIncrementPercentage)
                        .div(100)
                ),
            "Must send more than last bid by minBidIncrementPercentage amount"
        );

        // If this is the first valid bid, we should set the starting time now.
        // If it's not, then we should refund the last bidder
        if (auctions[auctionId].firstBidTime == 0) {
            auctions[auctionId].firstBidTime = block.timestamp;
        } else if (lastBidder != address(0)) {
            _handleOutgoingBid(
                lastBidder,
                auctions[auctionId].amount,
                auctions[auctionId].auctionCurrency
            );
        }

        _handleIncomingBid(amount, auctions[auctionId].auctionCurrency);

        auctions[auctionId].amount = amount;
        auctions[auctionId].bidder = payable(msg.sender);

        if (amount < auctions[auctionId].maxPrice) {
            bool extended = false;
            // at this point we know that the timestamp is less than start + duration (since the auction would be over, otherwise)
            // we want to know by how much the timestamp is less than start + duration
            // if the difference is less than the timeBuffer, increase the duration by the timeBuffer
            if (
                auctions[auctionId]
                    .firstBidTime
                    .add(auctions[auctionId].duration)
                    .sub(block.timestamp) < timeBuffer
            ) {
                // Playing code golf for gas optimization:
                // uint256 expectedEnd = auctions[auctionId].firstBidTime.add(auctions[auctionId].duration);
                // uint256 timeRemaining = expectedEnd.sub(block.timestamp);
                // uint256 timeToAdd = timeBuffer.sub(timeRemaining);
                // uint256 newDuration = auctions[auctionId].duration.add(timeToAdd);
                uint256 oldDuration = auctions[auctionId].duration;
                auctions[auctionId].duration = oldDuration.add(
                    timeBuffer.sub(
                        auctions[auctionId].firstBidTime.add(oldDuration).sub(
                            block.timestamp
                        )
                    )
                );
                extended = true;
            }

            emit AuctionBid(
                auctionId,
                auctions[auctionId].tokenId,
                auctions[auctionId].tokenContract,
                msg.sender,
                amount,
                lastBidder == address(0), // firstBid boolean
                extended
            );

            if (extended) {
                emit AuctionDurationExtended(
                    auctionId,
                    auctions[auctionId].tokenId,
                    auctions[auctionId].tokenContract,
                    auctions[auctionId].duration
                );
            }
        } else {
            _endAuction(auctionId);
        }
    }

    /**
     * @notice End an auction, finalizing the bid and paying out the respective parties.
     * @dev If for some reason the auction cannot be finalized (invalid token recipient, for example),
     * The auction is reset and the NFT is transferred back to the auction creator.
     */
    function endAuction(uint256 auctionId)
        external
        override
        auctionExists(auctionId)
        nonReentrant
    {
        require(
            uint256(auctions[auctionId].firstBidTime) != 0,
            "Auction hasn't begun"
        );
        require(
            block.timestamp >=
                auctions[auctionId].firstBidTime.add(
                    auctions[auctionId].duration
                ),
            "Auction hasn't completed"
        );

        _endAuction(auctionId);
    }

    /**
     * @notice Cancel an auction.
     * @dev Transfers the NFT back to the auction creator and emits an AuctionCanceled event
     */
    function cancelAuction(uint256 auctionId)
        external
        override
        nonReentrant
        auctionExists(auctionId)
    {
        require(
            auctions[auctionId].tokenOwner == msg.sender ||
                auctions[auctionId].curator == msg.sender,
            "Can only be called by auction creator or curator"
        );
        require(
            uint256(auctions[auctionId].firstBidTime) == 0,
            "Can't cancel an auction once it's begun"
        );
        _cancelAuction(auctionId);
    }

    /**
     * @dev Given an amount and a currency, transfer the currency to this contract.
     * If the currency is ETH (0x0), attempt to wrap the amount as WETH
     */
    function _handleIncomingBid(uint256 amount, address currency) internal {
        // If this is an ETH bid, ensure they sent enough and convert it to WETH under the hood
        if (currency == address(0)) {
            require(
                msg.value == amount,
                "Sent ETH Value does not match specified bid amount"
            );
            IWETH(wethAddress).deposit{value: amount}();
        } else {
            // We must check the balance that was actually transferred to the auction,
            // as some tokens impose a transfer fee and would not actually transfer the
            // full amount to the market, resulting in potentally locked funds
            IERC20 token = IERC20(currency);
            uint256 beforeBalance = token.balanceOf(address(this));
            token.safeTransferFrom(msg.sender, address(this), amount);
            uint256 afterBalance = token.balanceOf(address(this));
            require(
                beforeBalance.add(amount) == afterBalance,
                "Token transfer call did not transfer expected amount"
            );
        }
    }

    function _handleOutgoingBid(
        address to,
        uint256 amount,
        address currency
    ) internal {
        // If the auction is in ETH, unwrap it from its underlying WETH and try to send it to the recipient.
        if (currency == address(0)) {
            IWETH(wethAddress).withdraw(amount);

            // If the ETH transfer fails (sigh), rewrap the ETH and try send it as WETH.
            if (!_safeTransferETH(to, amount)) {
                IWETH(wethAddress).deposit{value: amount}();
                IERC20(wethAddress).safeTransfer(to, amount);
            }
        } else {
            IERC20(currency).safeTransfer(to, amount);
        }
    }

    function _safeTransferETH(address to, uint256 value)
        internal
        returns (bool)
    {
        (bool success, ) = to.call{value: value}(new bytes(0));
        return success;
    }

    function _cancelAuction(uint256 auctionId) internal {
        address tokenOwner = auctions[auctionId].tokenOwner;
        uint256 quantity = 1;
        if (
            IERC165(auctions[auctionId].tokenContract).supportsInterface(
                erc1155_interfaceId
            )
        ) {
            quantity = IERC1155(auctions[auctionId].tokenContract).balanceOf(
                tokenOwner,
                auctions[auctionId].tokenId
            );
        }
        emit AuctionCanceled(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].tokenContract,
            tokenOwner,
            quantity
        );
        delete auctions[auctionId];
    }

    function _approveAuction(uint256 auctionId, bool approved) internal {
        auctions[auctionId].approved = approved;
        emit AuctionApprovalUpdated(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].tokenContract,
            approved
        );
    }

    function _exists(uint256 auctionId) internal view returns (bool) {
        return auctions[auctionId].tokenOwner != address(0);
    }

    function _endAuction(uint256 auctionId) internal {
        uint256 quantity = 1;
        address currency = auctions[auctionId].auctionCurrency == address(0)
            ? wethAddress
            : auctions[auctionId].auctionCurrency;
        uint256 curatorFee = 0;

        uint256 tokenOwnerProfit = auctions[auctionId].amount;

        // Otherwise, transfer the token to the winner and pay out the participants below
        if (
            IERC165(auctions[auctionId].tokenContract).supportsInterface(
                erc721_interfaceId
            )
        ) {
            try
                IERC721(auctions[auctionId].tokenContract).safeTransferFrom(
                    address(this),
                    auctions[auctionId].bidder,
                    auctions[auctionId].tokenId
                )
            {} catch {
                _handleOutgoingBid(
                    auctions[auctionId].bidder,
                    auctions[auctionId].amount,
                    auctions[auctionId].auctionCurrency
                );
                _cancelAuction(auctionId);
                return;
            }
        } else {
            bytes memory data = "0x";
            quantity = IERC1155(auctions[auctionId].tokenContract).balanceOf(
                address(this),
                auctions[auctionId].tokenId
            );
            try
                IERC1155(auctions[auctionId].tokenContract).safeTransferFrom(
                    address(this),
                    auctions[auctionId].bidder,
                    auctions[auctionId].tokenId,
                    quantity,
                    data
                )
            {} catch {
                _handleOutgoingBid(
                    auctions[auctionId].bidder,
                    auctions[auctionId].amount,
                    auctions[auctionId].auctionCurrency
                );
                _cancelAuction(auctionId);
                return;
            }
        }

        if (auctions[auctionId].curator != address(0)) {
            curatorFee = tokenOwnerProfit
                .mul(auctions[auctionId].curatorFeePercentage)
                .div(100);
            tokenOwnerProfit = tokenOwnerProfit.sub(curatorFee);
            _handleOutgoingBid(
                auctions[auctionId].curator,
                curatorFee,
                auctions[auctionId].auctionCurrency
            );
        }
        tokenOwnerProfit = _handleRoyaltyEnginePayout(
            auctions[auctionId].tokenContract,
            auctions[auctionId].tokenId,
            tokenOwnerProfit,
            auctions[auctionId].auctionCurrency
        );
        _handleOutgoingBid(
            auctions[auctionId].tokenOwner,
            tokenOwnerProfit,
            auctions[auctionId].auctionCurrency
        );

        emit AuctionEnded(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].tokenContract,
            auctions[auctionId].tokenOwner,
            auctions[auctionId].curator,
            auctions[auctionId].bidder,
            tokenOwnerProfit,
            curatorFee,
            currency,
            quantity
        );
        delete auctions[auctionId];
    }

    function _handleRoyaltyEnginePayout(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _amount,
        address _payoutCurrency
    ) internal returns (uint256) {
        // Get the royalty recipients and their associated amounts
        (
            address payable[] memory recipients,
            uint256[] memory amounts
        ) = ICreatorCore(_tokenContract).getRoyalties(_tokenId);

        // Store the number of recipients
        uint256 numRecipients = recipients.length;
        require(numRecipients != 0, "Royalty Recipients Zer");
        // If there are no royalties, return the initial amount
        if (numRecipients == 0) return _amount;

        // Store the initial amount
        uint256 amountRemaining = _amount;

        // Store the variables that cache each recipient and amount
        address recipient;
        uint256 amount;

        // Payout each royalty
        for (uint256 i = 0; i < numRecipients; ) {
            // Cache the recipient and amount
            recipient = recipients[i];
            amount = amounts[i];

            // Ensure that we aren't somehow paying out more than we have
            require(amountRemaining >= (amount * _amount) / 10000, "insolvent");

            // Transfer to the recipient
            _handleOutgoingBid(recipient, amount, _payoutCurrency);

            emit RoyaltyPayout(_tokenContract, _tokenId, recipient, amount);

            // Cannot underflow as remaining amount is ensured to be greater than or equal to royalty amount
            unchecked {
                amountRemaining -= amount;
                ++i;
            }
        }

        return amountRemaining;
    }

    // TODO: consider reverting if the message sender is not WETH
    receive() external payable {}

    fallback() external payable {}
}
