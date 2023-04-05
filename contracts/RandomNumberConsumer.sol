// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    // VRF唯一标识符
    bytes32 internal keyHash;
    // VRF使用手续费
    uint256 internal fee;
    // 存储随机数
    uint256 public randomResult;

    constructor() 
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, 
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709) {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (VRF使用费，Rinkeby测试网)
    }

    /**
     * 向VRF合约申请随机数
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        // 合约需要足够的link
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * VRF合约的回调函数，验证随机数有效之后会自动被调用
     * 消耗随机数的逻辑写在这里
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }

}