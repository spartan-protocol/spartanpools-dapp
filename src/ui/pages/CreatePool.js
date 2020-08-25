import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { withRouter } from 'react-router-dom'
import { Row, Col, Input } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';

import { BreadcrumbCombo, InputPane, CoinRow } from '../components/common'
import { Center, Button } from '../components/elements'
import { paneStyles, rowStyles, colStyles } from '../components/styles'


// import { getStakeUnits } from '../../math'
import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getTokenContract, getRouterContract,
    getTokenData, getNewTokenData, getAssets, getListedTokens, getListedPools, getPoolsData, 
    getStakesData, getTokenDetails, getWalletData
} from '../../client/web3'

import { convertToWei } from '../../utils'
var utils = require('ethers').utils;

const CreatePool = (props) => {

    const context = useContext(Context)

    const [addressSelected, setAddressSelected] = useState(SPARTA_ADDR)

    // const [tokenList, setTokenList] = useState([SPARTA_ADDR])
    // const [tokenShortList, setTokenShortList] = useState([SPARTA_ADDR])
    const [checkFlag, setCheckFlag] = useState(false)
    const [tokenData, setTokenData] = useState(null)
    // const [mainPool, setMainPool] = useState({
    //     'symbol': 'XXX',
    //     'name': 'XXX',
    //     'address': BNB_ADDR,
    //     'price': 0,
    //     'volume': 0,
    //     'spartan': 0,
    //     'token': 0,
    //     'depth': 0,
    //     'txCount': 0,
    //     'apy': 0,
    //     'units': 0,
    //     'fees': 0
    // })

    const [stake1Data, setStake1Data] = useState({
        address: SPARTA_ADDR,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    const [stake2Data, setStake2Data] = useState({
        address: BNB_ADDR,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    // const [stakeUnits, setStakeUnits] = useState(0)

    const [approval1, setApproval1] = useState(false)
    const [approval2, setApproval2] = useState(false)
    // const [stakeTx, setStakeTx] = useState(null)

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {
        // const tokenList = await filterWalletNotPools(context.poolsData, context.walletData)
        // setTokenList(tokenList)
        // console.log(tokenList)
        // setTokenShortList(await filterTokensNotPoolSelection())
        // setTokenData(await getTokenData(tokenList[0], context.walletData))
        // setMainPool(await getTokenData(tokenList[0], context.walletData))

        const inputTokenData = await getTokenData(SPARTA_ADDR, context.walletData)
        setStake1Data(await getStakeInputData(inputTokenData.balance, inputTokenData))
        // const outputTokenData = await getTokenData(BNB_ADDR, context.walletData)
        // setStake2Data(await getStakeInputData(outputTokenData.balance, tokenList[0]))

    }

    const onInputChange = async (e) => {
        setAddressSelected(e.target.value)
    }

    const checkToken = async () => {
        if(addressSelected !== SPARTA_ADDR){
            setApproval1(false)
            setApproval2(false)
    
            var tokenData = await getNewTokenData(addressSelected, context.walletData.address)
            setTokenData(tokenData)
    
            if (+tokenData.balance > 0) {
                setCheckFlag(true)
                setStake2Data(await getStakeInputData(tokenData.balance, tokenData))
            }
    
            checkApproval1(SPARTA_ADDR)
            checkApproval2(addressSelected)
        }
        

    }

    // const changeToken = () => {

    // }

    const onStake1Change = async (e) => {
        const input = e.target.value
        setStake1Data(await getStakeInputData(convertToWei(input), stake1Data))
        // const stake = {
        //     spartan: convertToWei(input),
        //     token: stake2Data.input
        // }
        // setStakeUnits(getStakeUnits(stake, stake))
    }

    // const changeStake1Token = async (token) => {
    //     const inputTokenData = await getTokenData(token, context.walletData)
    //     setStake1Data(await getStakeInputData(inputTokenData.balance, inputTokenData))
    //     const stake = {
    //         spartan: inputTokenData.balance,
    //         token: stake2Data.input
    //     }
    //     setStakeUnits(getStakeUnits(stake, stake))
    // }

    const changeStake1Amount = async (amount) => {
        const finalAmt = (amount * stake1Data?.balance) / 100
        setStake1Data(await getStakeInputData(finalAmt, stake1Data))
        // const stake = {
        //     spartan: finalAmt,
        //     token: stake2Data.input
        // }
        // setStakeUnits(getStakeUnits(stake, stake))
    }

    // const changeStake2Token = async (token) => {
    //     console.log("changing sell tokens not enabled yet")
    // }

    const onStake2Change = async (e) => {
        const input = e.target.value
        setStake2Data(await getStakeInputData(convertToWei(input), stake2Data))
        // const stake = {
        //     spartan: stake1Data.input,
        //     token: convertToWei(input)
        // }
        // console.log(stake)
        // setStakeUnits(getStakeUnits(stake, stake))
        // console.log(formatBN(getStakeUnits(stake, stake)))
    }

    const changeStake2Amount = async (amount) => {
        const finalAmt = (amount * stake2Data?.balance) / 100
        setStake2Data(await getStakeInputData(finalAmt, stake2Data))
        // const stake = {
        //     spartan: stake1Data.input,
        //     token: finalAmt
        // }
        // console.log(stake)
        // setStakeUnits(getStakeUnits(stake, stake))
        // console.log(formatBN(getStakeUnits(stake, stake)))
    }

    const getStakeInputData = async (input, inputTokenData) => {
        const stakeData = {
            address: inputTokenData.address,
            symbol: inputTokenData.symbol,
            balance: inputTokenData.balance,
            input: input,
        }
        return stakeData
    }

    // const getShare = () => {
    //     const share = (bn(stakeUnits).div(bn(mainPool.units))).toFixed(2)
    //     return (share*100).toFixed(2)
    // }

    // const getValueOfShare = () => {
    //     return '$1234.54'
    // }


    const checkApproval1 = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
        const tokenData = await getTokenData(address, context.walletData)
        if (+approval >= tokenData.balance) {
            setApproval1(true)
        }
    }
    const checkApproval2 = async (address) => {
        if (address === BNB_ADDR) {
            setApproval2(true)
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
            var tokenData = await getNewTokenData(address, context.walletData.address)
            if (+approval >= +tokenData.balance) {
                setApproval2(true)
            }
            console.log(address, +approval, +tokenData.balance)
        }
       
    }

    const unlockSparta = async () => {
        unlockToken(stake1Data.address)
    }

    const unlockAsset = async () => {
        unlockToken(stake2Data.address)
    }

    const unlockToken = async (address) => {
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        checkApproval1(SPARTA_ADDR)
        checkApproval2(address)
    }

    const createPool = async () => {
        const poolContract = getRouterContract()
        
        // let inputBase = utils.formatEther(stake1Data.input)
        // let inputToken = utils.formatEther(stake2Data.input)
        // console.log(inputBase, inputToken, addressSelected)

        await poolContract.methods.createPool(stake1Data.input, stake2Data.input, addressSelected).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        // setStakeTx(tx.transactionHash)
        await reloadData()
        props.history.push('/pools')
    }

    const reloadData = async () => {
        let assetArray = await getAssets()
        let tokenArray = await getListedTokens()
        var sortedTokens = [...new Set(assetArray.concat(tokenArray))].sort()
        let poolArray = await getListedPools()
        let poolsData = await getPoolsData(tokenArray)
        // let stakesData = await getStakesData(context.walletData.address, poolArray)
        let tokenDetailsArray = await getTokenDetails(context.walletData.address, sortedTokens)
        let walletData = await getWalletData(context.walletData.address, tokenDetailsArray)
        context.setContext({ 'tokenArray': tokenArray })
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': poolsData })
        // context.setContext({ 'stakesData': stakesData })
        context.setContext({ 'tokenDetailsArray': tokenDetailsArray })
        context.setContext({ 'walletData': walletData })
    }

    return (
        <div>
            <BreadcrumbCombo title={'CREATE POOL'} parent={'POOLS'} link={'/pools'} child={'CREATE'}></BreadcrumbCombo>
            <br />
            <Row style={rowStyles}>
                <Col xs={12}>
                    <Input
                        placeholder={'enter token address'}
                        onChange={onInputChange}></Input>

                    {/* <Input onChange={props.onInputChange}
                        value={tokenList[0]}
                        allowClear={true}
                        // addonAfter={<TokenDropDown default={tokenList[0]}
                        //     changeToken={changeToken}
                        //     tokenList={tokenList} />}
                    ></Input> */}
                </Col>
                <Col xs={4}>
                    <Button icon={<QuestionCircleOutlined />}
                        onClick={checkToken}
                        type="outline">CHECK</Button>
                </Col>
                {checkFlag &&
                    <Col xs={8}>
                        <CoinRow
                            symbol={tokenData.symbol}
                            name={tokenData.name}
                            balance={tokenData.balance}
                            size={40} />
                    </Col>
                }
            </Row>
            {checkFlag &&
                <div>
                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row >
                                <Col xs={12}>
                                    <InputPane
                                        // mainPool={mainPool}
                                        // tokenList={tokenShortList}
                                        paneData={stake1Data}
                                        onInputChange={onStake1Change}
                                        // changeToken={changeStake1Token}
                                        changeAmount={changeStake1Amount}
                                    />
                                </Col>
                                <Col xs={12}>
                                    <InputPane
                                        // tokenList={[tokenData.address]}
                                        paneData={stake2Data}
                                        onInputChange={onStake2Change}
                                        // changeToken={changeStake2Token}
                                        changeAmount={changeStake2Amount} />
                                </Col>

                            </Row>
                            <Row style={rowStyles}>
                                {/* <Col xs={12}>
                                    <Center><LabelGroup size={18} title={`${convertFromWei(stakeUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                </Col>
                                <Col xs={12}>
                                    <Center><LabelGroup size={18} title={`100%`} label={'SHARE'} /></Center>
                                </Col> */}
                                {/* <Col xs={8}>
                                <Center><LabelGroup size={18} title={`${getValueOfShare()}`} label={'STAKED VALUE'} /></Center>
                                </Col> */}
                            </Row>
                            <br></br>
                            <Col xs={8}>
                                {!approval1 &&
                                    <Center><Button type={'secondary'} onClick={unlockSparta}>UNLOCK {stake1Data.symbol}</Button></Center>
                                }
                            </Col>
                            <Col xs={8}>
                                {(approval1 && approval2) &&
                                    <Center><Button type={'primary'} onClick={createPool}> CREATE POOL</Button></Center>
                                }
                            </Col>
                            <Col xs={8}>
                                {!approval2 &&
                                    <Center><Button type={'secondary'} onClick={unlockAsset}>UNLOCK {stake2Data.symbol}</Button></Center>
                                }
                            </Col>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    )
}

export default withRouter(CreatePool)