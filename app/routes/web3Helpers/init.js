const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');
var config = require('../../config/config');
console.log(config)
var web3Provider = config.web3Provider.url + ":" + config.web3Provider.port;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    var provider = new Web3.providers.HttpProvider(web3Provider);
    web3 = new Web3(provider);
}
var provider = new Web3.providers.HttpProvider(web3Provider);

if (web3 && web3.isConnected()) {
    console.log('web3 is Connected')
} else {
    console.log('web3 is not Connected')
}

var createAccount = function(phrase) {
    if (!phrase) {
        phrase = "";
    }
    return web3.personal.newAccount(phrase);
}

var getAccounts = function() {
    return web3.eth.accounts;
};


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

var unlockSync = function(address, phrase) {
    return web3.personal.unlockAccount(address, phrase);
};

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
                console.log('etherTransfer', err)
                reject(err);
            }
        });
    })
}

var getEthBalance = function(address) {
    return web3.eth.getBalance(address);
}

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