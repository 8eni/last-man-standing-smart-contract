import crcHtml from './crc.html';
import Web3 from 'web3';
import jquery from 'jquery';
import bootstrap from 'bootstrap';
import CreditStateControllerContract from '../../build/contracts/CreditStateController.json'

let crcComponent = {
	template: crcHtml,
	controllerAs: 'vm',
	controller: function(crcService, $scope) {
		
		const vm = this;
		vm.title = crcService.title();
		// Intiate Web3 instance
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		// Contract details
		var contractAbi = CreditStateControllerContract.abi;
		var contractAddress = '0x4ac003c2a627766299a6ee93bea2b06373950885'; // CreditStateControllerContract.networks[0].address
		var contract = web3.eth.contract(contractAbi).at(contractAddress); // Same as MetaCoin.deployed() in truffle console
			
			// console.log('contract',CreditStateControllerContract.networks)
		vm.addressOne = contract._eth.accounts[0];
		vm.addressTwo = contract._eth.accounts[1];
		// vm.balanceInEth = contract.getBalanceInEth.call(vm.addressOne).toString(10)	
		vm.balance = 0;
		vm.creditReportState = false; 
		// console.log('TXNs',web3.eth.blockNumber)
		// console.log('TXNs',web3.eth.getTransactionsByAccount(vm.addressOne))
		
		vm.transactions = [];
		function pushTxn(obj, bool) {
			var txnHash;
			(obj.hash) ? txnHash = obj : txnHash = web3.eth.getTransaction(obj);
			var txn = {
				'hash': txnHash.hash,
				'blockNumber': txnHash.blockNumber,
				'from': txnHash.from,
				'state': bool,
				'gas': txnHash.gas
			}
			vm.transactions.push(txn);
		}
		vm.freeze = () => {
			contract.freeze(vm.addressOne, {from: vm.addressOne}, (err, res) => {
			  if (!err)
			    pushTxn(res, true)
				vm.creditReportState = contract.queryCurrentState.call(vm.addressOne).toString(10);
				$scope.$apply()
			});
		}

		vm.unFreeze = () => {
			contract.unFreeze(vm.addressOne, {from: vm.addressOne}, (err, res) => {
			  if (!err)
			    pushTxn(res, false)
				vm.creditReportState = contract.queryCurrentState.call(vm.addressOne).toString(10);
				$scope.$apply()
			});
		}

		function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
		  if (endBlockNumber == null) {
		    endBlockNumber = web3.eth.blockNumber;
		  }
		  if (startBlockNumber == null) {
		    startBlockNumber = endBlockNumber - 1000;
		  }
		  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
		    var block = web3.eth.getBlock(i, true);
		    if (block != null && block.transactions != null) {
		      block.transactions.forEach( function(e) {
		        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
		        	pushTxn(e, true)
		        }
		      })
		    }
		  }
		}
		var firstPage = web3.eth.blockNumber - 10;
		getTransactionsByAccount(vm.addressOne, firstPage, web3.eth.blockNumber);

  
	}

}


export default crcComponent;
