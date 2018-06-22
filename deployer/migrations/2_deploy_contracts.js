var sampleWallet = artifacts.require("./SampleWallet.sol");
module.exports = function(deployer) {
	deployer.deploy(sampleWallet);
};