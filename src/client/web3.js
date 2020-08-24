import Web3 from 'web3'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Sparta.json'
import SROUTER from '../artifacts/SRouter.json'
import POOLS from '../artifacts/SPOOL.json'
import UTILS from '../artifacts/Utils.json'

export const ETH = '0x0000000000000000000000000000000000000000'
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const SPARTA_ADDR = '0x0C1d8c5911A1930ab68b3277D35f45eEd25e1F26'
export const SPARTA_ABI = SPARTA.abi
export const ROUTER_ADDR = '0x20d0270649c9f13c081FF98350148706A05557F8'
export const ROUTER_ABI = SROUTER.abi
export const POOLS_ADDR = '0xeEbAe10ead47F2aA115B4BA6f07A227F12A5AaB1'
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ADDR = '0xC7b43AF5Deb54E62d2cdffa9eD1e9F58199ec75E'
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

export const getPoolsContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(POOLS_ABI, POOLS_ADDR)
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
export const getAssetDetails = async (address, assetArray) => {
    let assetDetailsArray = []
    for (let i = 0; i < assetArray.length; i++) {
        let utilsContract = getUtilsContract()
        let assetDetails = await utilsContract.methods.getTokenDetailsWithBalance(assetArray[i], address).call()
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
    let tokenArray = await contract.methods.allTokens().call()
    console.log({ tokenArray })
    return tokenArray
}
export const getListedPools= async () => {
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
    console.log({ poolArray })
    return poolArray
}

export const getPoolsData = async (tokenArray) => {
    var contract = getUtilsContract()
    let poolsData = []
    for (let i = 0; i < tokenArray.length; i++) {
        var symbol; var name;
        let tokenDetails = await contract.methods.getTokenDetails(tokenArray[i]).call()
        symbol = tokenDetails.symbol
        name = tokenDetails.name
        let poolDataRaw = await contract.methods.getPoolData(tokenArray[i]).call()
        let apy = await contract.methods.getPoolAPY(tokenArray[i]).call()

        let poolData = {
            'symbol': symbol,
            'name': name,
            'address': tokenArray[i],
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
        poolsData.push(poolData)
    }
    console.log({ poolsData })
    return poolsData
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
    var accountBalance = await getBNBBalance(address)
    var tokens = []
    var walletData = {
        'address': address,
        'tokens': tokens
    }
    tokens.push({
        'symbol': 'BNB',
        'name': 'Binance Chain Token',
        'balance': accountBalance,
        'address': '0x0000000000000000000000000000000000000000'
    })
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
            'balance': obj.balance,
            'address': obj.tokenAddress
        })
    }
    console.log({ walletData })
    return walletData
}

export const getNewTokenData = async (address, walletData) => {
    var contractToken = getTokenContract(address)
    var tokenSymbol = await contractToken.methods.symbol().call()
    var tokenName = await contractToken.methods.name().call()
    var tokenBalance = await contractToken.methods.balanceOf(walletData.address).call()

    var tokenData = {
        'symbol': tokenSymbol,
        'name': tokenName,
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

export const getStakesData = async (address, poolArray) => {
    var contractPool = getPoolsContract()
    let stakesData = []
    for (let i = 0; i < poolArray.length; i++) {
        var name; var symbol;
        if (poolArray[i] === ETH) {
            symbol = 'ETH'
            name = 'Ethereum'
        } else {
            var contractToken = getTokenContract(poolArray[i])
            symbol = await contractToken.methods.symbol().call()
            name = await contractToken.methods.name().call()
        }

        let poolDataRaw = await contractPool.methods.poolData(poolArray[i]).call()
        let stakeDataRaw = await contractPool.methods.getMemberStakeData(address, poolArray[i]).call()
        let spartan = await contractPool.methods.getStakerShareSparta(address, poolArray[i]).call()
        let token = await contractPool.methods.getStakerShareAsset(address, poolArray[i]).call()

        let ROI = await contractPool.methods.getMemberROI(address, poolArray[i]).call()

        let stake = {
            'symbol': symbol,
            'name': name,
            'address': poolArray[i],
            'spartan': spartan,
            'token': token,
            'spartanStaked': +stakeDataRaw.tokenAmt,
            'tokenStaked': +stakeDataRaw.tokenAmt,
            'roi': +ROI,
            'units': +stakeDataRaw.stakeUnits,
            'share': +stakeDataRaw.stakeUnits / +poolDataRaw.poolUnits
        }
        stakesData.push(stake)
    }
    console.log({ stakesData })
    return stakesData
}

export const getStakeData = async (address, stakesData) => {
    const stakeData = stakesData.find((item) => item.address === address)
    return (stakeData)
}
