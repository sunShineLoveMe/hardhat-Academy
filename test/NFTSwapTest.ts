import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { beforeEach } from "mocha";
import { BigNumber, Contract } from "ethers";
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
        await wtfApeContract.mint(owner.address, 0);
        await wtfApeContract.approve(await nFTSwapContract.address, 0);
        expect(await wtfApeContract.getApproved(0)).to.equal(await nFTSwapContract.address);
    })

    it("上架tokenId为2的NFT", async() => {
        // wtfApeContract 合约mint
        await wtfApeContract.mint(owner.address, 2);
        // wtfApeContract 合约授权给 nftswap 合约
        await wtfApeContract.approve(await nFTSwapContract.address, 2);
        await nFTSwapContract.list(wtfApeContract.address, 2, ethers.utils.parseEther("1"));
        // await expect(await nFTSwapContract.list(wtfApeContract.address, 2, 100)).to.emit(
        //     nFTSwapContract,
        //     "List"
        // ).withArgs(owner.address, wtfApeContract.address, 2, 100);
        const orderNft = await nFTSwapContract.nftList(wtfApeContract.address, 2);
        expect(orderNft.owner).to.equal(owner.address);
    })

    it("更新nft价格", async() => {
        // wtfApeContract 合约mint
        await wtfApeContract.mint(owner.address, 2);
        // wtfApeContract 合约授权给 nftswap 合约
        await wtfApeContract.approve(await nFTSwapContract.address, 2);
        await nFTSwapContract.list(wtfApeContract.address, 2, ethers.utils.parseEther("1"));
        // console.log("更新前的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
        await nFTSwapContract.update(wtfApeContract.address, 2, ethers.utils.parseEther("1.5"));
        // console.log("更新后的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
        const orderNft = await nFTSwapContract.nftList(wtfApeContract.address, 2);
        expect(orderNft.price).to.equal(BigNumber.from(ethers.utils.parseEther("1.5")));
    })

    it("下架nft", async() => {
        // wtfApeContract 合约mint
        await wtfApeContract.mint(owner.address, 2);
        // wtfApeContract 合约授权给 nftswap 合约
        await wtfApeContract.approve(await nFTSwapContract.address, 2);
        await nFTSwapContract.list(wtfApeContract.address, 2, ethers.utils.parseEther("1.3"));
        console.log("下架前的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
        await nFTSwapContract.revoke(wtfApeContract.address, 2);
        console.log("下架后的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
    })

    it("购买nft", async() => {
        // wtfApeContract 合约mint
        await wtfApeContract.mint(owner.address, 2);
        // wtfApeContract 合约授权给 nftswap 合约
        await wtfApeContract.approve(await nFTSwapContract.address, 2);
        await nFTSwapContract.list(wtfApeContract.address, 2, ethers.utils.parseEther("1.3"));
        console.log("购买前的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
        // hardhat  切换不同账户
        await nFTSwapContract.connect(address1).purchase(wtfApeContract.address, 2, {value: ethers.utils.parseEther("2")});
        // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        console.log(await wtfApeContract.ownerOf(2), "tokenId为2的NFT的owner");
        // console.log("购买后的价格: ", await nFTSwapContract.nftList(wtfApeContract.address, 2));
    })
    

})