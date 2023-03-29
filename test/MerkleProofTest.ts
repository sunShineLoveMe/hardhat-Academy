import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { beforeEach } from "mocha";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

 /**
  * describe(string, function): 函数定义了测试套件，它是测试规范的集合
  * it 函数定义了一个单独的测试规范，其中包含一个或者多个测试期望
  */
 describe("Test MerkleTree", function() {

    let merkleTreeContract: Contract;
    let owner: SignerWithAddress;
    let address1: SignerWithAddress;

    beforeEach(async() => {
        const MerkleTreeFactory = await ethers.getContractFactory("MerkleTree");
        [owner, address1] = await ethers.getSigners();
        // console.log("owner: ", owner); // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // console.log("address1: ", address1); // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        
        merkleTreeContract = await MerkleTreeFactory.deploy(
            "WTF MerkleTree",
            "WTF",
            "0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097"
        )
        // console.log("merkleTreeContract", merkleTreeContract);
        // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        console.log("owner address", await owner.address);
    })

    it("验证部署合约的所有者是否一致", async() => {
        expect(await merkleTreeContract.owner()).to.equal(await owner.address);
    })

    // it("部署合约并且初始化构造器函数,填入nft的参数", async function() {
    //     let MerkleTreeContract =  await hre.ethers.getContractFactory("MerkleTree");
    //     // .deploy方法传入合约构造函数所需的变量
    //     const merkleTreeContract = await MerkleTreeContract.deploy(
    //             "WTF MerkleTree", 
    //             "WTF", 
    //             "0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097"); 
    // });

    
 })