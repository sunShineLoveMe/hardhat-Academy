import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { beforeEach } from "mocha";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("初始化ApeNft并mint", () => {
    let wtfApeContract: Contract;
    let owner: SignerWithAddress;
    let address1: SignerWithAddress;

    let nFTSwapContract: Contract;
    
    beforeEach(async() => {
        const WTFApeFactory = await ethers.getContractFactory("WTFApe");
        const NFTSwapContract = await ethers.getContractFactory("NFTSwap");
        [owner, address1] = await ethers.getSigners();
        // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // console.log("owner: ", owner); 
        // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        // console.log("address1: ", address1); 
        wtfApeContract = await WTFApeFactory.deploy("WTF", "WTF");
        nFTSwapContract = await NFTSwapContract.deploy();
        // console.log("nFTSwapContract", nFTSwapContract.address);
        // console.log("wtfApeContract最大值: ", await wtfApeContract.MAX_APES());
    })

    // it("验证部署合约的所有者是否一致", async() => {
    //     expect(await wtfApeContract.owner()).to.equal(await owner.address);
    // })

    it("owner地址mint tokenId为0", async() => {
        // owner mint 0
        await wtfApeContract.mint(owner.address, 0);
        expect(await wtfApeContract.ownerOf(0)).to.equal(await owner.address);
    })

    it("owner地址mint tokenId为1", async() => {
        // owner mint 1
        await wtfApeContract.mint(owner.address, 1);
        expect(await wtfApeContract.ownerOf(1)).to.equal(await owner.address);
    })
    
    it("上架的nft中tokenId为0的NFT授权给nftswap合约", async() => {
        // owner mint 0
        await wtfApeContract.approve(nFTSwapContract.address, 1);
        expect(await wtfApeContract.getApproved(1)).to.equal(await nFTSwapContract.address);
    })
    
    // it("验证nfswap合约地址是否一致", async() => {
    //     expect(await nFTSwapContract).to.equal(await wtfApeContract.address);
    // })

})