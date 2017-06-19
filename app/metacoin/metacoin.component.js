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
		
		vm.addressOne = contract._eth.accounts[0];
		vm.addressTwo = contract._eth.accounts[1];
		vm.balanceInEth = contract.getBalanceInEth.call(vm.addressOne).toString(10)	
		vm.balance = 0;	

		// console.log(contract._eth.accounts)
		vm.getBalance = (acc) => {
			console.log(acc)
			vm.balance = contract.getBalance.call(acc).toString(10)
		}
		vm.sendCoin = () => {
			contract.sendCoin(vm.addressTwo, 10, {from: vm.addressOne}, (err, hash) => {
			  if (!err)
			    console.log('TXN',hash);
				console.log(web3.eth.getTransaction(hash))
			});
		}
  
	}

}


export default metacoinComponent;
