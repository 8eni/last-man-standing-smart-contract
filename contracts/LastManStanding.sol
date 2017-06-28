pragma solidity ^0.4.11;

// Id: 1  AFC Bournemouth
// Id: 2  Arsenal
// Id: 3  Brighton & Hove Albion
// Id: 4  Burnley
// Id: 5  Chelsea
// Id: 6  Crystal Palace
// Id: 7  Everton
// Id: 8  Huddersfield Town
// Id: 9  Leicester City
// Id: 10 Liverpool
// Id: 11 Manchester City
// Id: 12 Manchester United
// Id: 13 Newcastle United
// Id: 14 Southampton
// Id: 15 Stoke City
// Id: 16 Swansea City
// Id: 17 Tottenham Hotspur
// Id: 18 Watford
// Id: 19 West Bromwich Albion
// Id: 20 West Ham United

contract LastManStanding {
    
    // Chairperson variables
    address chairperson;
    uint gameWeek;
    bool entrySuspended;
    uint stakeToPlay;
    // Other
    uint compPot;
    address compWinner;

    function LastManStanding(uint _stakeToPlay) {
        chairperson = msg.sender;
        gameWeek = 1;
        entrySuspended = false;
        stakeToPlay = _stakeToPlay*1000000000000000000;
    }
    
    modifier chairPerson() {
        if (chairperson != msg.sender) return;
        _;
    }

    struct EntityStruct {
        uint entityTeamId;
        uint entityGameWeek; // Increments if get through to next round
        string entityTeamName; // Change to bytes32
        bool isEntityNextRound; // true(After submission) : false(after newEntity || advanceUsersToNextRound)
        bool isEntityEntered; // Has a submission been made for current GW true : false
        uint entityAmount;
    }
    
    mapping(address => EntityStruct) public entityStructs;
    address[] public entityList;
    uint[] public winners;
    address entityAddress;
    uint usersLeft;
    
    // Log events - All carry string before type e.g. LogBool("Entry suspended is set to ", true)
    event logString(string);
    event logUint(string, uint);
    event logBool(string, bool);
    event logAddress(string, address);

    // Checkers
    function checkIsEntity(address entityAddress) public constant returns(bool isIndeed) {
      return entityStructs[entityAddress].isEntityEntered;
    }
    
    function checkForWinner(uint _usersLeft) constant returns (bool){
        if(_usersLeft > 1) return false;
        if(_usersLeft == 1) {
            compWinner = entityList[0];
            logAddress("We have a winner", compWinner);
            return true;
        } else {
            logUint("DRAW", _usersLeft);
            for (uint8 i = 0; i < entityList.length; i++) { // Roll over addresses
                entityStructs[entityList[i]].isEntityNextRound = true;
                entityStructs[entityList[i]].entityGameWeek = gameWeek;
            }
            return false;
        }
    }
    
    
    // Chairperson
    function suspendUserEntry(bool setEntryAccess) chairPerson public returns (bool _entrySuspended) {
        entrySuspended = setEntryAccess;
        return entrySuspended;
    }
    
    function advanceUsersToNextRound(uint[] _winners) chairPerson public returns(bool weHaveAWinner) {
        winners = _winners;
        gameWeek++; // Increments game week by 1
        entrySuspended = false; // Sets 'entry suspended' back to false
        usersLeft = 0; 
        for (uint8 i = 0; i < entityList.length; i++) { // Iterate over addresses
            for (uint8 j = 0; j < winners.length; j++) { // Iterate over winner Ids
                if (entityStructs[entityList[i]].entityTeamId == winners[j]) {
                    entityStructs[entityList[i]].isEntityNextRound = true;
                    entityStructs[entityList[i]].entityGameWeek = gameWeek;
                    usersLeft++;
                }
            }
            // logAdvance(entityStructs[entityList[i]].entityTeamName, entityStructs[entityList[i]].isEntityNextRound);
        }
        logUint("Gameweek set to ", gameWeek);
        return checkForWinner(usersLeft);
    }
    
    
    // User (new)
    function newEntry(string entityTeamName, uint entityTeamId) payable public returns (uint rowNumber) {
        entityAddress = msg.sender;
        if(checkIsEntity(entityAddress) || gameWeek != 1 || entrySuspended || msg.value != stakeToPlay) throw;
        entityStructs[entityAddress].entityTeamId = entityTeamId;
        entityStructs[entityAddress].entityTeamName = entityTeamName;
        entityStructs[entityAddress].isEntityNextRound = false;
        entityStructs[entityAddress].isEntityEntered = true;
        entityStructs[entityAddress].entityAmount = msg.value;
        compPot += entityStructs[entityAddress].entityAmount;
        usersLeft = entityList.length;
        return entityList.push(entityAddress) - 1;
    }
    
    // User (existing)
    function nextUserEntry(string entityTeamName, uint entityTeamId) public returns (bool nextEntryReceived) {
        if (entrySuspended) throw;
        entityAddress = msg.sender;
        if(entityStructs[entityAddress].entityGameWeek != gameWeek && entityStructs[entityAddress].isEntityNextRound != true) throw;
        entityStructs[entityAddress].entityTeamId = entityTeamId;
        entityStructs[entityAddress].entityTeamName = entityTeamName;
        entityStructs[entityAddress].isEntityNextRound = false;
        return true;
    }
    
    
    // User (winner)
    function collectPotWinnings() public returns (uint totalPot){   
        if (compWinner != msg.sender) throw;
        compWinner.transfer(compPot);
        return compPot;
    }
    
    
    // Standard Getters
    function getUsersEnteredCount() public constant returns(uint entityCount) {
        return entityList.length;
    }

    function getUsersLeft() public constant returns(uint usersLeftInComp) {
        return usersLeft;
    }
    
    function getUserDetails(address _address) public constant returns(uint, string, bool, bool, uint, uint) {
        return (entityStructs[_address].entityTeamId,entityStructs[_address].entityTeamName,entityStructs[_address].isEntityNextRound,entityStructs[_address].isEntityEntered,entityStructs[_address].entityGameWeek,entityStructs[_address].entityAmount);
    }
    
    function getPotAmount() public constant returns (uint pot) {
        return compPot;
    }
    
    // function winnerBalance() constant returns (uint winningPot) {
    //     return winner.balance;
    // }

}