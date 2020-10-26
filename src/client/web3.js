import Web3 from 'web3'
import axios from 'axios'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Base.json'
import ROUTER from '../artifacts/Router.json'
import POOLS from '../artifacts/Pool.json'
import UTILS from '../artifacts/Utils.json'
import DAO from '../artifacts/Dao.json'

const net = '';

export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xfb0349F08e2078a2944Ae3205446D176c3b45373' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'
export const UTILS_ADDR = net === 'testnet' ? '0xeFD9BfFe7c63Ab5962648E3e83e44306C4dAD747' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'
export const DAO_ADDR = net === 'testnet' ? '0x4b38dCD3E3f422F33Ef1F49eD3A3F11c7A5d27bC' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'
export const ROUTER_ADDR = net === 'testnet' ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'

export const SPARTA_ABI = SPARTA.abi
export const ROUTER_ABI = ROUTER.abi
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ABI = UTILS.abi
export const DAO_ABI = DAO.abi

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}

export const getExplorerURL = () => {
    return "https://bscscan.com/"
}

export const getAccount = async () => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccount()
    return accounts
}

export const getBNBBalance = async (acc) => {
    var web3_ = getWeb3()
    var bal_ = await web3_.eth.getBalance(acc)
    return bal_
}

export const getSpartaPrice = async () => {
    console.log('start get sparta price')
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd')
    console.log('end get sparta price')
    console.log(resp.data["spartan-protocol-token"].usd)
    return resp.data["spartan-protocol-token"].usd
}

export const getTokenContract = (address) => {
    var web3 = getWeb3()
    return new web3.eth.Contract(ERC20_ABI, address)
}

export const getTokenSymbol = async (address) => {
    var contractToken = getTokenContract(address)
    return await contractToken.methods.symbol().call()
}
export const getTokenName = async (address) => {
    var contractToken = getTokenContract(address)
    return await contractToken.methods.name().call()
}

export const getUtilsContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(UTILS_ABI, UTILS_ADDR)
}

export const getSpartaContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(SPARTA_ABI, SPARTA_ADDR)
}

export const getPoolsContract = (address) => {
    var web3 = getWeb3()
    return new web3.eth.Contract(POOLS_ABI)
}

export const getRouterContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDR)
}

export const getDaoContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(DAO_ABI, DAO_ADDR)
}

// Get just an array of tokens that can be upgraded
export const getAssets = async () => {
    var contract = getSpartaContract()
    let assetArray = await contract.methods.allAssets().call()
    //console.log({ assetArray })
    return assetArray
}

// Check if last page, if true remember to setContext n the component (after getting next array data)
export const checkArrayComplete = (refArray, prevArray) => {
    const pagination = 20
    if (prevArray.length + pagination >= refArray.length) {
        return true
    }
    else return false
}

// Build out Asset Details, as long as they have a balance
export const getTokenDetails = async (address, tokenArray) => {
    console.log('start getTokenDetails')
    let assetDetailsArray = []
    for (let i = 0; i < tokenArray.length; i++) {
        let utilsContract = getUtilsContract()
        let token = tokenArray[i] === WBNB_ADDR ? BNB_ADDR : tokenArray[i]
        let assetDetails = await utilsContract.methods.getTokenDetailsWithMember(token, address).call()
        if(+assetDetails.balance > 0) {
            assetDetailsArray.push(assetDetails)
        }
    }
    console.log('end getTokenDetails')
    console.log({ assetDetailsArray })
    return assetDetailsArray
}

// eslint-disable-next-line
{/*
export const getNextTokenDetails = async (address, tokenArray, prevTokenData, page, isLoading, isNotLoading, isCompleteArray) => {
    isLoading()
    let results = 0
    const pagination = 1
    if (tokenArray.length > page * pagination) {
        results = page * pagination
    }
    else {
        results = tokenArray.length
        isCompleteArray()
    }
    let assetDetailsArray = prevTokenData
    for (let i = assetDetailsArray.length; i < results; i++) {
        let utilsContract = getUtilsContract()
        let token = tokenArray[i] === WBNB_ADDR ? BNB_ADDR : tokenArray[i]
        let assetDetails = await utilsContract.methods.getTokenDetailsWithMember(token, address).call()
        if(+assetDetails.balance > 0) {
            assetDetailsArray.push(assetDetails)
        }
    }
    isNotLoading()
    return assetDetailsArray
}
*/}

// Filter tokens for eligiblity to upgrade
export const getEligibleAssets = async (address, assetDetailsArray) => {
    const eligibleAssetArray = assetDetailsArray.find((item) => !item.hasClaimed)
    //console.log({ eligibleAssetArray })
    return eligibleAssetArray
}

export const getListedTokens = async () => {
    console.log('start getlistedtokens')
    var contract = getUtilsContract()
    let tokenArray = await contract.methods.allTokens().call()
    console.log('end getlistedtokens')
    //console.log(tokenArray)
    return tokenArray
}

export const getAlltokens = async () => {
    let assetArray = await getAssets()
    let tokenArray = await getListedTokens()
    let allTokens = assetArray.concat(tokenArray)
    var sortedTokens = [...new Set(allTokens)].sort()
    return sortedTokens;
}

export const getListedPools= async () => {
    console.log('start getlistedpools')
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
    console.log('end getlistedpools')
    //console.log(poolArray)
    return poolArray
}

// Get Pools Table Data (initial load)
export const getPoolsData = async (tokenArray) => {
    console.log('start getPoolsData')
    let results = 0
    const pagination = 3
    if (tokenArray.length > pagination) {
        results = pagination
    }
    else {
        results = tokenArray.length
    }
    let poolsData = []
    for (let i = 0; i < results; i++) {
        poolsData.push(await getPool(tokenArray[i]))
    }
    console.log('end getPoolsData')
    //console.log(poolsData)
    return poolsData
}

/// Get Pools Table Data (pagination)
export const getNextPoolsData = async (tokenArray, prevPoolsData) => {
    console.log('start getNextPoolsData')
    let results = 0
    const pagination = 20
    const currentLength = prevPoolsData.length
    if (tokenArray.length > currentLength + pagination) {
        results = currentLength + pagination
    }
    else {
        results = tokenArray.length
    }
    let poolsData = prevPoolsData
    for (let i = currentLength; i < results; i++) {
        poolsData.push(await getPool(tokenArray[i]))
    }
    console.log('end getNextPoolsData')
    //console.log(poolsData)
    return poolsData
}

export const getPool = async (address) => {
    var contract = getUtilsContract()
    let token = address === WBNB_ADDR ? BNB_ADDR : address
    let tokenDetails = await contract.methods.getTokenDetails(token).call()
    let poolDataRaw = await contract.methods.getPoolData(token).call()
    let apy = await contract.methods.getPoolAPY(token).call()
    let poolData = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': token,
        'price': +poolDataRaw.baseAmount / +poolDataRaw.tokenAmount,
        'volume': +poolDataRaw.volume,
        'baseAmount': +poolDataRaw.baseAmount,
        'tokenAmount': +poolDataRaw.tokenAmount,
        'depth': 2 * +poolDataRaw.baseAmount,
        'txCount': +poolDataRaw.txCount,
        'apy': +apy,
        'units': +poolDataRaw.poolUnits,
        'fees': +poolDataRaw.fees
    }
    return poolData
}

export const getPoolData = async (address, poolsData) => {
    const poolData = poolsData.find((item) => item.address === address)
    console.log(poolData)
    return (poolData)
}

export const getNetworkData = async (poolsData) => {
    let totalVolume = poolsData.reduce((accum, item) => accum+item.volume, 0)
    let totalPooled = poolsData.reduce((accum, item) => accum+item.depth, 0)
    let totalTx = poolsData.reduce((accum, item) => accum+item.txCount, 0)
    let totalRevenue = poolsData.reduce((accum, item) => accum+item.fees, 0)

    const networkData = {
        'pools' : poolsData.length,
        'totalVolume': totalVolume,
        'totalPooled': totalPooled,
        'totalTx': totalTx,
        'totalRevenue': totalRevenue,
    }
    //console.log(networkData)
    return (networkData)
}

// get global pools data stats (txns, APY etc)
export const getGlobalData = async ()  => {
    console.log('start getGlobalData')
    var contract = getUtilsContract()
    let globalData = await contract.methods.getGlobalDetails().call()
    console.log('end getGlobalData')
    //console.log({globalData})
    return globalData
}

// Get SPARTA & BNB (Initial wallet assets load)
export const getWalletData = async (address) => {
    console.log('start getWalletData')
    var walletData = []
    walletData.push({
        'symbol': 'SPARTA',
        'name': 'Sparta',
        'balance': await getTokenContract(SPARTA_ADDR).methods.balanceOf(address).call(),
        'address': SPARTA_ADDR
    })
    walletData.push({
        'symbol': 'BNB',
        'name': 'BNB',
        'balance': await getBNBBalance(address),
        'address': BNB_ADDR
    })
    console.log('end getWalletData')
    //console.log(walletData)
    return walletData
}

export const getNextWalletData = async (account, tokenArray, prevWalletData) => {
    console.log('start getNextWalletData') 
    let results = 0
    const pagination = 20
    const currentLength = prevWalletData.length
    if (tokenArray.length > currentLength + pagination) {
        results = currentLength + pagination
    }
    else {
        results = tokenArray.length
    }
    let walletData = prevWalletData
    for (let i = currentLength - 1; i < results; i++) {
        var addr = tokenArray[i]
        var balance = await getTokenContract(addr).methods.balanceOf(account).call()
        var details = await getUtilsContract().methods.getTokenDetails(addr).call()
        //if (balance > 0) {
            walletData.push({
                'symbol': details.symbol,
                'name': details.name,
                'balance': balance,
                'address': addr
            })
        //}
    }
    console.log('end getNextWalletData')
    console.log(walletData)
    return walletData
}

export const getNewTokenData = async (address, member) => {
    let token = address === WBNB_ADDR ? BNB_ADDR : address
    var obj = await getUtilsContract().methods.getTokenDetailsWithMember(token, member).call()
    // var tokenBalance = await getTokenContract(token).methods.balanceOf(address).call()

    var tokenData = {
        'symbol': obj.symbol,
        'name': obj.name,
        'balance': token === BNB_ADDR ? await getBNBBalance(member) : obj.balance,
        'address': token
    }

    //console.log(tokenData)
    return tokenData
}

export const getTokenData = async (address, walletData) => {
    const tokenData = walletData.find((item) => item.address === address)
    return (tokenData)
}

// Get all tokens on wallet that have a pool - swapping
export const filterWalletByPools = async (poolsData, walletData) => {
    const Wallet = walletData
    const pools = poolsData.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => pools.includes(item) || item === SPARTA)
    return tokens
}

// Get all tokens on wallet that do not have a pool - for creating a new pool
export const filterWalletNotPools = async (poolsData, walletData) => {
    const Wallet = walletData
    const pools = poolsData.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => !pools.includes(item) && item !== SPARTA)
    return tokens
}

// Get all tokens that can be sold into the pool
export const filterTokensByPoolSelection = async (address, poolsData, walletData) => {
    const tokens = await filterWalletByPools(poolsData, walletData)
    const tokensByPool = tokens.filter((item) => item !== address)
    return tokensByPool
}

export const filterTokensNotPoolSelection = async (address, poolsData, walletData) => {
    const tokens = await filterWalletNotPools(poolsData, walletData)
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}

// Load Initial Pool Staked Data (Wallet Drawer & Earn Page)
export const getPoolSharesData = async (member, poolArray) => {
    console.log('start getPoolSharesData')
    let results = 0
    const pagination = 3
    //console.log(poolArray)
    if (poolArray.length > pagination) {
        results = pagination
    }
    else {
        results = poolArray.length
        //handleStates('poolSharesDataCompleted')
    }
    let stakesData = []
    for (let i = 0; i < results; i++) {
        let stakesItem = await getPoolShares(member, poolArray[i])
        //if (stakesItem.locked + stakesItem.units > 0) {
        stakesData.push(stakesItem)
        //}
    }
    console.log('end getPoolSharesData')
    //console.log(stakesData)
    return stakesData
}

// Load More Pool Staked Data (Wallet Drawer & Earn Page)
export const getNextPoolSharesData = async (member, poolArray, prevStakesData) => {
    console.log('start getNextPoolSharesData')
    let results = 0
    const pagination = 20
    const currentLength = prevStakesData.length
    if (poolArray.length > currentLength + pagination) {
        results = currentLength + pagination
    }
    else {
        results = poolArray.length
    }
    let stakesData = prevStakesData
    for (let i = currentLength; i < results; i++) {
        let stakesItem = await getPoolShares(member, poolArray[i])
        //if (stakesItem.locked + stakesItem.units > 0) {
        stakesData.push(stakesItem)
        //}
    }
    console.log('end getNextPoolSharesData')
    console.log(stakesData)
    return stakesData
}

export const getPoolShares = async (member, token) => {
    var contract = getUtilsContract()
    let poolAddress = await contract.methods.getPool(token).call()
    let tokenDetails = await contract.methods.getTokenDetails(poolAddress).call()
    let memberData = await contract.methods.getMemberShare(token, member).call()
    let liquidityUnits = await getTokenContract(poolAddress).methods.balanceOf(member).call()
    let locked = await getDaoContract().methods.mapMemberPool_balance(member, poolAddress).call()
    let share = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': token,
        'poolAddress':poolAddress,
        'baseAmount': memberData.baseAmount,
        'tokenAmount': memberData.tokenAmount,
        'locked': locked,
        'units': liquidityUnits,
        'share': +liquidityUnits / +tokenDetails.totalSupply
    }
    //console.log({share})
    return share
}

export const getLiquidityData = async (address, stakesData) => {
    const liquidityData = stakesData.find((item) => item.address === address)
    return (liquidityData)
}

export const getRewards = async (member) => {
    let locked = await getDaoContract().methods.calcCurrentReward(member).call()
    return locked;
}
