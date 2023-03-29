// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @author: manifold.xyz

import "../../creator-core/ERC721Creator.sol";
import "../../creator-core/mocks/MockERC721.sol";
import "../../creator-core/mocks/MockERC1155.sol";

import "../enumerable/ERC721/ERC721OwnerEnumerableExtension.sol";
import "../enumerable/ERC721/ERC721OwnerEnumerableSingleCreatorExtension.sol";
import "../redeem/ERC721/ERC721RedeemBase.sol";

contract MockTestERC721Creator is ERC721Creator {
    constructor(string memory _name, string memory _symbol)
        ERC721Creator(_name, _symbol)
    {}
}

contract MockTestERC721 is MockERC721 {
    constructor(string memory _name, string memory _symbol)
        MockERC721(_name, _symbol)
    {}
}

contract MockTestERC1155 is MockERC1155 {
    constructor(string memory uri) MockERC1155(uri) {}
}

contract MockERC721OwnerEnumerableExtension is ERC721OwnerEnumerableExtension {
    function testMint(address creator, address to) public {
        ERC721Creator(creator).mintExtension(to);
    }
}

contract MockERC721OwnerEnumerableSingleCreatorExtension is
    ERC721OwnerEnumerableSingleCreatorExtension
{
    constructor(address creator)
        ERC721OwnerEnumerableSingleCreatorExtension(creator)
    {}

    function testMint(address to) public {
        ERC721Creator(_creator).mintExtension(to);
    }
}

contract MockERC721RedeemEnumerable is
    ERC721OwnerEnumerableSingleCreatorBase,
    ERC721RedeemBase
{
    constructor(
        address creator,
        uint16 redemptionRate_,
        uint16 redemptionMax_
    ) ERC721RedeemBase(creator, redemptionRate_, redemptionMax_) {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721RedeemBase, ERC721CreatorExtensionApproveTransfer)
        returns (bool)
    {
        return
            ERC721RedeemBase.supportsInterface(interfaceId) ||
            ERC721CreatorExtensionApproveTransfer.supportsInterface(
                interfaceId
            );
    }
}
