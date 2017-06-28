# MetaCoin Smart Contract
**AngularJs** front-end for **truffle** and **testrpc**

**Prerequisites** global
	
	- node/npm
	- truffle
	- testrpc


**NPM** install dependencies
	
	npm install

**Compile** your contracts
	
	truffle compile

**Migrate** to testrpc (make sure testrpc is running)

	truffle migrate

*Interact* with smart contract via truffle console

	MetaCoin.deployed().then((res)=>{
		return res.getBalance.call(accounts[0])
	}).then((balance)=>{
		return(balance)
	})


*Remix* try the following in remix

	newEntrys
	- "A",2 from addr 1
	- "B",4  from addr 2
	- "C",5  from addr 3

	advanceUsersToNextRound
	- [4,5]

	nextUserEntry
	- "L",10  from addr 2
	- "M",11  from addr 3

	advanceUsersToNextRound
	- [10]
	    - winners = 1
	    - weHaveAWinner sets 'var winner' as winning address

	retrievePot
	- from addr 2


**Last Man Standing (LMS) laymens**

Users can enter comp once only on Game Week (GW) 1 
- User 1 picks 'Arsenal' to win for GW1
- User 2 picks 'Burnley' to win for GW1
- User 3 picks 'Chelsea' to win for GW1

Chairperson (Person who deployed contract) adds winners from GW1
- Chairperson adds winning teams, only 2 users who had winners they were 'Burnley' or 'Chelsea'
- Users 2 & 3 go through to next round GW2

Users can choose entries for GW2
- User 2 picks 'Liverpool' to win for GW2
- User 3 picks 'Man City' to win for GW2
 
Chairperson adds winners from GW2
- Chairperson adds winning teams, only 1 user who had winner that was 'Liverpool'
- User is set as winner

Winning user can retrieve the pot to his account
- Winner runs 'retrieve pot' function
- winner matches message.sender funds are deposited to his account

**FAQ**

What if everyone wins in the round
- Everyone goes through to the next round

What if everyone looses in the round
- Everyone goes through to the next round

What if a user attempts to enter after kickoff
- Chairperson has ability to suspend user entry at any stage e.g. before KO
	- ideally handled by oracle

What if user attemts to join comp after GW1
- They will be automatically thrown

I've won, How do I collect the pot
- If you are the only remaining user, your address will be assigned to the winner variable,
run retrievePot if winner matches sending address funds deposit to this address

I picked the wrong team can I amend
- No not currently

How do I check how much is in the pot
- Users can run getPotAmount to return the amount in pot

How do I check how many have entered
- Users can run getUsersEnteredCount to return users entered

How do I check how many users are left in comp
- Users can run getUsersLeft to return users left


**Refactoring**

- Update NewStruct method 


**Improvements**

- Chairperson submits winners, users confirm these these are correct by consensyus
- clean up checkForWinner logic
- Cut down gas TXN's costs, use memory