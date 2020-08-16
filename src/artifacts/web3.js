import Web3 from 'web3'
import baseContract from '../artifacts/MAI.json'
import usd1 from '../artifacts/USD1.json'
import usd2 from '../artifacts/USD2.json'
import usd3 from '../artifacts/USD3.json'
export const getContractAbi = (i) => {
    var contractsArray =
        [{
            'contractAbi': baseContract.abi
        }, {
            'contractAbi': usd1.abi
        }, {
            'contractAbi': usd2.abi
        }, {
            'contractAbi': usd3.abi
        }
    ]
    return contractsArray[i]
}

export const getContractAddrs = (i) => {
    var contractAddress = 
    [{
        address : '0x1cbF76f050bB5565dC4353954f736A8fd4d944e5'
    },{
        address : '0x1781CE136Cf334499e2c05D0076a1502Caa32D44'
    },{
        address : '0xcE24197316cAf336A7707E3d878E3267A1a21516'
    },{
        address : '0x4C832B6a0608CFA3e400F708dc4870042C026015'
    }]
    
    return contractAddress[i]
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}
export const getEtherscanURL = () => {
    return "https://etherscan.io/"
}
export const getAccountArray = async () => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts
}

export const getETHBalance = async (acc) => {
    var web3_ = getWeb3()
    var bal_ = await web3_.eth.getBalance(acc)
    return bal_
}

export const getContract = (i) => {
    var abi_ =  getContractAbi(i)
    var addr_ =  getContractAddrs(i)
    var web3_ = getWeb3()
    return new web3_.eth.Contract(abi_.contractAbi, addr_.address)
}

// export const getWalletData = async () => {}
export const getWalletData = async () => {
    var account = await getAccountArray()
    var address = account[0]
    var accountBalance = await getETHBalance(address)
    var tokens = []
    var accountData = {
        'address': address,
        'tokens': tokens
    }
    tokens.push({
        'symbol':'ETH',
        'name':'etherum',
        'balance': accountBalance,
        'address': "0x0000000000000000000000000000000000000000",
    })
    for(var i = 0; i < 4; i++){
        var tokenSymbol = await getContract(i).methods.symbol().call()
        var tokenName = await getContract(i).methods.name().call()
        var tokenBalance = await getContract(i).methods.balanceOf(address).call()
        var tokenAddress = getContractAddrs(i)

        tokens.push({
            'symbol':tokenSymbol,
            'name':tokenName, 
            'balance':tokenBalance,
            'address': tokenAddress.address })
    }
    // console.log(accountData)
    return accountData
}
export const getWalletTokenData = async(address) => {
    const Wallet = await getWalletData()
    const tokenData = Wallet.tokens.find((item) => item.address === address)
    return (tokenData)
}
export const getTokenSymbol = async (address) => {
    const Wallet = await getWalletData()
    const token = Wallet.tokens.find((item) => item.address === address)
    return (token.symbol) 
}

export const getAllCDPs = async() => {
var allCDPs = await getContract(0).methods.mapCDP_Data(1).call()
console.log(allCDPs)
    return allCDPs
}
export const getAccountCDP = async(address) =>{
    const CDPs = getAllCDPs()
    const cdp = CDPs.find((item) => item.address === address)
    return (cdp)
}
export const getUnSafeCDPs = async() =>{
    // const CDPs = getAllCDPs()
    // const unSafeCDP = CDPs.filter((item) => item.canLiquidate === "true")
    // return (unSafeCDP)
}
export const getSafeCDPs = async() =>{
    // const CDPs = getAllCDPs()
    // const SafeCDP = CDPs.filter((item) => item.canLiquidate === "false")
    // return (SafeCDP)
}
