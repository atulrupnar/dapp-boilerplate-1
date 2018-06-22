pragma solidity ^0.4.4;

//import ERC20 standard token
import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract SampleWallet is StandardToken {
    address owner;

    //modifiers
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        //set contract owner, total supply and balances
        owner = msg.sender;
        totalSupply_ = 100000;
        balances[msg.sender] = 100000;
    }
    
    function getBalance(address _address) public view returns(uint) {
         return balances[_address];
    }

    function getTotalSupply() public view returns(uint) {
        return totalSupply_;
    }
    
    function setTotalSupply(uint _tokens) public ownerOnly {
        totalSupply_ = _tokens;
        balances[msg.sender] = _tokens;
    }
    
    //mint tokens, assign to contract owner
    function addTokenSupply(uint _tokens) public ownerOnly {
        totalSupply_ += _tokens;
        balances[msg.sender] += _tokens;
    }

    //transfer tokens from contract owner to any account
    function buyTokens(address _to, uint _value) public returns(bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);
        balances[owner] -= _value;
        balances[_to] += _value;
        emit Transfer(owner, _to, _value);
        return true;
    }
    
}