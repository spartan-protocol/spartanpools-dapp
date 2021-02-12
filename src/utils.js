
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

export const one = 10**18;

export function convertFromWei(number) {
    var num = new BigNumber(number)
    var final = num.div(10**18)
    return final
}

export function convertToWei(number) {
    var num = new BigNumber(number)
    var final = num.multipliedBy(10**18)
    return final
}

export function convertGweiToWei(number) {
    var num = new BigNumber(number)
    var final = num.multipliedBy(10**9)
    return final
}

export function convertFromGwei(number) {
    var num = new BigNumber(number)
    var final = num.div(10**9)
    return final
}

export const getAddressShort = (address) => {
    const addr = address ? address : '0x000000000000000'
    const addrShort = addr.substring(0,5) + '...' + addr?.substring(addr.length-3, addr.length)
    return addrShort
}

export const formatAPY = (input) => {
    const annual = (((+input-10000)/10000)*100).toFixed(2)
    return `${annual}%`
}

export const hoursSince = (date) => {
    var seconds = Math.floor(((new Date().getTime()/1000) - date))
    var interval = seconds / 3600
    return interval
}

export const daysSince = (date) => {
    var seconds = Math.floor(((new Date().getTime()/1000) - date))
    var intervalType
    var interval = Math.floor(seconds / 31536000)
    interval = Math.floor(seconds / 86400)
        if (interval >= 1) {
            intervalType = 'day'
        } else {
            interval = Math.floor(seconds / 3600)
            if (interval >= 1) {
                intervalType = "hour"
            } else {
                interval = Math.floor(seconds / 60)
                if (interval >= 1) {
                    intervalType = "minute"
                } else {
                    interval = seconds
                    intervalType = "second"
                }
            }
        }
    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }
    return interval + ' ' + intervalType;
}

export const formatUnitsLong = (input) => {
    var units = (bn(input).toString())
    if (input < 1000) {units = (bn(input).toFixed(6).toString())}
    else {units = (bn(input).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
    return `${units}`
}

export const formatAllUnits = (input) => {
    var units = (bn(input).toString())
    if (input <= 0) {units = (bn(input).toFixed(2).toString())}
    else if (input < 0.0001) {units = (bn(input).toFixed(6).toString())}
    else if (input < 0.001) {units = (bn(input).toFixed(5).toString())}
    else if (input < 0.01) {units = (bn(input).toFixed(4).toString())}
    else if (input < 0.1) {units = (bn(input).toFixed(3).toString())}
    else if (input < 1000) {units = (bn(input).toFixed(2).toString())}
    else if (input < 1000000) {units = (bn(input).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
    else if (input >= 1000000) {units = ((bn(input).toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  // ADD: Divide by 1m and add 'M' string
    return `${units}`
}

export const formatGranularUnits = (input) => {
    var units = (bn(input).toString())
    if (input <= 0) {units = (bn(input).toFixed(2).toString())}
    else if (input < 0.0001) {units = (bn(input).toFixed(7).toString())}
    else if (input < 0.001) {units = (bn(input).toFixed(6).toString())}
    else if (input < 0.01) {units = (bn(input).toFixed(5).toString())}
    else if (input < 0.1) {units = (bn(input).toFixed(4).toString())}
    else if (input < 1000) {units = (bn(input).toFixed(3).toString())}
    else if (input < 1000000) {units = (bn(input).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
    else if (input >= 1000000) {units = ((bn(input).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  // ADD: Divide by 1m and add 'M' string
    return `${units}`
}

export const formatAllUSD = (input, price) => {
    var valueNew = (bn(input).times( price )).toNumber()
    const value = input ? (bn(input).times( price )).toNumber() : 0
    if (value <= 0) {valueNew = (bn(value).toFixed(2).toString())}
    else if (input < 0.0001) {valueNew = (bn(value).toFixed(6).toString())}
    else if (input < 0.001) {valueNew = (bn(value).toFixed(5).toString())}
    else if (input < 0.01) {valueNew = (bn(value).toFixed(4).toString())}
    else if (input < 0.1) {valueNew = (bn(value).toFixed(3).toString())}
    else if (input < 1000) {valueNew = (bn(value).toFixed(2).toString())}
    else if (input < 1000000) {valueNew = (bn(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
    else if (input >= 1000000) {valueNew = (bn(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} // ADD: Divide by 1m and add 'M' string
    return `$${valueNew}`
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
