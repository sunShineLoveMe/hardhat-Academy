// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./WTFApe.sol";

contract NFTSwap is IERC721Receiver {
    event List(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Purchase(address indexed buyer, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Revoke(address indexed seller, address indexed nftAddr, uint256 indexed tokenId);
    event Update(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 newPrice);

    // 定义order结构体, 包含挂单价格price和持有人owner信息
    struct Order {
        address owner;
        uint256 price;
    } 
    // NFT Order映射
    mapping(address => mapping(uint256 => Order)) public nftList;

    // NFT合约地址
    fallback() external payable{}
    receive() external payable{}

    /**
     * 挂单: 卖家上架NFT，合约地址为_nftAddr，tokenId为_tokenId，价格_price为以太坊（单位是wei）
     */
    function list(address _nftAddr, uint256 _tokenId, uint256 _price) public {
        IERC721 _nft = IERC721(_nftAddr);
        require(_nft.getApproved(_tokenId) == address(this), "Need Approval");
        require(_price > 0);
        // 设置nft持有人和价格
        Order storage _order = nftList[_nftAddr][_tokenId];
        _order.owner = msg.sender;
        _order.price = _price;
        // 将nft转移给合约
        _nft.safeTransferFrom(msg.sender, address(this), _tokenId);

        // 释放事件
        emit List(msg.sender, _nftAddr, _tokenId, _price);
    }

    // 购买: 买家购买NFT，合约为_nftAddr，tokenId为_tokenId，调用函数时要附带ETH
    function purchase(address _nftAddr, uint256 _tokenId) payable public {
        // 获取nft订单信息
        Order storage _order = nftList[_nftAddr][_tokenId];
        require(_order.price > 0, "Invalid Price"); // NFT价格大于0
        require(msg.value >= _order.price, "Increase price"); // 购买价格大于标价
        // 获取nft合约
        IERC721 _nft = IERC721(_nftAddr);
        // 判断nft是否是合约地址
        require(_nft.ownerOf(_tokenId) == address(this), "NFT not for sale");

        // 将nft转移给买家
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        // 将以太坊转移给卖家
        payable(_order.owner).transfer(_order.price);
        payable(msg.sender).transfer(msg.value - _order.price);
        // 释放事件
        emit Purchase(msg.sender, _nftAddr, _tokenId, msg.value);
    }

    // 撤单: 卖家取消挂单
    function revoke(address _nftAddr, uint256 _tokenId) public {
        // 获取nft订单信息
        Order storage _order = nftList[_nftAddr][_tokenId];
        require(_order.owner == msg.sender, "Not owner"); // 只能是卖家撤单
        // 获取nft合约
        IERC721 _nft = IERC721(_nftAddr);
        // 判断nft是否是合约地址
        require(_nft.ownerOf(_tokenId) == address(this), "NFT not for sale");
        // 将nft转移给卖家
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        // 删除nft订单信息
        delete nftList[_nftAddr][_tokenId];
        // 释放事件
        emit Revoke(msg.sender, _nftAddr, _tokenId);
    }

    // 更新价格: 卖家更新挂单价格
    function update(address _nftAddr, uint256 _tokenId, uint256 _newPrice) public {
        require(_newPrice > 0, "Invalid Price"); // NFT价格大于0
        // 获取nft订单信息
        Order storage _order = nftList[_nftAddr][_tokenId];
        require(_order.owner == msg.sender, "Not owner"); // 只能是卖家更新价格
        // 获取nft合约
        IERC721 _nft = IERC721(_nftAddr);
        // 判断nft是否是合约地址
        require(_nft.ownerOf(_tokenId) == address(this), "NFT not for sale");
        // 更新价格
        _order.price = _newPrice;
        // 释放事件
        emit Update(msg.sender, _nftAddr, _tokenId, _newPrice);
    }

    function onERC721Received (
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

}

