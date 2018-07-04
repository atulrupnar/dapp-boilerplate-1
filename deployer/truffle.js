/**
	@title truffle configuration file
*/
module.exports = {
   	networks: {
	   	development: {
		   	host: "localhost",
		   	//from : "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
			port: 8545, //rpc port
		    network_id: "*", // Match any network id
		 	gas: 4700000
		}
 	}
};
