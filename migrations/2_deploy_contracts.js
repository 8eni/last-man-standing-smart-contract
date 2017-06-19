// var ConvertLib = artifacts.require("./ConvertLib.sol");
var CreditStateController = artifacts.require("./CreditStateController.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(CreditStateController);
};
