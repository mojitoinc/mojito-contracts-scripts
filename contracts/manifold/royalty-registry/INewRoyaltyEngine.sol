// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @dev Lookup engine interface
 */
interface INewRoyaltyEngine is IERC165 {
    /**
     * Get the royalty for a given token (address, id).  Does not cache the bps/amounts. 
     *
     * @param tokenAddress - The address of the token
     * @param tokenId      - The id of the token
     * returns Two arrays of equal length, royalty recipients and the corresponding basic points each recipient should get
     */
    function getRoyalty(address tokenAddress, uint256 tokenId)
        external
        returns (address payable[] memory recipients, uint256[] memory bps);
}