pragma solidity ^0.4.4;

/*
 * imports standardToken from OpenZeppelin library
*/

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

/*
 * @title Sample Wallet
  *  ERC20 standardToken specification
*/

/*
 * inherits StandardToken which inturn inherits multiple contracts 
 * eg. StandardToken inherits ERC20 and BasicToken contracts
*/
contract SampleWallet is StandardToken {
    address owner;

    /*
     * modifier to check for sender is a contract owner only
     * @param implicit parameter msg.sender
    */
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    /*
     * @dev constructor function
     * @dev do initialise owner, totalSupply, balances
     * owner : contract owner address, assigns address to the the address of deploying contract account or as specified in truffle.js
     * totalSupply : total supply to the wallet, defined in inherited (BasicToken) contract
     * balances : adds balance to contract owner via adding a key, value pair to balances map defined in BasicToken contract
    */
    constructor() public {
        owner = msg.sender;
        totalSupply_ = 100000;
        balances[msg.sender] = 100000;
    }
    /*
      * @dev gets the balance of the specified address.
      * @param _address address to query the the balance of.
      * @return an uint256 representing the amount owned by the passed address.
     *
    */
    function getBalance(address _address) public view returns(uint) {
         return balances[_address];
    }

    /*
      * @dev returns total number of tokens in supply
    */
    function getTotalSupply() public view returns(uint) {
        return totalSupply_;
    }
        
    /*
      * @dev adds token to total supply in wallet, all extra tokens are assigned to contract owner
      * @params _tokens tokens to add to total supply of wallet
    */
    function addTokenSupply(uint _tokens) public ownerOnly {
        totalSupply_ += _tokens;
        balances[msg.sender] += _tokens;
    }

    /*
      * @dev transfer tokens from contract owner to specified account
      * @params _to address of account to transfer tokens to
      * @params _value Number of tokens to transfer
      * @event emits Transfer event defined in ERC20Basic contract
    */
    function buyTokens(address _to, uint _value) public returns(bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);
        balances[owner] -= _value;
        balances[_to] += _value;
        emit Transfer(owner, _to, _value);
        return true;
    }
    
}
