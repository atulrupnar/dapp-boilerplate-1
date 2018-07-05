/**
*   @file
*   interface to samplewallet contract
*/

const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');

/**
*   @var contractJson reference to sampleWallet.json generated after compile (truffle compile)
*   @var init reference to init.js helper (common web3 functionality)
*   @var web3 reference to web3 object
*   @var conifg application configuration
*   @var contractOwner contract owner address
*/

var contractJson = require('../../../deployer/build/contracts/SampleWallet.json');
var init = require('./init.js')
web3 = init.web3;
var config = require('../../config/config');
var contractOwner = config.contractOwner;

/**
*   @function getInstance get the instance of sampleWallet contract
*   @params data contract ABI generated after contract compile
*   @returns reference to instance of the contract
*/
var getInstance = function(data) {
    const mycontract = web3.eth.contract(data.abi);
    return mycontract.at(data.networks[web3.version.network].address);
}
// @var contractInstance a global(to file) reference to contract instance
var contractInstance = getInstance(contractJson);

/**
*   @function getBalance get token balance
*   @params address address of the tokens
*   @returns {integer} token balance
*/
var getBalance = async function(address) {
    return await contractInstance.getBalance.call(address);
};

/**
*   @function getTotalSupply get total supply
*   @returns {integer} get total tokens in supply
*/

var getTotalSupply = async function() {
    return await contractInstance.getTotalSupply.call();
};

/**
*   @function addTokenSupply add tokens to total supply
    @params tokens token amount to add to total supply
*   @returns {string} transaction hash
*/

var addTokenSupply = async function(tokens) {
    /**
        @call to addTokenSupply contract method
        @params tokens token amount to add to supply
        @params transaction obejct : 
            from : transaction signer
            gas : maximum gas value
    */
    return await contractInstance.addTokenSupply(tokens, {from: contractOwner.address, gas:100000});
};

/**
*   @function buyTokens transfer tokens from contract owner account to specified account(buyer)
*    @params to address to transfer tokens to
*   @params tokens token amount to transfer
*   @call to transfer function defined in BasicToken and inherited by sampleaWallet
*   @returns {string} transaction hash
*/

var buyTokens = async function(to, tokens) {
    return await contractInstance.transfer(to, tokens, {from: contractOwner.address, gas:1000000});
};

/**
*   @function buyTokens transfer tokens from contract owner account to specified account(buyer)
*   @params to address to transfer tokens to
*   @params tokens token amount to transfer
*   @call to buyTokens function defined in sampleaWallet
*   @returns {string} transaction hash
*/

var buyTokens2 = async function(to, tokens) {
    return await contractInstance.buyTokens(to, tokens, {from: contractOwner.address, gas:1000000});
};

/**
*   @function sendTokens tranfer tokens from acc1 to acc2
*   @params acc1 address of sender account
*   @params acc2 address of receiver account
*   @params tokens token amount to transfer
*   @call to transfer function defined in BasicToken and inherited by sampleaWallet
*   @returns {string} transaction hash on success
*/

var sendTokens = async function(acc1, acc2, value) {
    try {
        return await contractInstance.transfer(acc2, value,
              {from : acc1, gas:1000000});
    } catch(e) {
        console.log(e);
    }
};

/**
*   @function converts callback function to promise based function
*   @params inner callback response
*   @returns promise response
*/

const Promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

/**
*   @function getTransactions get the list of transactions
*   @returns list of transaction objects
*/
var getTransactions = async function() {
    let eventInstance, events;
    /**
        @var f1 transaction signer object
            from : signer account address
            gas : maximum gas value
    */
    let f1 = {
            from: web3.eth.coinbase,
            gas: 70000000
        };
    /**
        @var f2 event filter
            fromBlock : start block number
            toBlock : last block number
        note : events within this range will be extracted
    */
    let f2 = {
            fromBlock: 0,
            toBlock: 'latest'
        };

    //get transfer event instance
    eventInstance = contractInstance.Transfer(f1, f2);
    //get transfer events and convert it to promise response
    return await (Promisify(cb => eventInstance.get(cb)));
}
/**
    expose the functions to routes
*/
module.exports = {
    getBalance : getBalance,
    addTokenSupply : addTokenSupply,
    buyTokens : buyTokens,
    buyTokens2 : buyTokens2,
    sendTokens : sendTokens,
    getTotalSupply : getTotalSupply,
    getTransactions : getTransactions
};