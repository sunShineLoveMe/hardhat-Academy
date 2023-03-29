// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title 
 * @author 
 * @notice 
 */
contract DutchAuction is Ownable, ERC721 {
    uint256 public constant COLLECTOIN_SIZE = 10000; // NFT总数
    uint256 public constant AUCTION_START_PRICE = 1 ether; // 起拍价(最高价)
    uint256 public constant AUCTION_END_PRICE = 0.1 ether; // 结束价(最低价/地板价)
    uint256 public constant AUCTION_TIME = 10 minutes; // 拍卖时间，为了测试方便设为10分钟
    uint256 public constant AUCTION_DROP_INTERVAL = 1 minutes; // 每过多久时间，价格衰减一次

    uint256 public constant AUCTION_DROP_PER_STEP =
        (AUCTION_START_PRICE - AUCTION_END_PRICE) /
        (AUCTION_TIME / AUCTION_DROP_INTERVAL); // 每次价格衰减步长

    uint256 public auctionStartTime; // 拍卖开始时间戳
    string private _baseTokenURI;   // metadata URI
    uint256[] private _allTokens; // 记录所有存在的tokenId    

    // 设定拍卖的起始时间，我们在构造函数中声明当前区块时间为起始时间，项目方也可以通过
    constructor() ERC721("WTF Dutch Auctoin", "WTF Dutch Auctoin") {
        auctionStartTime = block.timestamp;
    }

    // auctionStartTime setter函数，onlyOwner
    function setAuctionStartTime(uint32 timestamp) external onlyOwner {
        auctionStartTime = timestamp;
    }

    // 拍卖mint函数
    function auctionMint(uint256 quantity) external payable {
        // // 建立local变量，减少gas花费
        uint256 _saleStartTime = uint256(auctionStartTime); 
        require(
            _saleStartTime != 0 && block.timestamp >= _saleStartTime,
            "sale has not started yet"
        );
        require(
            totalSupply() + quantity <= COLLECTOIN_SIZE,
            "not enough remaining reserved for auction to support desired mint amount"
        );

        // 计算mint成本
        uint256 totalCost = getAuctionPrice() * quantity;

        // 检查用户是否支付足够ETH
        require(msg.value >= totalCost, "Need to send more ETH.");

        for(uint256 i =0; i < quantity; i++) {
            uint256 mintIndex = totalSupply();
            _mint(msg.sender, mintIndex);
            _addTokenToAllTokensEnumeration(mintIndex);
        }

        if(msg.value > totalCost) {
            //注意一下这里是否有重入的风险
            payable(msg.sender).transfer(msg.value - totalCost);
        }

    }
    
    /**
     * 逻辑如此：
     * 1. 当 block.timestamp < auctionStartTime: 那么价格为AUCTION_START_PRICE
     * 2. 当 block.timestamp > auctionStartTime + 10min: 那么价格为AUCTION_END_PRICE\
     * 3. 当 AUCTION_START_PRICE < block.timestamp < AUCTION_START_PRICE + 10min,那么计算当前的衰减价格
     */
    function getAuctionPrice() public view returns(uint256) {
        if(block.timestamp < auctionStartTime) {
            return AUCTION_START_PRICE;
        } else if (block.timestamp - auctionStartTime >= AUCTION_TIME) {
            return AUCTION_END_PRICE;
        } else {
            uint256 steps = (block.timestamp - auctionStartTime)/AUCTION_DROP_INTERVAL;
            return AUCTION_START_PRICE - (steps * AUCTION_DROP_PER_STEP);
        }

    }

    function  totalSupply() public view virtual returns(uint256){
        return _allTokens.length;
    }

    /**
     * 在_allTokens中添加一个新的token
     * param tokenId 
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokens.push(tokenId);
    }

    function _baseURI() internal view virtual override returns(string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function withdrawMoney() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }


}
