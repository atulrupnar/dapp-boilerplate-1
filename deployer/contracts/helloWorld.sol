pragma solidity ^0.4.4;
contract HelloWorld {
    int no;
    string str;
    
    constructor() public {
        no = 0;
    }

    function getNumber() public view returns(int){
        return no;
    }
    
    function getString() public view returns(string) {
        return str;
    }
    
    function setNumber(int _no) public {
        no = _no;
        emit setNo(_no);
    }
    
    function setString(string _str) public {
        str = _str;
        emit setStr(_str);
    }
    
    function getAll() public view returns(int, string) {
        return (
                no,
                str
            );
    }

    event setNo(int no);
    event setStr(string str);    
}