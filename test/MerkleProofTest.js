 const { expect } = require("chai");
 const hre = require("hardhat");


 /**
  * describe(string, function): 函数定义了测试套件，它是测试规范的集合
  * it 函数定义了一个单独的测试规范，其中包含一个或者多个测试期望
  */
 describe("Test MerkleTree", function() {
    it("部署合约并且初始化构造器函数,填入nft的参数", async function() {
        let merkleTreeContract =  await hre.ethers.getContractFactory("MerkleTree");
        await merkleTreeContract.deploy()
    });
 })