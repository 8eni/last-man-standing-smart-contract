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


Last Man Standing (LMS) laymens

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

If everyone wins in a round they all go through to the next round
same goes for everyone loosing, they are automatically promoted ot next round