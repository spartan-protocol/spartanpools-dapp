import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Tabs, Row, Col, message } from 'antd';
import { LoadingOutlined, LeftOutlined, UnlockOutlined } from '@ant-design/icons';

import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { BreadcrumbCombo, InputPane, PoolPaneSide, OutputPane } from '../components/common'
import '../../App.css';
import { HR, LabelGroup, Center } from '../components/elements';
import { Button } from '../components/elements';
import { paneStyles, colStyles, rowStyles } from '../components/styles'
import { bn, formatBN, convertFromWei, convertToWei } from '../../utils'
import { getStakeUnits } from '../../math'

import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract, getListedTokens,
    getPoolData, getTokenData, getTokenDetails,
    getListedPools, getPoolsData, getPool
} from '../../client/web3'

const { TabPane } = Tabs;

const NewStake = (props) => {

    const context = useContext(Context)
    const [pool, setPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB_ADDR,
        'price': 0,
        'volume': 0,
        'baseAmt': 0,
        'tokenAmt': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    })

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

    const [estStakeUnits, setStakeUnits] = useState(0)
    const [approval, setApproval] = useState(false)
    const [approvalS, setApprovalS] = useState(false)
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    const [unstakeAmount, setUnstakeAmount] = useState(0)

    useEffect(() => {
        if (context.connected) {
            getPools()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getPools = async () => {
        let tokenArray = await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })
        let poolArray = await getListedPools()
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': await getPoolsData(tokenArray) })
    }

    useEffect(() => {
        if (context.poolsData) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected, context.poolsData])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        const pool = await getPoolData(params.pool, context.poolsData)
        setPool(pool)

        const inputTokenData = await getTokenData(SPARTA_ADDR, context.walletData)
        const outputTokenData = await getTokenData(pool.address, context.walletData)

        setStake1Data(await getStakeInputData(inputTokenData.balance, inputTokenData))
        setStake2Data(await getStakeInputData(outputTokenData.balance, outputTokenData))

        const stake = {
            baseAmt: inputTokenData.balance,
            tokenAmt: outputTokenData.balance
        }
        const estStakeUnits = getStakeUnits(stake, pool)
        setStakeUnits(estStakeUnits)
        checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false)
        checkApproval(pool.address) ? setApproval(true) : setApproval(false)

    }

    const getStakeInputData = async (input, inputTokenData) => {
        const stakeData = {
            address: inputTokenData.address,
            symbol: inputTokenData.symbol,
            balance: inputTokenData.balance,
            input: formatBN(bn(input), 0),
        }
        return stakeData
    }

    const checkApproval = async (address) => {
        if (address === BNB_ADDR) {
            return true
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
            if (+approval > 0) {
                return true
            } else {
                return false
            }
        }
    }

    const onStake1Change = async (e) => {
        const input = e.target.value
        setStake1Data(await getStakeInputData(convertToWei(input), stake1Data))
        const stake = {
            baseAmt: convertToWei(input),
            tokenAmt: stake2Data.input
        }
        setStakeUnits(getStakeUnits(stake, pool))
    }

    const changeStake1Amount = async (amount) => {
        const finalAmt = (amount * stake1Data?.balance) / 100
        setStake1Data(await getStakeInputData(finalAmt, stake1Data))
        const stake = {
            baseAmt: finalAmt,
            tokenAmt: stake2Data.input
        }
        setStakeUnits(getStakeUnits(stake, pool))
    }

    const onStake2Change = async (e) => {
        const input = e.target.value
        setStake2Data(await getStakeInputData(convertToWei(input), stake2Data))
        const stake = {
            baseAmt: stake1Data.input,
            tokenAmt: convertToWei(input)
        }
        setStakeUnits(getStakeUnits(stake, pool))
    }

    const changeStake2Amount = async (amount) => {
        const finalAmt = (amount * stake2Data?.balance) / 100
        setStake2Data(await getStakeInputData(finalAmt, stake2Data))
        const stake = {
            baseAmt: stake1Data.input,
            tokenAmt: finalAmt
        }
        setStakeUnits(getStakeUnits(stake, pool))
    }

    const changeUnstakeAmount = async (amount) => {
        setUnstakeAmount(amount)
    }

    const getEstShare = () => {
        const newUnits = (bn(estStakeUnits)).plus(bn(pool.units))
        const share = ((bn(estStakeUnits)).div(newUnits)).toFixed(2)
        return (share * 100).toFixed(2)
    }

    const unlockSparta = async () => {
        unlock(stake1Data.address)
    }

    const unlockToken = async () => {
        unlock(stake1Data.address)
    }

    const unlock = async (address) => {
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Approved!`, 2);
    }

    const stake = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        console.log(stake1Data.input, stake2Data.input, pool.address)
        await contract.methods.stake(stake1Data.input, stake2Data.input, pool.address).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
            value: pool.address === BNB_ADDR ? stake2Data.input : 0
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }

    const unstake = async () => {
        let contract = getRouterContract()
        const tx = await contract.methods.unstake(unstakeAmount*100, pool.address).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        console.log(tx.transactionHash)
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    
    }

    const updatePool = async () => {
        setPool(await getPool(pool.address))
    }

    const back = () => {
        props.history.push('/pools')
    }

    const changeTabs = () => {
        setStartTx(false)
        setEndTx(false)
    }



    return (
        <>
            <BreadcrumbCombo title={'SWAP'} parent={'POOLS'} link={'/pools'} child={'SWAP'}></BreadcrumbCombo>
            <HR></HR>
            <br />
            <Button onClick={back} icon={<LeftOutlined />} type={'text'} size={'large'} >BACK</Button>

            <Row>
                <Col xs={8}>

                    <PoolPaneSide pool={pool} price={context.spartanPrice}  />

                </Col>
                <Col xs={16}>
                    <Row style={{ marginLeft: 20, marginRight: 20 }}>
                        <Col xs={24} >
                            <Tabs defaultActiveKey="1" onChange={changeTabs}>
                                <TabPane tab={`STAKE ${pool.symbol}`} key="1">
                                    <StakePane
                                        pool={pool}
                                        stake1Data={stake1Data}
                                        onStake1Change={onStake1Change}
                                        changeStake1Amount={changeStake1Amount}
                                        stake2Data={stake2Data}
                                        onStake2Change={onStake2Change}
                                        changeStake2Amount={changeStake2Amount}
                                        estStakeUnits={estStakeUnits}
                                        getEstShare={getEstShare}
                                        approval1={approvalS}
                                        approval2={approval}
                                        unlockSparta={unlockSparta}
                                        unlockToken={unlockToken}
                                        stake={stake}
                                        startTx={startTx}
                                        endTx={endTx}
                                    />
                                </TabPane>
                                <TabPane tab={`UNSTAKE ${pool.symbol}`} key="2">

                                    <UnstakePane
                                        pool={pool}
                                        changeUnstakeAmount={changeUnstakeAmount}
                                        approval={approval}
                                        unlock={unlockToken}
                                        unstake={unstake}
                                        startTx={startTx}
                                        endTx={endTx}
                                    />

                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    )
}

export default withRouter(NewStake)

const StakePane = (props) => {

    return (
        <>
            <Row style={paneStyles}>
                <Col xs={24} style={colStyles}>
                    <Row >
                        <Col xs={2}>
                        </Col>
                        <Col xs={9} style={{ marginRight: 30 }}>
                            <InputPane
                                paneData={props.stake1Data}
                                onInputChange={props.onStake1Change}
                                changeAmount={props.changeStake1Amount}
                            />

                        </Col>
                        <Col xs={9} style={{ marginLeft: 30 }}>

                            <InputPane
                                paneData={props.stake2Data}
                                onInputChange={props.onStake2Change}
                                changeAmount={props.changeStake2Amount} />

                            <br />
                        </Col>

                        <Col xs={2}>
                        </Col>
                    </Row>
                    <Row style={rowStyles}>
                        <Col xs={12}>
                            <Center><LabelGroup size={18} element={`${convertFromWei(props.estStakeUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                        </Col>
                        <Col xs={12}>
                            <Center><LabelGroup size={18} element={`${props.getEstShare()}%`} label={'ESTIMATED SHARE'} /></Center>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs={8}>
                            {!props.approval1 &&
                                <Center><Button type={'secondary'} onClick={props.unlockSparta} icon={<UnlockOutlined />}>UNLOCK {props.stake1Data.symbol}</Button></Center>
                            }
                        </Col>
                        <Col xs={8}>
                            {props.approval1 && props.approval2 && props.startTx && !props.endTx &&
                                <Center><Button type={'primary'} onClick={props.stake} icon={<LoadingOutlined />} >STAKE IN POOL</Button></Center>
                            }
                            {props.approval1 && props.approval2 && !props.startTx &&
                                <Center><Button type={'primary'} onClick={props.stake}>STAKE IN POOL</Button></Center>
                            }
                        </Col>
                        <Col xs={8}>
                            {!props.approval2 &&
                                <Center><Button type={'secondary'} onClick={props.unlockToken} icon={<UnlockOutlined />}>UNLOCK {props.stake2Data.symbol}</Button></Center>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

const UnstakePane = (props) => {


    return (
        <>
            <Row style={paneStyles}>
                <Col xs={24} style={colStyles}>
                    <Row>
                        <Col xs={6}>
                        </Col>
                        <Col xs={12}>
                            <OutputPane
                                changeAmount={props.changeUnstakeAmount} />
                        </Col>
                        <Col xs={6}>
                        </Col>
                    </Row>
                    <Row style={rowStyles}>
                    </Row>
                    <br></br>
                    <Center><Button type={'primary'} onClick={props.unstake}>WITHDRAW FROM POOL</Button></Center>
                </Col>
            </Row>
        </>
    )
}