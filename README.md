# Solidity Smart Contract
Smart contract built in solidity to be deployed on Ethereum MainNet

**Compile** your contracts
	
	truffle compile

**Migrate** to testrpc (make sure testrpc is running)

	truffle migrate

*Interact* with contract via truffle console

    truffle console
    var x = EscrowContract.deployed();
	x.then((res) => { return res.address })
	// returns the below (testrpc address)
	'0xcd3e91bcd2f6ff6aeee0f388c61e5389d36e68cb'
