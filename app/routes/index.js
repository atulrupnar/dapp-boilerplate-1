var express = require('express');
var router = express.Router();
var config = require('./../config/config');
//initiliaze web3 instance
var initWeb3 = require('./web3Helpers/init');
var sampleWallet = require('./web3Helpers/sampleWallet');
//contract owner address
var contractOwner = config.contractOwner;

//get account list
router.get('/getAccounts', function(req, res) {
	var accounts = initWeb3.getAccounts();
    return res.send({status : true, accounts : accounts});
});

//get total supply to wallet
router.get('/getTotalSupply', async function(req, res) {
    try {
		var totalSupply  = await sampleWallet.getTotalSupply();
	    return res.send({status : true, totalSupply : totalSupply});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

//add tokens to total supply of wallet
router.post('/addTokenSupply', async function(req, res) {
	var tokens = req.body.tokens;
	if (!tokens || tokens <= 0 || isNaN(parseInt(tokens))) {
		return res.send({status : false, error : "not valid token amount"});
	}
	tokens = parseInt(tokens);
    try {
		var tx  = await sampleWallet.addTokenSupply(tokens);
	    return res.send({status : true, tx : tx});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

//create new account
router.post('/createAccount', async function(req, res) {
		var phrase = req.body.phrase || "";
		//create account
		var address = initWeb3.createAccount(phrase);
		try {
			//transfer ethers to new account
			var tx  = await initWeb3.etherTransfer(address);
		    return res.send({status : true, newAcc : address});
		} catch(e) {
			return res.send({status : false, error : e});
		}
});

//get balance
router.get('/getBalance', async function(req, res) {
	var address = req.query.address;
	if (!address) {
		return res.send({status : false, error : "address not provided"});
	}

    try {
		var balance  = await sampleWallet.getBalance(address);
	    return res.send({status : true, balance : balance});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

//buy tokens (from contract owner)
router.post('/buyTokens', async function(req, res) {
	var address = req.body.address;
	var value = req.body.value;
	if (!address) {
		return res.send({status : false, error : "address not provided"});
	}
	if (!value || value <= 0 || isNaN(parseInt(value))) {
		return res.send({status : false, error : "not valid amount"});
	}

	/*	address, phrase	*/
	//var isUnlocked = initWeb3.unlockSync(contractOwner.address, contractOwner.phrase, 15);
	try {
		var result  = await sampleWallet.buyTokens2(address, value);
		return res.send({status : true});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});

//transfer tokens
router.post('/sendTokens', async function(req, res) {
	var fromAddress = req.body.fromAddress;
	var toAddress = req.body.toAddress;
	var value = req.body.value;
	if (!fromAddress || !toAddress) {
		return res.send({status : false, error : "address not provided"});
	}
	if (!value || value <= 0 || isNaN(parseInt(value))) {
		return res.send({status : false, error : "not valid amount"});
	}

	try {
		//var isUnlocked = initWeb3.unlockSync(fromAddress, "");
		var result  = await sampleWallet.sendTokens(fromAddress, toAddress, value);
		return res.send({status : true});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});

//get transaction events
router.get('/getTransactions', async function(req, res) {
	try {
		var transactions  = await sampleWallet.getTransactions();
		return res.send({status : true, transactions : transactions});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});

router.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

module.exports = router;
