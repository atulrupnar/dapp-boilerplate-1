# dapp-boilerplate
The Dapp boilerplate comes with everything you need to start with smart contract and node.js.
It implements wallet using ERC-20 based tokens. Smart contract integration is done in node application, current front end is implemented in angular 1.6, you can use any technology of your choice. The boilerplate is designed to work with testrpc/ganache-cli considering novoice users.

## Installation 

#### 1. Install Testrpc

```sh
	sudo npm install -g ganache-cli
```

#### 2. Start testrpc

```sh
	testrpc -d
```
Testrpc will generate 10 default accounts.
Copy the first account address (0th account), This will be our contract owner address, Note down for further usage.

#### 3. Clone boilerplate repositry
```sh
	git clone https://github.com/kartikeya95/dapp-boilerplate.git
```

#### 4. Install dependencies 
##### a. Go to root folder and install npm packages
```sh
	cd dapp-boilerplate
	npm install
```
##### b. Go to deployer directory and install contract packages
```sh
	cd deployer
	npm install
```
#### 5. Install Truffle
	sudo npm install -g truffle

#### 6. Deploy Contract
```sh
	cd deployer
	truffle compile
	truffle migrate
```
truffle compile will compile the contracts and generates ABI into build/ folder
truffle migrate deploys the contract on blockchain

#### 7. Configure Application
Create a config.js file at app/config/config.js
Copy content of defaultConfig.js to config.js
Modify the contract owner address with your address (use address noted in step 2)

```sh
	"contractOwner" : {
		//set the address of contract deployer account
		address : "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
		phrase : ""
	}
```
#### 8. Start application
```sh
	npm start
```
#### 9. Open browser and enter following url
```sh
	http://localhost:8001/
```

## How to use application :
First account is the contract owner.
Initially Owner will have all tokens, add supply will add tokens to owners address.
 - Add token increases total supply (minting)
 - To get a balance for any account, use check balance
 - To buy tokens from owner, use Buy Tokens
 - To transfer tokens from one account to another, use Transfer Tokens
 - Step 4 and 5, generates transaction, Use Update Transactions to get transaction list

# Important Files :

 - routes/index.js : Api Endpoint interface
 - routes/web3Helpers/init .js : web3 initialization and common web3 api implementataion
 - routes/web3Helpers/sampleWallet.js : interface to wallet contract
 - deployer/contracts/sampleWallet.sol : solidity wallet contract
 - public/index.js : front end binding (angular)