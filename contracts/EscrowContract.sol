pragma solidity ^0.4.0;
 
contract EscrowContract{
   
    address owner;
    bool _switch = false;
    function EscrowContract(){
        owner = msg.sender;
    }
   
    function depositFunds() payable{
       
    }
   
    function getContractBalance() constant returns(uint){
        return this.balance;
    }
   
    function getOwnerBalance() constant returns (uint){
        return owner.balance;
    }
   
    function withdrawFundsFromContractToOwner(uint amount){
        if(owner.send(amount)){
            _switch = true;
        } else{
            _switch = false;
        }
    }
 
}