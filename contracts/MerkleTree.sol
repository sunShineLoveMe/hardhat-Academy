// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../lib/MerkleProof.sol";

/**
 * @title : 
 * @author : june
 * @notice 知识点：
 *              storage: 合约中的状态变量默认都是storage,存储在链上
 *              memory： 函数里的参数和临时变量一般用memory，存储在内存中，不上链
 *              calldata：和memory类似，存储在内存中，不上链，与memory不同在于calldata变量不能修改，immutable
 *                         一般用于函数参数
 */
contract MerkleTree is ERC721 {
    // Merkle树的根
    bytes32 immutable public root;
    // 记录已经mint的地址
    mapping (address => bool) public mintedAddress;

    constructor(string memory name, string memory symbol, bytes32 merkleroot) ERC721(name, symbol) {
        root = merkleroot;
    }

    // 利用merkle树验证地址并且完成mint
    function mint(address account, uint256 tokenId, bytes32[] calldata proof) external {
        require(_verify(_leaf(account), proof), "Invalid merkle proof");
        require(!mintedAddress[account], "Already minted!");
        // mint
        _mint(account, tokenId);
        // 记录mint的地址
        mintedAddress[account] = true;
    }

    // 计算merkle树叶子的hash
    function _leaf(address account) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(account));
    }

    // mekerle验证，调用merkleProof 库的verify()函数
    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns(bool){
        return MerkleProof.verify(proof, root, leaf);
    }

}