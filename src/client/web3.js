import Web3 from 'web3'
import axios from 'axios'

import {bn} from '../utils'

import ERC20 from '../artifacts/ERC20.json'
import SPARTA from '../artifacts/Base.json'
import ROUTER from '../artifacts/Router.json'
import POOLS from '../artifacts/Pool.json'
import UTILS from '../artifacts/Utils.json'
import DAO from '../artifacts/Dao.json'
import Bondv2 from '../artifacts/BondV2.json'
import Bondv3 from '../artifacts/BondV3.json'

const net = '';

// CURRENT CONTRACT ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xb58a43D2D9809ff4393193de536F242fefb03613' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'
export const UTILS_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'
export const DAO_ADDR = net === 'testnet' ? '0x1b83a813045165c81d84b9f5d6916067b57FF9C0' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'
export const ROUTER_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'
export const BONDv3_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'
export const INCENTIVE_ADDR = net === 'testnet' ? '0xc241d694d51db9e934b147130cfefe8385813b86' : '0xdbe936901aeed4718608d0574cbaab01828ae016'

// OLD CONTRACT ADDRESSES
export const BONDv1_ADDR = net === 'testnet' ? '0x4551457647f6810a917AF70Ca47252BbECD2A36c' : '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
export const BONDv2_ADDR = net === 'testnet' ? '0x7e44b5461A50adB15329895b80866275192a54f6' : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'
export const BONDv3a_ADDR = '0x5059d9f4611020fcbdb8d7ba120579df32264142'
export const BONDv3b_ADDR = '0x0a5fecabbdb1908b5f58a26e528a21663c824137'
export const ROUTERv1_ADDR = net === 'testnet' ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'
export const ROUTERv2a_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0xDbe936901aeed4718608D0574cbAAb01828AE016'

// ABIs
export const SPARTA_ABI = SPARTA.abi
export const ROUTER_ABI = ROUTER.abi
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ABI = UTILS.abi
export const DAO_ABI = DAO.abi
export const BONDv2_ABI = Bondv2.abi
export const BONDv3_ABI = Bondv3.abi

export const explorerURL = net === 'testnet' ? 'https://testnet.bscscan.com/' : 'https://bscscan.com/'

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/")
}

export const getExplorerURL = () => {
    return explorerURL
}

export const isAddressValid = async (address) => {
    var web3 = getWeb3()
    return await web3.utils.isAddress(address)
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

export const getGasPrice = async () => {
    var web3_ = getWeb3()
    var gas = await web3_.eth.getGasPrice()
    return gas
}

export const getSpartaPrice = async () => {
    console.log('start get sparta price')
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd')
    //console.log(resp)
    return resp.data["spartan-protocol-token"].usd
}

export const getPriceByID = async (ID) => {
    let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + ID + '&vs_currencies=usd')
    //console.log(resp)
    return resp.data[ID].usd
}

export const getPastPriceByID = async (ID, date) => {
    // date in this format DD-MM-YYYY
    let resp = await axios.get('https://api.coingecko.com/api/v3/coins/' + ID + '/history?date=' + date)
    //console.log(resp)
    let data = ''
    //console.log(ID, date, resp.data)
    if (!resp.data['market_data']) {
        date = new Date(date)
        date.setDate(date.getDate() + 1)
        let [month, day, year] = new Date(date).toLocaleDateString("en-US").split("/")
        date = day + '-' + month + '-' + year
        data = await getPastPriceByID(ID, date)
    }
    else {data = resp.data['market_data'].current_price.usd}
    return data
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
export const getBondv2Contract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(BONDv2_ABI, BONDv2_ADDR)
}
export const getBondv3Contract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(BONDv3_ABI, BONDv3_ADDR)
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
        if(bn(assetDetails.balance).comparedTo(0) === 1) {
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

export const getListedPools = async () => {
    console.log('start getlistedpools')
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
    //console.log(poolArray)
    return poolArray
}

// Get BOND Proposals Count
export const getBondProposalCount = async () => {
    console.log('start getproposalcount')
    var contract = getBondv3Contract()
    let proposalCount = await contract.methods.proposalCount().call()
    //console.log(proposalCount)
    return proposalCount
}

// Get BOND Proposal Array
export const getBondProposals = async () => {
    console.log('start getproposals')
    let proposalCount = await getBondProposalCount()
    let proposalsData = []
    for (let i = 0; i < +proposalCount + 1; i++) {
        proposalsData.push(await getBondProposal(i))
    }
    //console.log(proposalsData)
    return proposalsData
}

// Get Each BOND Proposal
export const getBondProposal = async (pid) => {
    var contract = getBondv3Contract()
    contract = contract.methods
    let data = await Promise.all([
        contract.mapPID_type(pid).call(), contract.mapPID_votes(pid).call(), contract.mapPID_timeStart(pid).call(), 
        contract.mapPID_finalising(pid).call(), contract.mapPID_finalised(pid).call(), contract.mapPID_address(pid).call(),
        contract.hasMajority(pid).call(), contract.hasMinority(pid).call(), //contract.hasQuorum(pid).call() //(Quorum doesnt work???)
    ])
    let proposalData = {
        'id': pid,
        'type': data[0],
        'votes': data[1],
        'timeStart': data[2],
        'finalising': data[3],
        'finalised': data[4],
        'proposedAddress': data[5],
        'majority': data[6],
        'minority': data[7],
        //'quorum': data[8],  //(Quorum doesnt work???)
    }
    return proposalData
}

// Get Proposals Count
export const getProposalCount = async () => {
    console.log('start getproposalcount')
    var contract = getDaoContract()
    let proposalCount = await contract.methods.proposalCount().call()
    //console.log(proposalCount)
    return proposalCount
}

// Get Proposal Array
export const getProposals = async () => {
    console.log('start getproposals')
    let proposalCount = await getProposalCount()
    let proposalsData = []
    for (let i = 0; i < +proposalCount + 1; i++) {
        proposalsData.push(await getProposal(i))
    }
    //console.log(proposalsData)
    return proposalsData
}

// Get Each Proposal
export const getProposal = async (pid) => {
    var contract = getDaoContract()
    let data = await Promise.all([contract.methods.getProposalDetails(pid).call(), contract.methods.hasMajority(pid).call(), contract.methods.hasMinority(pid).call(), contract.methods.hasQuorum(pid).call()])
    let proposalDetails = data[0]
    let majority = data[1]
    let minority = data[2]
    let quorum = data[3]
    let proposalData = {
        'id': proposalDetails.id,
        'type': proposalDetails.proposalType,
        'votes': proposalDetails.votes,
        'timeStart': proposalDetails.timeStart,
        'finalising': proposalDetails.finalising,
        'finalised': proposalDetails.finalised,
        'param': proposalDetails.param,
        'proposedAddress': proposalDetails.proposedAddress,
        'list': proposalDetails.list,
        'grant': proposalDetails.grant,
        'majority': majority,
        'quorum': quorum,
        'minority': minority,
    }
    return proposalData
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
    let data = await Promise.all([contract.methods.getTokenDetails(token).call(), getBondv3Contract().methods.isListed(token).call(), contract.methods.getPoolData(token).call(), contract.methods.getPoolAPY(token).call()])
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
        'price': (bn(poolDataRaw.baseAmount).div(bn(poolDataRaw.tokenAmount).times(decDiff))).toFixed(18),
        'volume': bn(poolDataRaw.volume).toFixed(0),
        'baseAmount': bn(poolDataRaw.baseAmount).toFixed(0),
        'tokenAmount': (bn(poolDataRaw.tokenAmount).times(decDiff)).toFixed(0),
        'depth': bn(poolDataRaw.baseAmount).times(2).toFixed(0),
        'txCount': bn(poolDataRaw.txCount).toFixed(0),
        'apy': bn(apy).toFixed(0),
        'units': bn(poolDataRaw.poolUnits).toFixed(0),
        'fees': bn(poolDataRaw.fees).toFixed(0),
        'bondListed':bondListed
    }
    //console.log(poolData)
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
    var contract = getRouterContract()
    contract = contract.methods
    let data = await contract.totalPooled().call()
    //await contract.totalVolume().call()
    //await contract.totalFees().call()
    //console.log(data)
    return data
}

// Get Wallet Data (Inital load; just SPARTA & BNB)
export const getWalletData = async (address) => {
    console.log('start getWalletData')
    var walletData = []
    walletData.push({
        'symbol': 'SPARTA',
        'name': 'Sparta',
        'decimals': '18',
        'balance': await getTokenContract(SPARTA_ADDR).methods.balanceOf(address).call(),
        'address': SPARTA_ADDR
    })
    walletData.push({
        'symbol': 'BNB',
        'name': 'BNB',
        'decimals': '18',
        'balance': await getBNBBalance(address),
        'address': BNB_ADDR
    })
    walletData.push({
        'symbol': 'WBNB',
        'name': 'Wrapped BNB',
        'decimals': '18',
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
        balance = bn(balance).times(decDiff).toFixed(0)
        //if (balance > 0) {
            walletData.push({
                'symbol': details.symbol,
                'name': details.name,
                'decimals': details.decimals,
                'balance': balance,
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
                'decimals': '18',
                'balance': await getBNBBalance(account),
                'address': BNB_ADDR
            })
        }
        else {
            let data = await Promise.all([getTokenContract(tokenAddr).methods.balanceOf(account).call(), getUtilsContract().methods.getTokenDetails(tokenAddr).call()])
            var balance = data[0]
            var details = data[1]
            let decDiff = 10 ** (18 - details.decimals)
            balance = bn(balance).times(decDiff).toFixed(0)
            part2.push({
                'symbol': details.symbol,
                'name': details.name,
                'decimals': details.decimals,
                'balance': balance,
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
        'poolAddress': poolAddress,
        'baseAmount': memberData.baseAmount,
        'tokenAmount': memberData.tokenAmount,
        'locked': locked,
        'units': liquidityUnits,
        'share': bn(liquidityUnits).div(bn(tokenDetails.totalSupply)).toFixed(0)
    }
    //console.log(share)
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
export const getBondedv2MemberDetails = async (member, asset) => {
    let memberDetails = await getBondv2Contract().methods.getMemberDetails(member, asset).call()
    return memberDetails;
}

export const getBondedv3MemberDetails = async (member, asset) => {
    let memberDetails = await getBondv3Contract().methods.getMemberDetails(member, asset).call()
    return memberDetails;
}

export const getClaimableLPBondv2 = async (member, asset) => {
    let bondedLp = await getBondv2Contract().methods.calcClaimBondedLP(member, asset).call()
    return bondedLp;
}

export const getClaimableLPBondv3 = async (member, asset) => {
    let MemberDetails = await getBondedv3MemberDetails(member,asset);
    let bondedLp = 0;
    if(MemberDetails.isMember){
        bondedLp = await getBondv3Contract().methods.calcClaimBondedLP(member, asset).call()
        //console.log(bondedLp/1*10**18)
    }
    return bondedLp;
}

export const getBaseAllocation = async () => {
    let allocation = await getSpartaContract().methods.balanceOf(BONDv3_ADDR).call()
return allocation;
}