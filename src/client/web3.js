import Web3 from 'web3'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Base.json'
import SROUTER from '../artifacts/Router.json'
import POOLS from '../artifacts/Pool.json'
import UTILS from '../artifacts/Utils.json'

// export const ETH = '0x0000000000000000000000000000000000000000'
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const SPARTA_ADDR = '0x0C1d8c5911A1930ab68b3277D35f45eEd25e1F26'
export const SPARTA_ABI = SPARTA.abi
export const ROUTER_ADDR = '0x15967D09bc67A1aafFC43D88CcD4F6196df3B259'
export const ROUTER_ABI = SROUTER.abi
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ADDR = '0x696a6B50d7FC6213a566fCC197acced4c4dDefa2'
export const UTILS_ABI = UTILS.abi

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}
export const getExplorerURL = () => {
    return "https://explorer.binance.org/smart-testnet/"
}
export const getAccountArray = async () => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts
}

export const getBNBBalance = async (acc) => {
    var web3_ = getWeb3()
    var bal_ = await web3_.eth.getBalance(acc)
    return bal_
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

// Get just an array of tokens that can be upgrade
export const getAssets = async () => {
    var contract = getSpartaContract()
    let assetArray = await contract.methods.allAssets().call()
    console.log({ assetArray })
    return assetArray
}

// Build out Asset Details, as long as have balance
export const getTokenDetails = async (address, assetArray) => {
    let assetDetailsArray = []
    for (let i = 0; i < assetArray.length; i++) {
        let utilsContract = getUtilsContract()
        let assetDetails = await utilsContract.methods.getTokenDetails(assetArray[i]).call()
        // if(+assetDetails.balance > 0){
            assetDetailsArray.push(assetDetails)
        // }
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
    let tokenArray = await contract.methods.allTokens().call()
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
    let tokenDetails = await contract.methods.getTokenDetails(address).call()
    let poolDataRaw = await contract.methods.getPoolData(address).call()
    let apy = await contract.methods.getPoolAPY(address).call()
    let poolData = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': address,
        'price': +poolDataRaw.baseAmt / +poolDataRaw.tokenAmt,
        'volume': +poolDataRaw.volume,
        'baseAmt': +poolDataRaw.baseAmt,
        'tokenAmt': +poolDataRaw.tokenAmt,
        'depth': 2 * +poolDataRaw.baseAmt,
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
    let totalStaked = poolsData.reduce((accum, item) => accum+item.depth, 0)
    let totalTx = poolsData.reduce((accum, item) => accum+item.txCount, 0)
    let totalRevenue = poolsData.reduce((accum, item) => accum+item.fees, 0)

    const networkData = {
        'pools' : poolsData.length,
        'totalVolume': totalVolume,
        'totalStaked': totalStaked,
        'totalTx': totalTx,
        'totalRevenue': totalRevenue,
    }
    console.log(networkData)
    return (networkData)
}

export const getWalletData = async (address, tokenDetailsArray) => {
    // var accountBalance = await getBNBBalance(address)
    var tokens = []
    console.log(tokenDetailsArray)
    var walletData = {
        'address': address,
        'tokens': tokens
    }
    // tokens.push({
    //     'symbol': 'BNB',
    //     'name': 'Binance Chain Token',
    //     'balance': accountBalance,
    //     'address': '0x0000000000000000000000000000000000000000'
    // })
    tokens.push({
        'symbol': 'SPARTA',
        'name': 'Sparta',
        'balance': await getTokenContract(SPARTA_ADDR).methods.balanceOf(address).call(),
        'address': SPARTA_ADDR
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

export const getNewTokenData = async (token, address) => {
    var obj = await getUtilsContract().methods.getTokenDetails(token).call()
    var tokenBalance = await getTokenContract(token).methods.balanceOf(address).call()

    var tokenData = {
        'symbol': obj.symbol,
        'name': obj.name,
        'balance': tokenBalance,
        'address': address
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

export const getStakesData = async (member, tokenArray) => {
    let stakesData = []
    for (let i = 0; i < tokenArray.length; i++) {
        stakesData.push(await getStake(member, tokenArray[i]))
    }
    console.log({ stakesData })
    return stakesData
}

export const getStake = async (member, token) => {
    var contract = getUtilsContract()
    let poolAddress = await contract.methods.getPool(token).call()
    let tokenDetails = await contract.methods.getTokenDetails(poolAddress).call()
    let memberData = await contract.methods.getMemberShare(token, member).call()
    let stakeUnits = await getTokenContract(poolAddress).methods.balanceOf(member).call()
    let apy = await contract.methods.getPoolAPY(token).call()
    let stake = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': token,
        'poolAddress':poolAddress,
        'baseAmt': memberData.baseAmt,
        'tokenAmt': memberData.tokenAmt,
        'roi': +apy,
        'units': +stakeUnits,
        'share': +stakeUnits / +tokenDetails.totalSupply
    }
    return stake
}

export const getStakeData = async (address, stakesData) => {
    const stakeData = stakesData.find((item) => item.address === address)
    return (stakeData)
}
