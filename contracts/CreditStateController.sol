pragma solidity 0.4.11;
 
contract CreditStateController {
 
  address public contractOwner;
  mapping (address => bool) creditStateMap;
 
  event LogCreditState(address initiator, bool isFrozen);
  event LogEvent(string description);
 
  function CreditStateController(){
    LogEvent("Invoking the contract");
    contractOwner = msg.sender;
  }
 
  function freeze(address initiator){
    LogEvent("Freezing the contract for the initiator"); 
    creditStateMap[initiator] = true;
    LogCreditState(initiator, creditStateMap[initiator]);
  }
 
  function unFreeze(address initiator){
    LogEvent("Un-freezing the contract for the initiator");
    creditStateMap[initiator] = false;
    LogCreditState(initiator, creditStateMap[initiator]);
  }
 
  function queryCurrentState(address initiator) constant returns (bool){
    return creditStateMap[initiator];
  }
 
  function killContract()  {
    if(msg.sender != contractOwner) throw;
    LogEvent("Killing the contract");
    selfdestruct(contractOwner);
  }
 
  
}
