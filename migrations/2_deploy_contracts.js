var EscrowContract = artifacts.require("./EscrowContract.sol");

module.exports = function(deployer) {
  deployer.deploy(EscrowContract);
};
