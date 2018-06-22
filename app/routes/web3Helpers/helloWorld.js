const contract = require('truffle-contract');
const Web3 = require('web3');
var Promise = require('promise');
var contractJson = require('../../../deployer/build/contracts/HelloWorld.json');
var init = require('./init.js')
web3 = init.web3;
var config = require('../../config/config');
var contractOwner = config.contractOwner;
var getInstance = function(data) {
    const mycontract = web3.eth.contract(data.abi);
    return mycontract.at(data.networks[web3.version.network].address);
}

var contractInstance = getInstance(contractJson);

var getNumber = async function() {
    return await contractInstance.getNumber.call();
};

var setNumber = async function(num) {
    return await contractInstance.setNumber(num, {from: contractOwner.address, gas:100000});
};

var getString = async function() {
    return await contractInstance.getString.call();
};

var setString = async function(str) {
    return await contractInstance.setString(str, {from: contractOwner.address, gas:100000});
};

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

var getAllEvents = async function() {
    let eventInstance, events;
    let allEvents = []; 
    let f1 = {
            from: web3.eth.coinbase,
            gas: 70000000
        };
    let f2 = {
            fromBlock: 0,
            toBlock: 'latest'
        };

    eventInstance = contractInstance.setStr(f1, f2);
    events = await (Promisify(cb => eventInstance.get(cb)));
    allEvents = allEvents.concat(events);
    eventInstance = contractInstance.setNo(f1, f2);
    events = await (Promisify(cb => eventInstance.get(cb)));
    allEvents = allEvents.concat(events);
    allEvents.sort(function(x, y){
        return  y.args.created - x.args.created;
    })
    return allEvents;
};

module.exports = {
    getNumber : getNumber,
    setNumber : setNumber,
    getString : getString,
    setString : setString,
    getAllEvents : getAllEvents
};