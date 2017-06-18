import metacoinHtml from './metacoin.html';
import Web3 from 'web3';
import MetaCoinContract from '../../build/contracts/MetaCoin.json'

let metacoinComponent = {
	template: metacoinHtml,
	controllerAs: 'vm',
	controller: function(metacoinService) {
		
		const vm = this;
		vm.title = metacoinService.title();
		// Intiate Web3 instance
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		// Contract details
		var contractAbi = MetaCoinContract.abi;
		var contractAddress = '0xa8942503aa7e81869417b15bdd9ccc305d66f309';
		var contract = web3.eth.contract(contractAbi).at(contractAddress); // Same as MetaCoin.deployed() in truffle console
		
		vm.address = contract._eth.accounts[0];
		vm.balance = contract.getBalance.call(vm.address).toString(10)		
  
	}

}


export default metacoinComponent;
