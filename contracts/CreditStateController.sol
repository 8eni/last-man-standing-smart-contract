pragma solidity 0.4.11;
 
contract CreditStateController {
 
  address public contractOwner;
  mapping (address => creditFreezeTimeLimit) creditStateMap;
 
  struct creditFreezeTimeLimit {
                              string[] electedCreditors;
                              uint[] unfreezeTimings;
                              uint[] unfreezeDuration;
                              string[] reasonForUnfreeze;
  }
 
  
  event LogUserAddress(address initiator);
  event LogCreditState(bool isFrozen);
  event LogCreditFreezeTime(uint freezeTime);
  event LogCreditFreezeDuration(uint freezeDuration);
  event LogEvent(string description);
  event logElectedCreditor(string electedCreditor);
  event logReasonForUnfreeze(string reason);
 
  function CreditStateController(){
    LogEvent("Invoking the contract");
    contractOwner = msg.sender;
  }
 
  function unFreeze(address initiator, string creditor, uint freezeLimitTime,
                        string reason) {
                           
    LogEvent("Un-freezing the contract for the initiator");
    recordCreditUnFreezeAndLogEvent(initiator, creditor, freezeLimitTime, reason);
  }
 
  function unFreeze(address initiator, string creditor, string reason) {
    LogEvent("Un-freezing the contract for the initiator");
    recordCreditUnFreezeAndLogEvent(initiator, creditor, 172800, reason);
  }
 
  function freeze(address initiator){
               LogEvent("Freezing the contract for the initiator");
               recordCreditFreezeAndLogEvent(initiator);
  }
 
  
  
  function recordCreditUnFreezeAndLogEvent(address initiator, string creditor,
                    uint freezeLimitTime, string reason) private {
                       
    bool creditorInUnfreeze =  false;
    uint creditorIndex = 0;
   
    if(creditStateMap[initiator].electedCreditors.length > 0) {
               for(uint i=0; i < creditStateMap[initiator].electedCreditors.length; i++ ) {
                   if(equal(creditStateMap[initiator].electedCreditors[i],creditor)) {
                       creditorInUnfreeze = true;
                       creditorIndex = i;
                       break;
                   }
               }
    }
              
               creditStateMap[initiator].electedCreditors.push(creditor);
    creditStateMap[initiator].unfreezeTimings.push(now);
    creditStateMap[initiator].unfreezeDuration.push(freezeLimitTime);
    creditStateMap[initiator].reasonForUnfreeze.push(reason);
    
               LogUserAddress(initiator);
               LogCreditState(false);
               LogCreditFreezeTime(creditStateMap[initiator].unfreezeTimings[creditorIndex]);
               logElectedCreditor(creditStateMap[initiator].electedCreditors[creditorIndex]);
               LogCreditFreezeDuration(creditStateMap[initiator].unfreezeDuration[creditorIndex]);
               logReasonForUnfreeze(creditStateMap[initiator].reasonForUnfreeze[creditorIndex]);
 
    }
 
   function recordCreditFreezeAndLogEvent(address initiator) private {
    
    for(uint j=0; j < creditStateMap[initiator].electedCreditors.length ; j++){
        delete creditStateMap[initiator];
    }
    LogUserAddress(initiator);
    LogCreditState(true);
    LogCreditFreezeTime(now);
  }
  
  function killContract()  {
    if(msg.sender != contractOwner) throw;
    LogEvent("Killing the contract");
   
    selfdestruct(contractOwner);
  }
 
  function compare(string _a, string _b) returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
   
    /// @dev Compares two strings and returns true iff they are equal.
  function equal(string _a, string _b) returns (bool) {
        return compare(_a, _b) == 0;
  }
 
}
