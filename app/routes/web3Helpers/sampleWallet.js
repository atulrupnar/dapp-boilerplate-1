const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');
var contractJson = require('../../../deployer/build/contracts/SampleWallet.json');
var init = require('./init.js')
//get web3 object
web3 = init.web3;
var config = require('../../config/config');
var contractOwner = config.contractOwner;

//create a new web3 instance of contract
var getInstance = function(data) {
    const mycontract = web3.eth.contract(data.abi);
    return mycontract.at(data.networks[web3.version.network].address);
}

var contractInstance = getInstance(contractJson);

//get balance
var getBalance = async function(address) {
    return await contractInstance.getBalance.call(address);
};

//get total supply
var getTotalSupply = async function() {
    return await contractInstance.getTotalSupply.call();
};

//set total supply
var setTotalSupply = async function(tokens) {
    return await contractInstance.setTotalSupply(tokens, {from: contractOwner.address, gas:100000});
};

//add tokens to total supply
var addTokenSupply = async function(tokens) {
    return await contractInstance.addTokenSupply(tokens, {from: contractOwner.address, gas:100000});
};

//uses transfer function inherited from ERC20 standradtoken
//tranfer tokens from contract owner to destination account
var buyTokens = async function(to, tokens) {
    return await contractInstance.transfer(to, tokens, {from: contractOwner.address, gas:1000000});
};

//alternate way to transfer tokens
var buyTokens2 = async function(to, tokens) {
    return await contractInstance.buyTokens(to, tokens, {from: contractOwner.address, gas:1000000});
};

//tranfer tokens from acc1 to acc2
var sendTokens = async function(acc1, acc2, value) {
    try {
        return await contractInstance.transfer(acc2, value,
              {from : acc1, gas:1000000});
    } catch(e) {
        console.log(e);
    }
};

//converts callback function to promise based function
const Promisify = (inner) =>
    new Promise((   resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

//get transfer events
var getTransactions = async function() {
    let eventInstance, events;
    //set filters
    let f1 = {
            from: web3.eth.coinbase,
            gas: 70000000
        };
    let f2 = {
            fromBlock: 0,
            toBlock: 'latest'
        };

    //get transfer event instance
    eventInstance = contractInstance.Transfer(f1, f2);
    return await (Promisify(cb => eventInstance.get(cb)));
}

module.exports = {
    getBalance : getBalance,
    setTotalSupply : setTotalSupply,
    addTokenSupply : addTokenSupply,
    buyTokens : buyTokens,
    buyTokens2 : buyTokens2,
    sendTokens : sendTokens,
    getTotalSupply : getTotalSupply,
    getTransactions : getTransactions
};