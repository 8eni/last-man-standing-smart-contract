pragma solidity ^0.4.11;

contract CreatorBalanceChecker {
    
    address creator = msg.sender;
    uint creatorBalance;
    
    function getCreatorBalance() constant returns (uint) {
        
        creatorBalance = msg.sender.balance;
        return creatorBalance;
    }
    
    // Standar kill to recover funds
    
    function kill() {
        if(creator == msg.sender) {
            suicide(creator);
        }
    }
    
}
