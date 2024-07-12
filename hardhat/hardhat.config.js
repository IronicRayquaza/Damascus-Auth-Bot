require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    volta: {
      url: process.env.VOLTA_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
