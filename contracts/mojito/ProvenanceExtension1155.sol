// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../manifold/libraries-solidity/access/AdminControl.sol";
import "../manifold/creator-core/core/IERC1155CreatorCore.sol";
import "../openzeppelin/utils/math/SafeMath.sol";
import "../openzeppelin/utils/cryptography/ECDSA.sol";

contract ProvenanceExtension1155 is AdminControl {
    using SafeMath for uint256;
    using ECDSA for bytes32;

    address public CREATOR_CONTRACT;
    string public PROVENANCE_HASH = "";
    uint256 public MAX_CAP = 0;
    uint256 public MAX_QUANTITY = 0;
    uint256 public TOTAL_TOKENS = 0;
    mapping(uint256 => uint256) public tokenQuantity;
    mapping(bytes32 => bool) public isRedeemed;
   
    // Boolean for contract pause status
    bool public paused = false;

    struct Voucher {
        bytes32 id;
        address redeemer;
        uint256 amounts;
        int256 tokenId;
        bytes signature;
    }

    event Minted(address redeemer,uint256 amounts,uint256 tokenId);
    event Redeemed(bytes32 id,address redeemer,uint256 amounts,uint256 tokenId);
    
    constructor(address creator, uint256 maxCap,uint256 maxQuantity) {
        CREATOR_CONTRACT = creator;
        MAX_CAP = maxCap;
        MAX_QUANTITY = maxQuantity;
    }

    /**
     * @notice Set paused to true
     * @dev Can only be done by Admin
     */
    function unpauseContract() external adminRequired {
        require(paused, "Contract is unpaused.");
        paused = false;
    }

    /**
     * @notice Set paused to false
     * @dev Can only be done by Admin
     */
    function pauseContract() external adminRequired {
        require(!paused, "Contract is paused.");
        paused = true;
    }

    /**
     * @notice Mint the token to redeemer with amounts of qunatity 
     * if tokenId is -1, it mints token from new tokenId,
     * else it mints token from existing tokenId 
     * @dev Can only be done by Admin
     */
    function mintBatch(address redeemer,uint256 amounts,int256 tokenId)
        external
        adminRequired
        returns (uint256 token)
    {
        require(!paused, "Contract is paused.");
        require(amounts > 0, "Need to mint at least 1 token");
        if(tokenId == -1)
        {
        // Minting from New TokenIDs
            require(TOTAL_TOKENS.add(1) <= MAX_CAP,
                "Cannot exceed max supply of available tokens");
            require( amounts <= MAX_QUANTITY,
                "Cannot exceed max Quantity of token concerned");
            address[] memory _redeemer = new address[](1);
            _redeemer[0]=redeemer;
            uint256[] memory _amounts = new uint256[](1);
            _amounts[0]=amounts;
            string[] memory _uri=new string[](1);
            _uri[0]="";
            token = IERC1155CreatorCore(CREATOR_CONTRACT).mintExtensionNew(_redeemer,_amounts,_uri)[0];
            TOTAL_TOKENS += 1;
            tokenQuantity[token] += amounts;
        } 
        // Minting from existing TokenIDs
        else if( tokenId > -1)
        {
            token = uint256(tokenId);
            require(IERC1155CreatorCore(CREATOR_CONTRACT).totalSupply(token) > 0,
                "TokenId not Exists");
            require(tokenQuantity[token].add(amounts) <= MAX_QUANTITY,
                 "Cannot exceed max Quantity of token concerned");
            address[] memory _redeemer = new address[](1);
            _redeemer[0]=redeemer;
            uint256[] memory _tokenId = new uint256[](1);
            _tokenId[0]=token;
            uint256[] memory _amounts = new uint256[](1);
            _amounts[0]=amounts;
            IERC1155CreatorCore(CREATOR_CONTRACT).mintExtensionExisting(_redeemer,_tokenId,_amounts);
            tokenQuantity[token]+=amounts;
        }   
        emit Minted(redeemer,amounts,token);
      return token;  
    }

    /**
     * @notice Set provenance hash
     * @dev Can only be done by Admin
     */
    function setProvenanceHash(string memory provenanceHash)
        external
        adminRequired
    {
        PROVENANCE_HASH = provenanceHash;
    }

    /**
     * @notice Update extension's baseURI
     * @dev Can only be done by Admin
     */
    function setBaseURI(string memory baseURI_) external adminRequired 
    {
        IERC1155CreatorCore(CREATOR_CONTRACT).setBaseTokenURIExtension(baseURI_);
    }

    /**
     * @notice Redeems a voucher
     * @param voucher A signed voucher containing minting info
     */
    function redeem(Voucher calldata voucher)
        public
        returns (uint256 token)
    {
        require(!paused, "Contract is paused.");
        require(!isRedeemed[voucher.id], "VoucherNew has already been redeemed");
        require(voucher.amounts > 0, "Need to mint at least 1 token");
        if(voucher.tokenId == -1)
        {
        // Minting from New TokenIDs
            require(
            TOTAL_TOKENS.add(1) <= MAX_CAP,
                "Cannot exceed max supply of available tokens");
            require(voucher.amounts <= MAX_QUANTITY,
                "Cannot exceed max Quantity of token concerned");
            address signer = getVoucherSigner(voucher);
            require(isAdmin(signer),  "Signature invalid or signer is not an admin" );
            isRedeemed[voucher.id] = true;
            address[] memory _redeemer = new address[](1);
            _redeemer[0]=voucher.redeemer;
            uint256[] memory _amounts = new uint256[](1);
            _amounts[0]=voucher.amounts;
            string[] memory _uri=new string[](1);
            _uri[0]="";
            token = IERC1155CreatorCore(CREATOR_CONTRACT).mintExtensionNew(_redeemer,_amounts,_uri)[0];
            TOTAL_TOKENS += 1;
            tokenQuantity[token] += voucher.amounts;
        } 
        // Minting from existing TokenIDs
        else if(voucher.tokenId > -1 ){
            token = uint256(voucher.tokenId);
            require(IERC1155CreatorCore(CREATOR_CONTRACT).totalSupply(token) > 0,
                "TokenId not Exists");
            require(tokenQuantity[token].add(voucher.amounts) <= MAX_QUANTITY,
                 "Cannot exceed max Quantity of token concerned");
            // get the address that signed the voucher
            address signer = getVoucherSigner(voucher);
            require(this.isAdmin(signer),  "Signature invalid or signer is not an admin" );
            address[] memory _redeemer = new address[](1);
            _redeemer[0]=voucher.redeemer;
            uint256[] memory _tokenId = new uint256[](1);
            _tokenId[0]=token;
            uint256[] memory _amounts = new uint256[](1);
            _amounts[0]=voucher.amounts;
            IERC1155CreatorCore(CREATOR_CONTRACT).mintExtensionExisting(_redeemer,_tokenId,_amounts);
            tokenQuantity[token]+=voucher.amounts;
        }
        emit Redeemed(voucher.id,voucher.redeemer,voucher.amounts,token);
    return token;           
    } 
    
    /**
     * @notice Verifies the signature for a given Voucher, returning the address of the signer.
     * @param voucher A signed voucher containing minting info
     */
    function getVoucherSigner(Voucher calldata voucher) public view returns (address)
    {
        bytes32 digest = getVoucherDigest(voucher);
        return digest.recover(voucher.signature);
    }   
    
    /**
     * @notice Returns hash of Voucher
     * @param voucher A signed voucher containing minting info
     */
    function getVoucherDigest(Voucher calldata voucher) public view returns (bytes32)
    {
        return keccak256(abi.encode(
            voucher.id,
            voucher.redeemer,
            voucher.amounts,
            voucher.tokenId,           
            address(this)));
    } 
}