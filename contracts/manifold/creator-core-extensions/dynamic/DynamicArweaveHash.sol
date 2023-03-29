// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @author: manifold.xyz

import "../../../openzeppelin/access/Ownable.sol";
import "../../../openzeppelin/utils/Strings.sol";

import "../../creator-core/core/IERC721CreatorCore.sol";
import "../../creator-core/extensions/CreatorExtension.sol";
import "../../creator-core/extensions/ICreatorExtensionTokenURI.sol";

import "../libraries/SingleCreatorExtension.sol";

abstract contract DynamicArweaveHash is
    ERC721SingleCreatorExtension,
    CreatorExtension,
    Ownable,
    ICreatorExtensionTokenURI
{
    using Strings for uint256;

    string[] public imageArweaveHashes;
    string[] public animationArweaveHashes;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(CreatorExtension, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(ICreatorExtensionTokenURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function mint(address to) public virtual onlyOwner returns (uint256) {
        return IERC721CreatorCore(_creator).mintExtension(to);
    }

    function tokenURI(address, uint256 tokenId)
        external
        view
        virtual
        override
        returns (string memory)
    {
        string memory uri = string(
            abi.encodePacked(
                'data:application/json;utf8,{"name":"',
                _getName(),
                '","description":"',
                _getDescription()
            )
        );
        if (imageArweaveHashes.length > 0) {
            uri = string(
                abi.encodePacked(
                    uri,
                    '", "image":"https://arweave.net/',
                    _getImageHash(tokenId)
                )
            );
        }
        if (animationArweaveHashes.length > 0) {
            uri = string(
                abi.encodePacked(
                    uri,
                    '", "animation_url":"https://arweave.net/',
                    _getAnimationHash(tokenId)
                )
            );
        }
        uri = string(abi.encodePacked(uri, '"}'));
        return uri;
    }

    function _getName() internal view virtual returns (string memory);

    function _getDescription() internal view virtual returns (string memory);

    function _getImageHash(uint256 tokenId)
        internal
        view
        virtual
        returns (string memory);

    function _getAnimationHash(uint256 tokenId)
        internal
        view
        virtual
        returns (string memory);

    function setImageArweaveHashes(string[] memory _arweaveHashes)
        external
        virtual
    {
        imageArweaveHashes = _arweaveHashes;
    }

    function setAnimationAreaveHashes(string[] memory _arweaveHashes)
        external
        virtual
    {
        animationArweaveHashes = _arweaveHashes;
    }
}
