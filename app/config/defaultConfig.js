/**
* 	@title default configuration file
* 	copy this file to config.js (in the same folder) and do
*	changes as per your environment
*
*/
module.exports = {
	//ENV : dev for development, prod for production
	'ENV' : 'dev',
	/**
	*	contract owner configuration
	*	address : address of contract deployer account (can be found in contract abi)
	*	phrase : password to unlock account
	*/
	"contractOwner" : {
		address : "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
		phrase : ""
	},
	/**
	*	web3 Provider configuration
	*	url : host of the blockchain
	*	port : rpc port number
	*/
	"web3Provider" : {
		url : "http://localhost",
		port : 8545
	}
}