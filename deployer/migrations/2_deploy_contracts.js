var helloWorld = artifacts.require("./HelloWorld.sol");
var sampleWallet = artifacts.require("./SampleWallet.sol");
module.exports = function(deployer) {
	deployer.deploy(helloWorld);
	deployer.deploy(sampleWallet);
};