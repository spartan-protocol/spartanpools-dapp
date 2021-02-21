import { one, bn } from './utils'

export const getSwapOutput = (inputAmount, pool, toBase) => {
  // formula: (x * X * Y) / (x + X) ^ 2
  const x = bn(inputAmount)
  const X = toBase ? bn(pool.tokenAmount) : bn(pool.baseAmount) // input is token if toBase
  const Y = toBase ? bn(pool.baseAmount) : bn(pool.tokenAmount) // output is baseAmount if toBase
  const numerator = x.times(X).times(Y)
  const denominator = x.plus(X).pow(2)
  const result = numerator.div(denominator)
  return result
}

export const getSwapInput = (toBase, pool, outputAmount) => {
  // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
  // (part1 - sqrt(part1 - part2))/2
  const X = toBase ? bn(pool.tokenAmount) : bn(pool.baseAmount) // input is token if toBase
  const Y = toBase ? bn(pool.baseAmount) : bn(pool.tokenAmount) // output is base if toBase
  const y = bn(outputAmount)
  const part1 = X.times(Y).div(y).minus(X.times(2))
  const part2 = X.pow(2).times(4)
  const result = part1.minus(part1.pow(2).minus(part2).sqrt()).div(2)
  return result
}

export const getSwapSlip = (inputAmount, pool, toBase) => {
  // formula: (x) / (x + X)
  const x = bn(inputAmount)
  const X = toBase ? bn(pool.tokenAmount) : bn(pool.baseAmount) // input is token if toBase
  const result = x.div(x.plus(X))
  return result
}

export const getActualSwapSlip = (pool, output, input, toBase) => {
  // formula: ( X / ( y / x )) - 1
  const X = bn(pool.price)
  const y = toBase ? bn(output) : bn(input) // input is token if toBase
  const x = toBase ? bn(input) : bn(output) // input is token if toBase
  const result = (X.div(y.div(x))).minus(1)
  const endResult = Math.abs(result)
  return endResult
}

export const getSwapFee = (inputAmount, pool, toBase) => {
  // formula: (x * x * Y) / (x + X) ^ 2
  const x = bn(inputAmount)
  const X = toBase ? bn(bn(pool.tokenAmount)) : bn(pool.baseAmount) // input is token if toBase
  const Y = toBase ? bn(pool.baseAmount) : bn(bn(pool.tokenAmount)) // output is base if toBase
  const numerator = x.times(x).multipliedBy(Y)
  const denominator = x.plus(X).pow(2)
  const result = numerator.div(denominator)
  return result
}

export const getEstRate = (output, input, toBase) => {
  // formula: ( y / x )
  const y = toBase ? bn(output) : bn(input) // input is token if toBase
  const x = toBase ? bn(input) : bn(output) // input is token if toBase
  const result = y.div(x)
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
  const V = bn(pool.baseAmount)
  const A = bn(bn(pool.tokenAmount))
  const result = a.times(V).div(A)
  // console.log(formatBN(a), formatBN(A), formatBN(V))
  return result
}

export const getValueOfSpartaInToken = (input, pool) => {
  // formula: ((v * A) / V) => A per V ($perSparta)
  const v = bn(input)
  const V = bn(pool.baseAmount)
  const A = bn(bn(pool.tokenAmount))
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

export const getSlipAdjustment = (b, B, t, T) => {
  // slipAdjustment = (1 - ABS((B t - b T)/((2 b + B) (t + T))))
  // 1 - ABS(part1 - part2)/(part3 * part4))
  const part1 = bn(B).times(t)
  const part2 = bn(b).times(T)
  const part3 = bn(b).times(2).plus(B)
  const part4 = bn(t).plus(T)
  let numerator = ''
  if(part1.comparedTo(part2) === 1){
      numerator = part1.minus(part2)
  } else {
      numerator = part2.minus(part1)
  }
  const denominator = part3.times(part4)
  return bn(1).minus((numerator).div(denominator))
}

export const getLiquidityUnits = (stake, pool) => {
  // units = ((P (t B + T b))/(2 T B)) * slipAdjustment
  // P * (part1 + part2) / (part3) * slipAdjustment
  const b = bn(stake.baseAmount) // b = _actualInputBase
  const B = bn(pool.baseAmount) // B = baseAmount
  const t = bn(stake.tokenAmount) // t = _actualInputToken
  const T = bn(pool.tokenAmount) // T = tokenAmount
  const P = bn(pool.units) // P = LP Token TotalSupply
  const slipAdjustment = getSlipAdjustment(b, B, t, T)
  const part1 = t.times(B)
  const part2 = T.times(b)
  const part3 = T.times(B).times(2)
  const result = (P.times(part1.plus(part2))).div(part3).times(slipAdjustment)
  return result
}

export const getPoolShare = (unitData, pool) => {
  // formula: (baseAmount * part) / total; (tokenAmount * part) / total
  const units = bn(unitData.liquidityUnits)
  const total = bn(unitData.totalUnits)
  const V = bn(pool.baseAmount)
  const T = bn(pool.tokenAmount)
  const tokenAmount = T.times(units).div(total)
  const baseAmount = V.times(units).div(total)
  const liquidityData = {
    tokenAmount: tokenAmount,
    baseAmount: baseAmount,
  }
  // console.log((liquidityData.tokenAmount).toFixed(0), (liquidityData.baseAmount).toFixed(0))
  return liquidityData
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
  const etherBal = bn(pool.tokenAmount) 
  const balMAI = bn(pool.baseAmount)  
  //console.log('EthPrice' + balMAI/etherBal)
  const outputMAI = calcCLPSwap(amount, etherBal, balMAI);
  //console.log(convertFromWei(outputMAI))
  return outputMAI
}
 
export const getMAXMINT = (collateral, mainPool, CLT) =>{
const purchasingPower = calcEtherPPinMAI(collateral, mainPool);//how valuable Ether is in MAI
const maxMintAmount = (purchasingPower.times(100)).div(CLT);
return maxMintAmount
}


 