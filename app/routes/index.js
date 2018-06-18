var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var url = require('url');
var fs = require('fs');
var PATH = require('path');

var helper = require('./helper');
var db = require('./../config/db');
var config = require('./../config/config');
var initWeb3 = require('./web3Helpers/init');
var helloWorld = require('./web3Helpers/helloWorld')
var sampleWallet = require('./web3Helpers/sampleWallet');
var contractOwner = config.contractOwner;
router.get('/testHelloWorld', async function(req, res) {
    try {
	    var no  = await helloWorld.getNumber();
	    console.log('helloWorld number ', no.toNumber());
		//var pUnlocked = initWeb3.unlockSync(contractOwner.address, contractOwner.phrase);
		var no2  = await helloWorld.setNumber(158);

	    var no  = await helloWorld.getNumber();
	    console.log('helloWorld number ', no.toNumber());

	    var str2 = await helloWorld.setString("hello World");
	    var str = await helloWorld.getString();
	    var str3 = helloWorld.allEvents();
	    var allEvents = helloWorld.getAllEvents();
	    console.log('helloWorld str ', str);
	    console.log(allEvents, 'getAllEvents')
	    return res.send({status : true}); 
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e})
    }
});

router.get('/testSampleWallet', async function(req, res) {
	try {
		var accounts = initWeb3.getAccounts();
		var newAcc = accounts[9];
		console.log(newAcc, "newAcc");
		var balance  = await sampleWallet.getBalance(contractOwner.address);
		console.log('old balance', balance.toNumber())
		//isUnlocked = initWeb3.unlockSync(contractOwner.address, contractOwner.phrase, 15);
		isUnlocked = true
		console.log(isUnlocked);
		if (isUnlocked) {
			//var no2  = await sampleWallet.setTotalSupply(1000000);
		}

		if (isUnlocked) {
			var no2  = await sampleWallet.addTokenSupply(50000);			
		}

		if (isUnlocked) {
			var no2  = await sampleWallet.buyTokens(newAcc, 1000);
			var no2  = await sampleWallet.buyTokens2(newAcc, 1000);
			var balance  = await sampleWallet.getBalance(newAcc);
			console.log("new balance", balance.toNumber());
		}
		return res.send({status : true});
	} catch (e) {
		console.log('blockchain error', e);
		return res.send({status : false, error : e})
	}
})

router.get('/startApp', function(req, res) {
});


router.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

module.exports = router;
