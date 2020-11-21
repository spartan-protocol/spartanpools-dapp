import Web3 from 'web3'
import axios from 'axios'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Base.json'
import ROUTER from '../artifacts/Router.json'
import POOLS from '../artifacts/Pool.json'
import UTILS from '../artifacts/Utils.json'
import DAO from '../artifacts/Dao.json'
import BOND from '../artifacts/Bond.json'

const net = '';

export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xb58a43D2D9809ff4393193de536F242fefb03613' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'
export const UTILS_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'
export const DAO_ADDR = net === 'testnet' ? '0x1b83a813045165c81d84b9f5d6916067b57FF9C0' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'
export const ROUTER_ADDR = net === 'testnet' ? '0xd992130bB595f77B6cAC22fBdb5EBAc888CDe850' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'
export const BOND_ADDR = net === 'testnet' ? '0x7e44b5461A50adB15329895b80866275192a54f6' : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'

export const SPARTA_ABI = SPARTA.abi
export const ROUTER_ABI = ROUTER.abi
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ABI = UTILS.abi
export const DAO_ABI = DAO.abi
export const BOND_ABI = BOND.abi

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}

export const getExplorerURL = () => {
    return "https://bscscan.com/"
}

export const getCurrentBlock = async () => {
    var web3 = getWeb3()
    var block = await web3.eth.getBlockNumber()
    return block
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
    //console.log(resp.data["spartan-protocol-token"].usd)
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
export const getBondContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(BOND_ABI, BOND_ADDR)
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
    //console.log({ assetDetailsArray })
    return assetDetailsArray
}

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
    //console.log(tokenArray)
    return tokenArray
}

export const getAlltokens = async () => {
    let data = await Promise.all([getAssets(), getListedTokens()])
    let assetArray = data[0]
    let tokenArray = data[1]
    let allTokens = assetArray.concat(tokenArray)
    var sortedTokens = [...new Set(allTokens)].sort()
    return sortedTokens;
}

export const getListedPools= async () => {
    console.log('start getlistedpools')
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
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
    //console.log(poolsData)
    return poolsData
}

export const getPool = async (address) => {
    var contract = getUtilsContract()
    let token = address === WBNB_ADDR ? BNB_ADDR : address
    let data = await Promise.all([contract.methods.getTokenDetails(token).call(), getBondContract().methods.isListed(token).call(), contract.methods.getPoolData(token).call(), contract.methods.getPoolAPY(token).call()])
    let tokenDetails = data[0]
    let bondListed = data[1]
    let poolDataRaw = data[2]
    let apy = data[3]
    let decDiff = 10 ** (18 - tokenDetails.decimals)
    let poolData = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'decimals': tokenDetails.decimals,
        'address': token,
        'price': +poolDataRaw.baseAmount / (+poolDataRaw.tokenAmount * decDiff),
        'volume': +poolDataRaw.volume,
        'baseAmount': +poolDataRaw.baseAmount,
        'tokenAmount': (+poolDataRaw.tokenAmount * decDiff),
        'depth': 2 * +poolDataRaw.baseAmount,
        'txCount': +poolDataRaw.txCount,
        'apy': +apy,
        'units': +poolDataRaw.poolUnits,
        'fees': +poolDataRaw.fees,
        'bondListed':bondListed
    }
    return poolData
}

export const getPoolData = async (address, poolsData) => {
    const poolData = poolsData.find((item) => item.address === address)
    //console.log(poolData)
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
    //console.log({globalData})
    return globalData
}

// Get Wallet Data (Inital load; just SPARTA & BNB)
export const getWalletData = async (address) => {
    console.log('start getWalletData')
    var walletData = []
    walletData.push({
        'symbol': 'SPARTA',
        'name': 'Sparta',
        'decimals': 18,
        'balance': await getTokenContract(SPARTA_ADDR).methods.balanceOf(address).call(),
        'address': SPARTA_ADDR
    })
    walletData.push({
        'symbol': 'BNB',
        'name': 'BNB',
        'decimals': 18,
        'balance': await getBNBBalance(address),
        'address': BNB_ADDR
    })
    walletData.push({
        'symbol': 'WBNB',
        'name': 'Wrapped BNB',
        'decimals': 18,
        'balance': await getTokenContract(WBNB_ADDR).methods.balanceOf(address).call(),
        'address': WBNB_ADDR
    })
    //console.log(walletData)
    return walletData
}

// Get Wallet Data (Remaining assets)
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
    for (let i = currentLength - 2; i < results; i++) {
        var addr = tokenArray[i]
        let data = await Promise.all([getTokenContract(addr).methods.balanceOf(account).call(), getUtilsContract().methods.getTokenDetails(addr).call()])
        var balance = data[0]
        var details = data[1]
        let decDiff = 10 ** (18 - details.decimals)
        //if (balance > 0) {
            walletData.push({
                'symbol': details.symbol,
                'name': details.name,
                'decimals': details.decimals,
                'balance': balance * decDiff,
                'address': addr
            })
        //}
    }
    //console.log(walletData)
    return walletData
}

// Update Wallet Data (Specific Asset)
export const updateWalletData = async (account, prevWalletData, tokenAddr) => {
    console.log('start updateWalletData') 
    let walletData = prevWalletData
    const findToken = (element) => element.address === tokenAddr
    const index = walletData.findIndex(findToken)
    if (index === -1) {
        console.log('error finding token in walletData')
    }
    else {
        // first half of old array
        const part1 = walletData.slice(0, index)
        // second half of old array
        const part3 = walletData.slice(index + 1)
        // updated data for target token
        var part2 = []
        if (tokenAddr === BNB_ADDR) {
            part2.push({
                'symbol': 'BNB',
                'name': 'BNB',
                'decimals': 18,
                'balance': await getBNBBalance(account),
                'address': BNB_ADDR
            })
        }
        else {
            let data = await Promise.all([getTokenContract(tokenAddr).methods.balanceOf(account).call(), getUtilsContract().methods.getTokenDetails(tokenAddr).call()])
            var balance = data[0]
            var details = data[1]
            let decDiff = 10 ** (18 - details.decimals)
            part2.push({
                'symbol': details.symbol,
                'name': details.name,
                'decimals': details.decimals,
                'balance': balance * decDiff,
                'address': tokenAddr
            })
        }
        // combine arrays
        walletData = part1.concat(part2, part3)
    }
    //console.log(walletData)
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
    var tokenData = []
    //console.log(walletData)
    if (walletData.length > 0) {
        tokenData = walletData.find((item) => item.address === address)
    }
    return tokenData
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

// Load Initial Shares Data (Wallet Drawer & Earn Page)
export const getSharesData = async (member, poolArray) => {
    console.log('start getSharesData')
    let results = 0
    const pagination = 3
    //console.log(poolArray)
    if (poolArray.length > pagination) {
        results = pagination
    }
    else {
        results = poolArray.length
    }
    let sharesData = []
    for (let i = 0; i < results; i++) {
        let stakesItem = await getPoolShares(member, poolArray[i])
        //if (stakesItem.locked + stakesItem.units > 0) {
        sharesData.push(stakesItem)
        //}
    }
    //console.log(sharesData)
    return sharesData
}

// Load More Shares Data (Wallet Drawer & Earn Page)
export const getNextSharesData = async (member, poolArray, prevSharesData) => {
    console.log('start getNextSharesData')
    let results = 0
    const pagination = 20
    const currentLength = prevSharesData.length
    if (poolArray.length > currentLength + pagination) {
        results = currentLength + pagination
    }
    else {
        results = poolArray.length
    }
    let sharesData = prevSharesData
    for (let i = currentLength; i < results; i++) {
        let stakesItem = await getPoolShares(member, poolArray[i])
        //if (stakesItem.locked + stakesItem.units > 0) {
        sharesData.push(stakesItem)
        //}
    }
    //console.log(sharesData)
    return sharesData
}

// Update Shares Data (Specific Asset)
export const updateSharesData = async (member, prevSharesData, tokenAddr) => {
    console.log('start updateSharesData') 
    let sharesData = prevSharesData
    var newTokenAddr = tokenAddr
    if (tokenAddr === BNB_ADDR) {newTokenAddr = WBNB_ADDR}
    const findPool = (element) => element.address === newTokenAddr
    const index = sharesData.findIndex(findPool)
    if (index === -1) {
        console.log('error finding pool in sharesData')
    }
    else {
        // first half of old array
        const part1 = sharesData.slice(0, index)
        // second half of old array
        const part3 = sharesData.slice(index + 1)
        // updated data for target token
        var part2 = []
        let stakesItem = await getPoolShares(member, newTokenAddr)
        part2.push(stakesItem)
        // combine arrays
        sharesData = part1.concat(part2, part3)
    }
    //console.log(sharesData)
    return sharesData
}

export const getPoolShares = async (member, token) => {
    var contract = getUtilsContract()

    let data = await Promise.all([contract.methods.getMemberShare(token, member).call(), contract.methods.getPool(token).call()])
    let memberData = data[0]
    let poolAddress = data[1]

    let extraData = await Promise.all([contract.methods.getTokenDetails(poolAddress).call(), getTokenContract(poolAddress).methods.balanceOf(member).call(), getDaoContract().methods.mapMemberPool_balance(member, poolAddress).call()])
    let tokenDetails = extraData[0]
    let liquidityUnits = extraData[1]
    let locked = extraData[2]
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

export const getLiquidityData = async (address, sharesData) => {
    const liquidityData = sharesData.find((item) => item.address === address)
    return (liquidityData)
}

// DAO CONTRACT FUNCTIONS (0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0)
export const getRewards = async (member) => {
    let locked = await getDaoContract().methods.calcCurrentReward(member).call()
    return locked;
}

// Note that 'lastBlock' in the resulting array = UNIX timestamp
export const getMemberDetail = async (member) => {
    let memberDetails = await getDaoContract().methods.getMemberDetails(member).call()
    return memberDetails;
}

export const getTotalWeight = async () => {
    let totalWeight = await getDaoContract().methods.totalWeight().call()
    return totalWeight;
}

// Note that 'lastBlock' in the resulting array = UNIX timestamp
export const getBondedMemberDetails = async (member, asset) => {
    let memberDetails = await getBondContract().methods.getMemberDetails(member, asset).call()
    return memberDetails;
}

export const getClaimableLP = async (member, asset) => {
    let bondedLp = await getBondContract().methods.calcClaimBondedLP(member, asset).call()
    return bondedLp;
}
export const getListedCount = async () => {
    let listedCount = await getBondContract().methods.assetListedCount().call()
    return listedCount;
}
export const getAllListedAssets = async () => {
    let allListedAssets = await getBondContract().methods.allListedAssets().call()
    return allListedAssets;
}

export const checkListed = async (asset) => {
    let isListed = await getBondContract().methods.isListed(asset).call()
return isListed;
}

export const getBaseAllocation = async () => {
    let allocation = await getSpartaContract().methods.balanceOf(BOND_ADDR).call()
return allocation;
}