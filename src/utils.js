
import BigNumber from 'bignumber.js'

export function getBN(number){
    return (new BigNumber(number)).toFixed()
}

export function bn(number){
    return new BigNumber(number)
}

export function bn2Str(bn){
    return (bn).toString()
}

export function formatBN(BN, n=2){
    return BN.toFixed(n)
}

export const one = 10**18

export function convertFromWei(number) {
    var num = new BigNumber(number)
    var final = num.div(10**18)
    return final.toFixed(2)
}

export function convertToWei(number) {
    var num = new BigNumber(number)
    var final = num.multipliedBy(10**18)
    return final
}

export const getAddressShort = (address) => {
    const addr = address ? address : '0x000000000000000'
    const addrShort = addr.substring(0,5) + '...' + addr?.substring(addr.length-3, addr.length)
    return addrShort
}

export const formatAPY = (input) =>{
    const annual = (input - (10000*365))/100
    return `${annual}%`
}

export const formatUSD = (input, price) => {
    const value = input ? (bn(input).times( price )).toNumber() : 0
    return `$${(value.toLocaleString())}`
}

export const rainbowStop = (h) => {
    const f = (n, k = (n + h * 12) % 12) => 0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return rgb2hex(Math.floor(f(0) * 255), Math.floor(f(8) * 255), Math.floor(f(4) * 255))
  }
  
  export const rgb2hex = (r, g, b) =>
    `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`
  
  export const getIntFromName = (str) => {
    const inputStr = String(str).toUpperCase()
    const div = 22
    const firstInt = (inputStr.charCodeAt(0) - 'A'.charCodeAt(0)) / div
    const secondInt = inputStr.length > 1 ? (inputStr.charCodeAt(1) - 'A'.charCodeAt(0)) / div : 0
    return [Number(firstInt.toFixed(2)), Number(secondInt.toFixed(2))]
  }