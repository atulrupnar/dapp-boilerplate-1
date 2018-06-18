const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');
var contractJson = require('../../../deployer/build/contracts/SampleWallet.json');
var init = require('./init.js')
web3 = init.web3;
var config = require('../../config/config');
var contractOwner = config.contractOwner;

var getInstance = function(data) {
    const mycontract = web3.eth.contract(data.abi);
    return mycontract.at(data.networks[web3.version.network].address);
}

var contractInstance = getInstance(contractJson);

var getBalance = async function(address) {
    return await contractInstance.getBalance.call(address);
};

var getTotalSupply = async function() {
    return await contractInstance.getTotalSupply.call(address);
};

var setTotalSupply = async function(tokens) {
    return await contractInstance.setTotalSupply(tokens, {from: contractOwner.address, gas:100000});
};

var addTokenSupply = async function(tokens) {
    return await contractInstance.addTokenSupply(tokens, {from: contractOwner.address, gas:100000});
};

var buyTokens = async function(to, tokens) {
    return await contractInstance.buyTokens(to, tokens, {from: contractOwner.address, gas:1000000});
};

var buyTokens2 = async function(to, tokens) {
    return await contractInstance.transfer(to, tokens, {from: contractOwner.address, gas:1000000});
};


module.exports = {
    getBalance : getBalance,
    setTotalSupply : setTotalSupply,
    addTokenSupply : addTokenSupply,
    buyTokens : buyTokens,
    buyTokens2 : buyTokens2,
    getTotalSupply : getTotalSupply
};