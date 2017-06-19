import metacoinHtml from './metacoin.html';
import Web3 from 'web3';
import jquery from 'jquery';
import bootstrap from 'bootstrap';
import CreditStateControllerContract from '../../build/contracts/CreditStateController.json'

let metacoinComponent = {
	template: metacoinHtml,
	controllerAs: 'vm',
	controller: function(metacoinService, $scope) {
		
		const vm = this;
		vm.title = metacoinService.title();
		// Intiate Web3 instance
		var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		// Contract details
		var contractAbi = CreditStateControllerContract.abi;
		var contractAddress = '0x4ac003c2a627766299a6ee93bea2b06373950885'; // CreditStateControllerContract.networks[0].address
		var contract = web3.eth.contract(contractAbi).at(contractAddress); // Same as MetaCoin.deployed() in truffle console
			
		vm.addresses = contract._eth.accounts;
		vm.addressOne = vm.addresses[0];
		vm.addressTwo = vm.addresses[1];
		vm.selectedAddress = vm.addresses[0];
		// vm.balanceInEth = contract.getBalanceInEth.call(vm.addressOne).toString(10)	
		vm.balance = 0;
		vm.creditReportState = false; 
		// console.log('TXNs',web3.eth.getTransaction('0xd84b3d913c4e6297a9c552c11b5cd39a7d3c3eee3e2e3ba6454866908c21fe98'))
		// console.log('TXNs',web3.eth.getTransaction())
		
		function getTransactionReceipt(arg) {
			// var logs = [];
			var receipt = web3.eth.getTransactionReceipt(arg);
			// for (var i = receipt.logs.length - 1; i >= 0; i--) {
			// 	logs.push(web3.toAscii(receipt.logs[i].data))
			// }
			return web3.toAscii(receipt.logs[0].data)

			// console.log('logs',web3.toAscii(receipt.logs[0].data))
		}

		vm.transactions = [];
		function pushTxn(obj, bool) {
			var txnObject;
			var txnHash;
			if (obj.hash) {
				txnHash = obj.hash;
				txnObject = obj;
			} else {
				txnHash = obj;
				txnObject = web3.eth.getTransaction(obj);
				getTransactionReceipt(obj)
			}
			var txn = {
				'hash': txnObject.hash,
				'blockNumber': txnObject.blockNumber,
				'from': txnObject.from,
				'state': bool,
				'gas': txnObject.gas,
				'log': getTransactionReceipt(txnHash)
			}
			vm.transactions.push(txn);
		}
		vm.freeze = () => {
			contract.freeze(vm.addressOne, {from: vm.selectedAddress}, (err, res) => {
			  if (!err)
			    pushTxn(res, true)
				vm.creditReportState = contract.queryCurrentState.call(vm.addressOne).toString(10);
				$scope.$apply()
			});
		}
		vm.unFreeze = () => {
			contract.unFreeze(vm.addressOne, {from: vm.selectedAddress}, (err, res) => {
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


export default metacoinComponent;
