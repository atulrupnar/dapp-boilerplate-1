/*
 * 	@file
 * 	@title index route file, all endpoints starts at '/'
 * 	@api : each endpoints contains 2 parameters req, res
 *		each api endpoint gets required parameters from req object, 
 		process and sends response in res object
 	response format :
 	on success : {
		status : true,
		@params optional parameters
 	}
 	on error : {
		status : false,
		error : 'error message'
 	}
*/

var express = require('express');
var router = express.Router();
/**
*	@var config imports configurations
*	@var initWeb3 imports web3 common functionality, init file exposes functions
		to connect to blockchain using web3 over rpc port and includes common functionality
*	@var sampleWallet import wallet interface library, samplewallet contains
		functionality to interact with wallet contract
*	@var contractOwner keeps contract owner address, required for accessing contract methods
*/
var config = require('./../config/config');
var initWeb3 = require('./web3Helpers/init');
var sampleWallet = require('./web3Helpers/sampleWallet');
var contractOwner = config.contractOwner;

/**
*	@api getAccounts
*	@returns json object with list of all web3 accounts
*/
router.get('/getAccounts', function(req, res) {
	var accounts = initWeb3.getAccounts();
	/**
		@returns a response object
	*/
    return res.send({status : true, accounts : accounts});
});

/**
*	@api getTotalSupply get total token supply to wallet
*	@call to contract helper function getTotalSupply defined in web3Helpers/sampleWallet.js
*	@returns {integer} total number of tokens
*/

router.get('/getTotalSupply', async function(req, res) {
    try {
    	// call to contract helper function getTotalSupply defined in web3Helpers/sampleWallet.js
		var totalSupply  = await sampleWallet.getTotalSupply();
	    return res.send({status : true, totalSupply : totalSupply});
    } catch(e) {
    	/** 
    	*	@catch errros thrown by contract helper function getTotalSupply 
    	*	- format and returns error response object
    	*/
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

/**
*	@api addTokenSupply add tokens to total supply of wallet
*	@params tokens tokens to add to total supply
*	@call to contract helper function addTokenSupply
*	@returns {string} transaction hash of the mined transaction for successful transactions
*/

router.post('/addTokenSupply', async function(req, res) {
	//get request parameters
	var tokens = req.body.tokens;
	/**
	*	@input validation
	*	@var tokens checks for 
	*		a. is tokens exist
	*		b. tokens >= 0
	*		c. tokens must be number
	*/
	if (!tokens || tokens <= 0 || isNaN(parseInt(tokens))) {
		return res.send({status : false, error : "not valid token amount"});
	}
	tokens = parseInt(tokens);
    try {
    	//call to contract helper function addTokenSupply
		var tx  = await sampleWallet.addTokenSupply(tokens);
	    return res.send({status : true, tx : tx});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

/**
*	@api createAccount create a new account on blockchain
*	@params phrase password to unlock blockchain account
*	@calls to contract helper function createAccount
*	sends ethers to newly created account, as ethers are required for any blockchain operation
*	@returns new account address on success
*/
router.post('/createAccount', async function(req, res) {
		var phrase = req.body.phrase || "";
		//call to common contract helper function createAccount
		var address = initWeb3.createAccount(phrase);
		try {
			//transfer ethers to new account, call to contract method etherTransfer
			var tx  = await initWeb3.etherTransfer(address);
		    return res.send({status : true, newAcc : address});
		} catch(e) {
			return res.send({status : false, error : e});
		}
});

/**
*	@api getBalance get the balance for specified account address
*	@params address {string} a 20 byte account address
*	@calls to contract helper function getBalance
*	@returns {integer} balance on success
*/
router.get('/getBalance', async function(req, res) {
	var address = req.query.address;
	//input validation for address : check for => address exists
	if (!address) {
		return res.send({status : false, error : "address not provided"});
	}

    try {
    	//call to contract function getBalance
		var balance  = await sampleWallet.getBalance(address);
	    return res.send({status : true, balance : balance});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

/**
*	@api buyTokens get specified number of tokens from contract owner
*	@params address {string} account address who want to buy tokens
*	@params value number of tokens to buy
*	@calls to contract helper function buyTokens2
*	@returns {boolean} status on success
*/
router.post('/buyTokens', async function(req, res) {
	//get request parameters
	var address = req.body.address;
	var value = req.body.value;
	//input validation
	if (!address) {
		return res.send({status : false, error : "address not provided"});
	}
	//checks for value is a number and value > 0
	if (!value || value <= 0 || isNaN(parseInt(value))) {
		return res.send({status : false, error : "not valid amount"});
	}

	/**
		Note : if you are using geth or any other blockchain platform,
		you need to unlock contract owners account first as stated below
		var isUnlocked = initWeb3.unlockSync(contractOwner.address, contractOwner.phrase, 15);
	*/
	try {
		//call to contract helper function buyTokens2
		var result  = await sampleWallet.buyTokens2(address, value);
		return res.send({status : true});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});

/**
*	@api sendTokens transsfer tokens from one account to another
*	@params fromAccount account address from which tokens to transfer to
*	@params toAccount account address which receives tokens
*	@params value number of tokens to transfer
*	@calls to contract helper function sendTokens
*	@returns {boolean} status on success
*/
router.post('/sendTokens', async function(req, res) {
	//get request parameters
	var fromAddress = req.body.fromAddress;
	var toAddress = req.body.toAddress;
	var value = req.body.value;
	//input validation
	//check for fromAddress and toAddress exists
	if (!fromAddress || !toAddress) {
		return res.send({status : false, error : "address not provided"});
	}
	//check for value is exist and is a number
	if (!value || value <= 0 || isNaN(parseInt(value))) {
		return res.send({status : false, error : "not valid amount"});
	}

	try {
		//Note fromAccount (sender account) should be unlocked on any other platform as below
		//var isUnlocked = initWeb3.unlockSync(fromAddress, "");
		var result  = await sampleWallet.sendTokens(fromAddress, toAddress, value);
		return res.send({status : true});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});

/**
*	@api getTransactions get the list of transactions happened over blockchain
*	@calls to contract helper function getTransactions
*	@returns list of transaction object
* 	each transaction object consists following params : from, to, value
*/
router.get('/getTransactions', async function(req, res) {
	try {
		//gets transactions list
		var transactions  = await sampleWallet.getTransactions();
		return res.send({status : true, transactions : transactions});
	} catch(e) {
		return res.send({status : false, error : e});
	}
});
//route any get request (other than specified above) to index.html file(entry point to front end)
router.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

module.exports = router;
