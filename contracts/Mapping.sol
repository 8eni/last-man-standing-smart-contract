pragma solidity ^0.4.11;

contract Mapping {
    
    struct Contestant {
        // address delegate;
        string golfer;
        // bool submitted;
        // uint price;
        uint amount;
    }
    
    mapping (address => Contestant) public contestants;
    
    address public competitor;
    
    Contestant[] submissions;
    
    function sendBet(string golfer, uint amount) {
        
        submissions.push(Contestant(golfer, amount));
        
    }

}