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
		console.log(CreditStateControllerContract)
		var contractAddress = '0xeab1e277ffb7a41a65996f5a3666e8418b2e7607'; // CreditStateControllerContract.networks[0].address
		var contract = web3.eth.contract(contractAbi).at(contractAddress); // Same as MetaCoin.deployed() in truffle console
			
			// console.log('contract',contract)
		vm.days = ['1 day', '2 days', '3 days']
		vm.selectedDay = vm.days[0];
		function getSeconds(arg) {
			if (arg == vm.days[0]) {
				return 86400
			} else if (arg == vm.days[1]) {
				return 172800
			} else {
				return 259200
			}
		}


		// Retrieve last transaction state
		function getCurrentState() {
			var blockDetails = web3.eth.getBlock(web3.eth.blockNumber)
			var txnDetail = web3.eth.getTransactionReceipt(blockDetails.transactions[0])
			if (web3.toDecimal(txnDetail.logs[2].data) == 1) {
				vm.creditReportState = 'true';
			} else {
				vm.creditReportState = 'false';
			}
		}
		getCurrentState();
		// console.log('vm.creditReportState',vm.creditReportState)
		vm.addresses = contract._eth.accounts;
		vm.addressOne = vm.addresses[0];
		vm.addressTwo = vm.addresses[1];
		vm.selectedAddress = vm.addresses[0];

		vm.duration = 86400;
		
		function getTransactionReceipt(arg) { // TXN hash passed as param
			// console.log('TXN arg',arg)
			var logs = [];
			var receipt = web3.eth.getTransactionReceipt(arg);
			// console.log('receipt',receipt)
			for (var i = 0; i < receipt.logs.length; i++) {
				// console.log(receipt.logs.length)
				if (i == 0) { // Message
					logs.push(web3.toAscii(receipt.logs[i].data))
				} else if (i == 1) { // Address
					logs.push(web3.toDecimal(receipt.logs[i].data))
				} else if (i == 2) { // Bool
					(web3.toDecimal(receipt.logs[i].data) == 1) ? logs.push(true) : logs.push(false) 
				} else if (i == 3) { // Timestamp
					logs.push(secondsConverter(web3.toDecimal(receipt.logs[i].data)))
				} else if (i == 4) { // Creditor
					logs.push(web3.toAscii(receipt.logs[i].data))
				} else if (i == 5) { // Duration
					logs.push(secondsToHms(web3.toDecimal(receipt.logs[i].data)))
				} else if (i == 6) { // Reason
					logs.push(web3.toAscii(receipt.logs[i].data))
				}
			}
			// console.log('logs',logs)
			return logs
		}
		function secondsToHms(d) {
		    d = Number(d);
		    var h = Math.floor(d / 3600);
		    var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") : "";
		    return hDisplay; 
		}
		function secondsConverter(time) {
			var date = new Date(null);
			date.setSeconds(time); // specify value for SECONDS here
			return date.toISOString().substr(11, 8);
		}


		vm.transactions = [];
		// my_array[my_array.length - 1]
		function pushTxn(obj) {
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
			

			var txnAdd = getTransactionReceipt(txnHash);
			// console.log('txnAdd',txnAdd)
			var txn = {
				'hash': txnObject.hash,
				'blockNumber': txnObject.blockNumber,
				'from': txnObject.from,
				'address': 'NA', //txnAdd[1]
				'bool': txnAdd[2],
				'timestamp': txnAdd[3],
				'duration': txnAdd[5],
				'creditor': txnAdd[4],
				'message': txnAdd[6]
			}
			// console.log('txn',txn)
			vm.transactions.push(txn);


		}

		// SWITCH freeze 1 param unfreeze 2 params next iteration of contract
		vm.freeze = () => {
			contract.freeze(vm.addressOne, {from: vm.selectedAddress, gas: 100000}, (err, res) => {

			  if (!err)
			    pushTxn(res)
				// vm.creditReportState = contract.queryCurrentState.call(vm.addressOne).toString(10);
				vm.creditReportState = 'true'
				$scope.$apply()
			});
		}
		vm.creditor = "AIB"
		vm.reason = "Discosed"
		vm.unFreeze = () => {
			contract.unFreeze(vm.addressOne, vm.creditor, getSeconds(vm.selectedDay), vm.reason, {from: vm.selectedAddress, gas: 400000}, (err, res) => {
			  console.log('res', res)
			  if (!err)
			    pushTxn(res)
				// vm.creditReportState = contract.queryCurrentState.call(vm.addressOne).toString(10);
				vm.creditReportState = 'false';
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
