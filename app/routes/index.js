var express = require('express');
var router = express.Router();
var config = require('./../config/config');
var initWeb3 = require('./web3Helpers/init');
var helloWorld = require('./web3Helpers/helloWorld')
var contractOwner = config.contractOwner;

router.get('/getNo', async function(req, res) {
    try {
	    var no  = await helloWorld.getNumber();
	    return res.send({status : true, no : no});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

router.get('/getStr', async function(req, res) {
    try {
	    var str = await helloWorld.getString();
	    return res.send({status : true, str : str});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

router.get('/allEvents', async function(req, res) {
    try {
		var allEvents = await helloWorld.getAllEvents();
	    return res.send({status : true, allEvents : allEvents});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

router.post('/setNo', async function(req, res) {
	var no  = req.body.no;
	no = parseInt(no);
    try {
	    var tx  = await helloWorld.setNumber(no);
	    return res.send({status : true, tx : tx});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

router.post('/setStr', async function(req, res) {
	var str = req.body.str;
	console.log('str', str);
    try {
	    var tx = await helloWorld.setString(str);
	    console.log('str', str)
	    return res.send({status : true, tx : tx});
    } catch(e) {
    	console.log('blockchain error : ' + e);
		return res.send({status : false, error : e});
    }
});

router.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

module.exports = router;
