import Web3 from 'web3'
import axios from 'axios'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Base.json'
import ROUTER from '../artifacts/Router.json'
import POOLS from '../artifacts/Pool.json'
import UTILS from '../artifacts/Utils.json'
import DAO from '../artifacts/Dao.json'

const net = 'MAINET';

export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'BSC' ? '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'BSC' ? '0xfb0349F08e2078a2944Ae3205446D176c3b45373' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'
export const UTILS_ADDR = net === 'BSC' ? '0xeFD9BfFe7c63Ab5962648E3e83e44306C4dAD747' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'
export const DAO_ADDR = net === 'BSC' ? '0x4b38dCD3E3f422F33Ef1F49eD3A3F11c7A5d27bC' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'
export const ROUTER_ADDR = net === 'BSC' ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'

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
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd')
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

// Get just an array of tokens that can be upgrade
export const getAssets = async () => {
    var contract = getSpartaContract()
    let assetArray = await contract.methods.allAssets().call()
    console.log({ assetArray })
    return assetArray
}

// Build out Asset Details, as long as have balance
export const getTokenDetails = async (address, tokenArray) => {
    let assetDetailsArray = []
    for (let i = 0; i < tokenArray.length; i++) {
        let utilsContract = getUtilsContract()
        let token = tokenArray[i] === WBNB_ADDR ? BNB_ADDR : tokenArray[i]
        let assetDetails = await utilsContract.methods.getTokenDetailsWithMember(token, address).call()
        if(+assetDetails.balance > 0){
            assetDetailsArray.push(assetDetails)
        }
    }
    console.log({ assetDetailsArray })
    return assetDetailsArray
}

// Filter tokens for eligiblity to upgrade
export const getEligibleAssets = async (address, assetDetailsArray) => {
    const eligibleAssetArray = assetDetailsArray.find((item) => !item.hasClaimed)
    console.log({ eligibleAssetArray })
    return eligibleAssetArray
}

export const getListedTokens = async () => {
    var contract = getUtilsContract()
    let tokenArray = []
    try {
        tokenArray = await contract.methods.allTokens().call()
    } catch (err) {
        console.log(err)
    }

    console.log({ tokenArray })
    return tokenArray
}

export const getAlltokens = async () => {
    let assetArray = await getAssets()
    let tokenArray = await getListedTokens()
    let allTokens= assetArray.concat(tokenArray)
    var sortedTokens = [...new Set(allTokens)].sort()
    return sortedTokens;
}
export const getListedPools= async () => {
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
    console.log({ poolArray })
    return poolArray
}

export const getPoolsData = async (tokenArray) => {
    let poolsData = []
    for (let i = 0; i < tokenArray.length; i++) {
        poolsData.push(await getPool(tokenArray[i]))
    }
    console.log({ poolsData })
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
    console.log(networkData)
    return (networkData)
}

export const getGlobalData = async ()  => {
    var contract = getUtilsContract()
    let globalData = await contract.methods.getGlobalDetails().call()
    console.log({globalData})
    return globalData
}

export const getWalletData = async (address, tokenDetailsArray) => {
    var tokens = []
    console.log(tokenDetailsArray)
    var walletData = {
        'address': address,
        'tokens': tokens
    }
    tokens.push({
        'symbol': 'SPARTA',
        'name': 'Sparta',
        'balance': await getTokenContract(SPARTA_ADDR).methods.balanceOf(address).call(),
        'address': SPARTA_ADDR
    })
    tokens.push({
        'symbol': 'WBNB',
        'name': 'Wrapped BNB',
        'balance': await getTokenContract(WBNB_ADDR).methods.balanceOf(address).call(),
        'address': WBNB_ADDR
    })

    for (let i = 0; i < tokenDetailsArray.length; i++) {
        var obj = tokenDetailsArray[i]
        tokens.push({
            'symbol': obj.symbol,
            'name': obj.name,
            'balance': obj.tokenAddress === BNB_ADDR ? await getBNBBalance(address) : await getTokenContract(obj.tokenAddress).methods.balanceOf(address).call(),
            'address': obj.tokenAddress
        })
    }
    console.log({ walletData })
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

    console.log(tokenData)
    return tokenData
}

export const getTokenData = async (address, walletData) => {
    const tokenData = walletData.tokens.find((item) => item.address === address)
    return (tokenData)
}

// Get all tokens on wallet that have a pool - swapping
export const filterWalletByPools = async (poolsData, walletData) => {
    const Wallet = walletData.tokens
    const pools = poolsData.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => pools.includes(item) || item === SPARTA)
    return tokens
}

// Get all tokens on wallet that not have a pool - creating new pool
export const filterWalletNotPools = async (poolsData, walletData) => {
    const Wallet = walletData.tokens
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

export const getPoolSharesData = async (member, poolArray) => {
    let stakesData = []
    for (let i = 0; i < poolArray.length; i++) {
        stakesData.push(await getPoolShares(member, poolArray[i]))
    }
    console.log({ stakesData })
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
    console.log({share})
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
