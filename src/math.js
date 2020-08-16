import { one, bn, convertFromWei } from './utils'

export const getSwapOutput = (inputAmount, pool, toSparta) => {
  // formula: (x * X * Y) / (x + X) ^ 2
  const x = bn(inputAmount)
  const X = toSparta ? bn(pool.asset) : bn(pool.spartan) // input is token if toSparta
  const Y = toSparta ? bn(pool.spartan) : bn(pool.asset) // output is spartan if toSparta
  const numerator = x.times(X).times(Y)
  const denominator = x.plus(X).pow(2)
  const result = numerator.div(denominator)
  return result
}

export const getSwapInput = (toSparta, pool, outputAmount) => {
  // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
  // (part1 - sqrt(part1 - part2))/2
  const X = toSparta ? bn(pool.asset) : bn(pool.spartan) // input is token if toSparta
  const Y = toSparta ? bn(pool.spartan) : bn(pool.asset) // output is spartan if toSparta
  const y = bn(outputAmount)
  const part1 = X.times(Y).div(y).minus(X.times(2))
  const part2 = X.pow(2).times(4)
  const result = part1.minus(part1.pow(2).minus(part2).sqrt()).div(2)
  return result
}

export const getSwapSlip = (inputAmount, pool, toSparta) => {
  // formula: (x) / (x + X)
  const x = bn(inputAmount)
  const X = toSparta ? bn(pool.asset) : bn(pool.spartan) // input is token if toSparta
  const result = x.div(x.plus(X))
  return result
}

export const getSwapFee = (inputAmount, pool, toSparta) => {
  // formula: (x * x * Y) / (x + X) ^ 2
  const x = bn(inputAmount)
  const X = toSparta ? bn(bn(pool.asset)) : bn(pool.spartan) // input is token if toSparta
  const Y = toSparta ? bn(pool.spartan) : bn(bn(pool.asset)) // output is spartan if toSparta
  const numerator = x.times(x).multipliedBy(Y)
  const denominator = x.plus(X).pow(2)
  const result = numerator.div(denominator)
  return result
}

export const getDoubleSwapOutput = (inputAmount, pool1, pool2) => {
  // formula: getSwapOutput(pool1) => getSwapOutput(pool2)
  const v = getSwapOutput(inputAmount, pool1, true)
  const output = getSwapOutput(v, pool2, false)
  return output
}

export const getDoubleSwapInput = (pool1, pool2, outputAmount) => {
  // formula: getSwapInput(pool2) => getSwapInput(pool1)
  const y = getSwapInput(false, pool2, outputAmount)
  const x = getSwapInput(true, pool1, y)
  return x
}

export const getDoubleSwapSlip = (inputAmount, pool1, pool2) => {
  // formula: getSwapSlip1(input1) + getSwapSlip2(getSwapOutput1 => input2)
  const swapSlip1 = getSwapSlip(inputAmount, pool1, true)
  const v = getSwapOutput(inputAmount, pool1, true)
  const swapSlip2 = getSwapSlip(v, pool2, false)
  const result = swapSlip1.plus(swapSlip2)
  return result
}

export const getDoubleSwapFee = (inputAmount, pool1, pool2) => {
  // formula: getSwapFee1 + getSwapFee2
  const fee1 = getSwapFee(inputAmount, pool1, true)
  const v = getSwapOutput(inputAmount, pool1, true)
  const fee2 = getSwapFee(v, pool2, false)
  const fee1Token = getValueOfSpartaInToken(fee1, pool2)
  const result = fee2.plus(fee1Token)
  return result
}

export const getValueOfTokenInSparta = (input, pool) => {
  // formula: ((a * V) / A) => V per A (Spartaper$)
  const a = bn(input)
  const V = bn(pool.spartan)
  const A = bn(bn(pool.asset))
  const result = a.times(V).div(A)
  // console.log(formatBN(a), formatBN(A), formatBN(V))
  return result
}

export const getValueOfSpartaInToken = (input, pool) => {
  // formula: ((v * A) / V) => A per V ($perSparta)
  const v = bn(input)
  const V = bn(pool.spartan)
  const A = bn(bn(pool.asset))
  const result = v.times(A).div(V)
  // console.log(formatBN(v), formatBN(A), formatBN(V))
  return result
}

export const getValueOfToken1InToken2 = (input, pool1, pool2) => {
  // formula: (A2 / V) * (V / A1) => A2/A1 => A2 per A1 ($ per Token)
  const VperT1 = getValueOfTokenInSparta(input, pool1)
  const T2perV = getValueOfSpartaInToken(one, pool2)
  const result = T2perV.times(VperT1).div(one)
  return result
}

export const getStakeUnits = (stake, pool) => {
  // formula: ((V + T) (v T + V t))/(4 V T)
  // part1 * (part2 + part3) / denominator
  const v = bn(stake.spartan)
  const t = bn(stake.token)
  const V = bn(pool.spartan).plus(v) // Must add r first
  const T = bn(pool.asset).plus(t) // Must add t first
  const part1 = V.plus(T)
  const part2 = v.times(T)
  const part3 = V.times(t)
  const numerator = part1.times(part2.plus(part3))
  const denominator = V.times(T).times(4)
  const result = numerator.div(denominator)
  return result
}

export const getPoolShare = (unitData, pool) => {
  // formula: (spartan * part) / total; (token * part) / total
  const units = bn(unitData.stakeUnits)
  const total = bn(unitData.totalUnits)
  const V = bn(pool.spartan)
  const T = bn(pool.asset)
  const token = T.times(units).div(total)
  const spartan = V.times(units).div(total)
  const stakeData = {
    token: token,
    spartan: spartan,
  }
  // console.log((stakeData.token).toFixed(0), (stakeData.spartan).toFixed(0))
  return stakeData
}

export const calcCLPSwap = (x, X, Y) =>{
// y = (x * Y * X)/(x + X)^2
const numerator = x.times(Y.times(X));
const denominator = (x.plus(X)).times(x.plus(X));
const y = numerator.div(denominator);
return y
}

export const calcEtherPPinMAI = (collateral, pool) => {
  const amount = bn(collateral)
  const etherBal = bn(pool.asset) 
  const balMAI = bn(pool.spartan)  
  console.log('EthPrice' + balMAI/etherBal)
  const outputMAI = calcCLPSwap(amount, etherBal, balMAI);
  console.log(convertFromWei(outputMAI))
  return outputMAI
}
 
export const getMAXMINT = (collateral, mainPool, CLT) =>{
const purchasingPower = calcEtherPPinMAI(collateral, mainPool);//how valuable Ether is in MAI
const maxMintAmount = (purchasingPower.times(100)).div(CLT);
return maxMintAmount
}


 