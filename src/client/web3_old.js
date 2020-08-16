import { NetworkData, PoolData, CDPData, WalletData, StakeData } from './mockData'

export const SPARTA_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getNetworkData = async() => {
    return NetworkData()
}

export const getPoolsData = async() => {
    return PoolData()
}

export const getPoolData = async(address) =>{
    const pool = PoolData().find((item) => item.address === address)
    return (pool)
}

export const filterWalletByPools = async() => {
    const Pools = PoolData()
    const Wallet = WalletData().tokens
    const pools = Pools.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => pools.includes(item) || item === SPARTA_ADDRESS)
    return tokens
}

export const filterWalletNotPools = async() => {
    const Pools = PoolData()
    const Wallet = WalletData().tokens
    const pools = Pools.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => !pools.includes(item) && item !== SPARTA_ADDRESS)
    return tokens
}

export const filterTokensByPoolSelection = async(address) =>{
    const tokens = await filterWalletByPools()
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}

export const filterTokensNotPoolSelection = async(address) =>{
    const tokens = await filterWalletNotPools()
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}

export const getAllCDPs = async() => {
    return CDPData()
}
export const getAccountCDP = async(address) =>{
    const CDPs = CDPData()
    const cdp = CDPs.find((item) => item.address === address)
    return (cdp)
}
export const getUnSafeCDPs = async() =>{
    const CDPs = CDPData()
    const unSafeCDP = CDPs.filter((item) => item.canLiquidate === "true")
    return (unSafeCDP)
}
export const getSafeCDPs = async() =>{
    const CDPs = CDPData()
    const SafeCDP = CDPs.filter((item) => item.canLiquidate === "false")
    return (SafeCDP)
}

export const getWalletData = async() => {
    return WalletData()
}

export const getWalletTokenData = async(address) => {
    const Wallet = WalletData().tokens
    const tokenData = Wallet.find((item) => item.address === address)
    return (tokenData)
}

export const getTokenSymbol = (address) => {
    const Wallet = WalletData().tokens
    const token = Wallet.find((item) => item.address === address)
    return (token.symbol) 
}

export const getUnitsForStakerPool = async(staker, poolAddress) => {
    const Stakes = StakeData()
    const pool = Stakes.find((item) => item.address === poolAddress)
    return pool.units
}

export const getUnitsForPool = async(poolAddress) => {
    const Pools = PoolData()
    const pool = Pools.find((item) => item.address === poolAddress)
    return pool.units
}

export const getStakeData = async() => {
    return StakeData()
}