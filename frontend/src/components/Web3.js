import Web3 from 'web3'
import TicTacToeJSON from '../abis/TicTacToe.json'
import TicTacToeFactoryJSON from '../abis/TicTacToeFactory.json'
import { Transaction } from '@ethereumjs/tx'

const adminAccount = "0x8D0CeeEaa9bFe5020FCa48C033bd68f6D0911B79"
const privatekey = "e2c4c7ed53e4642e256c90280386851f9821f7ae19a3a9d8602abab60e0ba473"


const initializeWeb3 = () => {
    var web3;
    if (window.ethereum) {
        // initialize web3
        web3 = new Web3(window.ethereum);
        window.ethereum.enable()
    }
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }
    // Non-DApp Browsers
    else {
        alert('You have to install MetaMask !');
    }
    console.log(web3)

    return web3
}

const web3 = initializeWeb3()


const getCurrentAddressMetamask = async () => {
    try {
        const { eth } = web3
        let accounts = await eth.getAccounts();
        return accounts[0]
    } catch (error) {
        console.log(error)
        return ''
    }


}

const getBaseContactAddres = async () => {
    const { eth } = web3
    const { abi, networks } = TicTacToeJSON
    const networkIds = Object.keys(networks)
    const address = networks[networkIds[0]].address
    return address;
}

const getContract = async () => {
    const { eth } = web3
    const { abi, networks } = TicTacToeFactoryJSON
    const networkIds = Object.keys(networks)
    const address = networks[networkIds[0]].address
    const contract = new eth.Contract(abi, address)
    return contract;
}

const createChallenge = async (code, amount) => {
    // initialize the contract 
    let baseContract = await getBaseContactAddres()
    let contract = await getContract();
    let success = await contract.methods.createChallenge(baseContract, code).send({ from: window.web3.currentProvider.selectedAddress, value: amount * 1000000000000000000, gasFee: 21000 })
    return success.status;
}

const acceptChallenge = async (code, amount) => {
    try {
        let contract = await getContract();
        let success = await contract.methods.acceptChallenge(code).send({ from: window.web3.currentProvider.selectedAddress, value: amount * 1000000000000000000, gasFee: 21000 })
        return success.status;
    } catch (error) {
        throw error;
    }

}

const getStakedAmount = async (code) => {
    let contract = await getContract();
    let stakedAmount = await contract.methods.getStakedAmount(code).call()
    return stakedAmount;
}

const getNoOfMoves = async (code) => {
    let contract = await getContract();
    let noOfMoves = await contract.methods.getNoOfMoves(code).call()
    return noOfMoves;
}

const getCurrentPlayer = async (code) => {
    let contract = await getContract();
    let currentPlayer = await contract.methods.getCurrentPlayer(code).call()
    return currentPlayer;
}

const move = async (x, y, code) => {
    try {
        let contract = await getContract();
        let success = await contract.methods.move(x, y, code).send({ from: window.web3.currentProvider.selectedAddress })
        return success.status;
    } catch (error) {
        console.log("samad",error)
        return false;
    }
}

const GameOver = async (code) => {
    try {
        let contract = await getContract();
        let isGameOver = await contract.methods.isGameOver(code).call({})
        return isGameOver;
    } catch (error) {
        return true;
    }
   
}




export { createChallenge, getCurrentAddressMetamask, getStakedAmount, acceptChallenge, getNoOfMoves, getCurrentPlayer, move, GameOver }
