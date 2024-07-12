async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Authorization = await ethers.getContractFactory("Authorization");
    const authorization = await Authorization.deploy();
  
    console.log("Authorization contract address:", authorization.address);
  
    // Wait for the deployment transaction to be mined
    await authorization.deployed();
  
    console.log("Authorization contract deployed to:", authorization.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  