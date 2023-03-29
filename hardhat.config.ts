/** @type import('hardhat/config').HardhatUserConfig */
// require("@nomicfoundation/hardhat-toolbox");
import "@nomiclabs/hardhat-waffle";
// require("@nomiclabs/hardhat-waffle");

// task("accounts", "print the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   console.log(accounts.length)
//   console.log(accounts[0])

//   // for(const account of accounts) {
//   //   console.log(account);
//   // }
// })

module.exports = {
  solidity: "0.8.9",
};
