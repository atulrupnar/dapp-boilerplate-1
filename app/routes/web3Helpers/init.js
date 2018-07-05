/**
*   @file
*   connects to web3 and expose it to application usage
*   implements common web3 functionality required by any blockchain application
*/

const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');
var config = require('../../config/config');
/**
*   connect to web3 api
*   @var web3Provider url to to connect to blockchain eg. http://localhost:8545
*
*/
var web3Provider = config.web3Provider.url + ":" + config.web3Provider.port;
var web3;
var provider = new Web3.providers.HttpProvider(web3Provider);
if (typeof web3 !== 'undefined') {
    // set the current provider
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    //var provider = new Web3.providers.HttpProvider(web3Provider);
    web3 = new Web3(provider);
}

//check is web3 connected
if (web3 && web3.isConnected()) {
    console.log('web3 is Connected')
} else {
    console.log('web3 is not Connected')
}

/**
*   @function createAccount creates new account
*   @params phrase password to unlock account
*/
var createAccount = function(phrase) {
    if (!phrase) {
        phrase = "";
    }
    return web3.personal.newAccount(phrase);
}

/**
*   @function getAccounts get list of accounts
*/
var getAccounts = function() {
    return web3.eth.accounts;
};

/**
*   @function unlock unlock specified account address
*   @params address account address to unlock
*   @params phrase password to unlock account
*   return promise reposnse
*/
var unlock = function (address, phrase) {
    return new Promise((resolve, reject) => {
        web3.personal.unlockAccount(address, phrase, function (error, result) {
            if (!error) {
                resolve(address);
            } else {
                reject(err);
            }
        });
    })
}

/**
*   @function unlock unlock specified account address synchronously
*   @params address account address to unlock
*   @params phrase password to unlock account
*   @returns {boolean} unlock status
*/
var unlockSync = function(address, phrase) {
    return web3.personal.unlockAccount(address, phrase);
};

/**
*   @function etherTransfer tranfers ethers from coinbase account to specified address
*   @params addressTo account address to transfer ethers
*   @params value ether value to transfer
*   @returns promise response with 'success' or error
*/
var etherTransfer = function(addressTo, value=1) {
    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction({
            to: addressTo,
            value: web3.toWei(value, "ether"),
            from: web3.eth.coinbase
        }, function (err, success) {
            if (!err) {
                resolve('success');
            } else {
                console.log('etherTransfer', err);
                reject(err);
            }
        });
    })
}

/**
*   @function getEthBalance get ether balance
*   @params address of account to get balance of
*   @returns {integer} balance of account
*/
var getEthBalance = function(address) {
    return web3.eth.getBalance(address);
}
/**
    expose the functions to other files
*/
module.exports = {
    createAccount : createAccount,
    unlock : unlock,
    unlockSync : unlockSync,
    etherTransfer : etherTransfer,
    getEthBalance : getEthBalance,
    getAccounts : getAccounts,
    web3 : web3,
    etherTransfer : etherTransfer
};