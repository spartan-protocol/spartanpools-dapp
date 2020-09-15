import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Tabs, Row, Col, message } from 'antd';
import { LoadingOutlined, LeftOutlined, UnlockOutlined, PlusOutlined } from '@ant-design/icons';

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

    const [userData, setUserData] = useState({
        'baseBalance': 0,
        'tokenBalance': 0,
        'address': SPARTA_ADDR,
        'symbol': 'XXX',
        'balance': 0,
        'input': 0,
    })

    // const [stake1Data, setStake1Data] = useState({
    //     address: SPARTA_ADDR,
    //     symbol: 'XXX',
    //     balance: 0,
    //     input: 0,
    // })
    // const [stake2Data, setStake2Data] = useState({
    //     address: BNB_ADDR,
    //     symbol: 'XXX',
    //     balance: 0,
    //     input: 0,
    // })

    const [stakeData, setStakeData] = useState({
        baseAmt: '',
        tokenAmt: '',
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

        let _userData =  {
            'baseBalance': inputTokenData.balance,
            'tokenBalance': outputTokenData.balance,
            'address': inputTokenData.address,
            'symbol': inputTokenData.symbol,
            'balance': inputTokenData.balance,
            'input': 0,
        }

        setUserData(_userData)

        // setStake1Data(await getStakeInputData(inputTokenData.balance, inputTokenData))
        // setStake2Data(await getStakeInputData(outputTokenData.balance, outputTokenData))

        let stake = getPairedAmount(inputTokenData.balance, outputTokenData.balance, pool)
        setStakeData(stake)
        const estStakeUnits = getStakeUnits(stake, pool)
        setStakeUnits(estStakeUnits)
        checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false)
        checkApproval(pool.address) ? setApproval(true) : setApproval(false)

    }

    // const getStakeInputData = async (input, inputTokenData) => {
    //     const stakeData = {
    //         address: inputTokenData.address,
    //         symbol: inputTokenData.symbol,
    //         balance: inputTokenData.balance,
    //         input: formatBN(bn(input), 0),
    //     }
    //     return stakeData
    // }

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
        let stake = getPairedAmount(formatBN(convertToWei(input), 0), userData.tokenBalance, pool)
        setStakeData(stake)
        setStakeUnits(getStakeUnits(stake, pool))
        let _userData =  {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input':formatBN(bn(input), 0),
        }
        setUserData(_userData)
    }

    const changeStake1Amount = async (amount) => {
        const finalAmt = (bn(userData?.baseBalance)).times(amount).div(100)
        console.log(finalAmt, formatBN(finalAmt, 0))
        let stake = getPairedAmount(formatBN(finalAmt, 0), userData.tokenBalance, pool)
        setStakeData(stake)
        setStakeUnits(getStakeUnits(stake, pool))
        let _userData =  {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input':formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
    }

    // const onStake2Change = async (e) => {
    //     const input = e.target.value
    //     setStake2Data(await getStakeInputData(convertToWei(input), stake2Data))
    //     const stake = {
    //         baseAmt: stake1Data.input,
    //         tokenAmt: convertToWei(input)
    //     }
    //     setStakeUnits(getStakeUnits(stake, pool))
    // }

    const getPairedAmount = (baseAmount, tokenBalance, pool) => {

        let price = pool.tokenAmt / pool.baseAmt  // 10:100 100/10 = 10
        let tokenAmount = price * +baseAmount  // 10 * 1 = 10

        let stakeData = {
            baseAmt : "",
            tokenAmt: "",
        }

        if (tokenAmount > tokenBalance) {
            stakeData.baseAmt = tokenBalance / price  // 5 / 10 -> 0.5
            stakeData.tokenAmt = formatBN(tokenBalance, 0) // 5
        } else {
            stakeData.baseAmt = baseAmount // 1
            stakeData.tokenAmt = formatBN(tokenAmount, 0) // 10
        }

        console.log(baseAmount, tokenBalance)
        console.log(price, tokenAmount, stakeData)

       return stakeData
    }

    // const changeStake2Amount = async (amount) => {
    //     const finalAmt = (amount * stake2Data?.balance) / 100
    //     setStake2Data(await getStakeInputData(finalAmt, stake2Data))
    //     const stake = {
    //         baseAmt: stake1Data.input,
    //         tokenAmt: finalAmt
    //     }
    //     setStakeUnits(getStakeUnits(stake, pool))
    // }

    const changeUnstakeAmount = async (amount) => {
        setUnstakeAmount(amount)
    }

    const getEstShare = () => {
        const newUnits = (bn(estStakeUnits)).plus(bn(pool.units))
        const share = ((bn(estStakeUnits)).div(newUnits)).toFixed(2)
        return (share * 100).toFixed(2)
    }

    const unlockSparta = async () => {
        unlock(SPARTA_ADDR)
    }

    const unlockToken = async () => {
        unlock(pool.address)
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
        console.log(stakeData.baseAmt, stakeData.tokenAmt, pool.address)
        await contract.methods.stake(stakeData.baseAmt, stakeData.tokenAmt, pool.address).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
            value: pool.address === BNB_ADDR ? stakeData.tokenAmt : 0
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
                                        userData={userData}
                                        stakeData={stakeData}
                                        onStake1Change={onStake1Change}
                                        changeStake1Amount={changeStake1Amount}
                                        // stake2Data={stake2Data}
                                        // onStake2Change={onStake2Change}
                                        // changeStake2Amount={changeStake2Amount}
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
                        <Col xs={1}>
                        </Col>
                        <Col xs={9} style={{ marginRight: 30 }}>
                            <InputPane
                                paneData={props.userData}
                                onInputChange={props.onStake1Change}
                                changeAmount={props.changeStake1Amount}
                            />

                        </Col>
                        <Col xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            <PlusOutlined style={{ fontSize: 24 }} />
                        </Col>
                        <Col xs={9} style={{ marginLeft: 30 }}>

                        <LabelGroup size={30} 
                        element={`${convertFromWei(props.stakeData.tokenAmt)}`} 
                        label={`PAIRED AMOUNT (${props.pool.symbol})`} />

                            {/* <InputPane
                                paneData={props.stake2Data}
                                onInputChange={props.onStake2Change}
                                changeAmount={props.changeStake2Amount} /> */}

                            <br />
                        </Col>

                        <Col xs={1}>
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
                                <Center><Button type={'secondary'} onClick={props.unlockSparta} icon={<UnlockOutlined />}>UNLOCK {props.userData.symbol}</Button></Center>
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
                                <Center><Button type={'secondary'} onClick={props.unlockToken} icon={<UnlockOutlined />}>UNLOCK {props.pool.symbol}</Button></Center>
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