# MetaCoin Smart Contract
AngularJs front-end for truffle and testrpc

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