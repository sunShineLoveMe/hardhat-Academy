// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

// 调用dotenv配置方法
require('dotenv').config();

// 合约部署成功的地址
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
// console.log("合约地址: ", CONTRACT_ADDRESS);
// 合约部署账号
const OWNER = process.env.PUBLIC_KEY || "";

// 合约接口地址
const contractInterface = require("../artifacts/contracts/DutchAuction.sol/DutchAuction.json").abi;
// provider
const provider = new hre.ethers.providers.JsonRpcProvider();

// 钱包实例
const wallet = new hre.ethers.Wallet(`0x${process.env.PRIVATE_KEY}`,provider);
// console.log("provider: ", provider);

//合约
const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)

const contractWithSigner = contract.connect(wallet);

// console.log("contractWithSigner", contractWithSigner);
// const maxAmount = await contractWithSigner.getAuctionPrice();


// 入口函数
async function main() {
    // 设置荷兰拍卖的起始时间
    // await contractWithSigner.setAuctionStartTime(1680006000);
    // // 获取荷兰拍卖的设置时间
    // const autionStartTime = await contractWithSigner.auctionStartTime();
    // console.log("autionStartTime: ", autionStartTime);
    // // 获取荷兰拍卖的价格
    // const autionPrice = await contractWithSigner.getAuctionPrice();
    // // 大数转化为Eth单位
    // const priceEther = ethers.utils.formatEther(autionPrice);
    // console.log("priceEther:", priceEther);
    // 合约mint操作
    // await contractWithSigner.auctionMint(10, {value: ethers.utils.parseEther("1")});
    // 查询mint 的总数
    // const totalCount = await contractWithSigner.totalSupply();
    // console.log("totalCount: ", totalCount);
    // 查询合约余额
    // const balanceA = await contractWithSigner.balanceOf(OWNER);
    // console.log("balanceA: ", balanceA);
    // 提取资金
    await contractWithSigner.withdrawMoney();
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });