import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../context'
import { Tabs, Row, Col } from 'antd';
// import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { BreadcrumbCombo, InputPaneSwap, PoolPane, OutputPane } from '../components/common'
import { Center, Button, LabelGroup } from '../components/elements';

import { getLiquidityUnits, getPoolShare } from '../../math'
import { bn, convertToWei, convertFromWei, formatAPY } from '../../utils'
import {
    BNB, SPARTA, getPoolsContract, POOLS_ADDR, getPoolData,
    getTokenData, filterTokensByPoolSelection, getTokenContract, getLiquidityData
} from '../../client/web3'

const { TabPane } = Tabs;

const AddLiquidity = (props) => {

    const context = useContext(Context)

    const [mainPool, setMainPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB,
        'price': 0,
        'volume': 0,
        'baseAmount': 0,
        'tokenAmount': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    })

    const [tokenList, setTokenList] = useState([SPARTA])
    const [stake1Data, setAddLiquidity1Data] = useState({
        address: SPARTA,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    const [stake2Data, setAddLiquidity2Data] = useState({
        address: BNB,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    const [hideSubpane, setHideSubPane] = useState(true)
    const [estLiquidityUnits, setLiquidityUnits] = useState(0)
    const [shareData, setShareData] = useState({
        baseAmount: 0,
        tokenAmount: 0
    })
    const [approval1, setApproval1] = useState(false)
    const [approval2, setApproval2] = useState(false)

    const [liquidityData, setLiquidityData] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB,
        'baseAmount': 0,
        'tokenAmount': 0,
        'baseAddLiquidityd': 0,
        'tokenAddLiquidityd': 0,
        'roi': 0,
        'units': 0,
        'share': 0
     })

     const [withdrawAmount, setWithdrawAmount] = useState(0)
     const [addLiquidityTx, setAddLiquidityTx] = useState(null)
     const [removeLiquidityTx, setUnaddLiquidityTx] = useState(null)

    // PoolData {address, depth, balance}
    // LiquidityData {baseAmount, tokenAmount}
    // estLiquidityUnits, totalUnits

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {

        let params = queryString.parse(props.location.search)
        const mainPool = await getPoolData(params.pool, context.poolsData)
        setMainPool(mainPool)

        const liquidityData = await getLiquidityData(params.pool, context.sharesData)
        setLiquidityData(liquidityData)
        console.log(liquidityData)

        setTokenList(await filterTokensByPoolSelection(params.pool, context.poolsData, context.walletData))
        const inputTokenData = await getTokenData(SPARTA, context.walletData)
        setAddLiquidity1Data(await getPoolSharesInputData(inputTokenData.balance, SPARTA))
        const outputTokenData = await getTokenData(params.pool, context.walletData)
        setAddLiquidity2Data(await getPoolSharesInputData(outputTokenData.balance, params.pool))
        const stake = {
            baseAmount: inputTokenData.balance,
            tokenAmount: outputTokenData.balance
        }
        const estLiquidityUnits = getLiquidityUnits(stake, mainPool)
        setLiquidityUnits(estLiquidityUnits)
        const unitData = {
            estLiquidityUnits: estLiquidityUnits,
            totalUnits: mainPool.units
        }
        const share = getPoolShare(unitData, mainPool)
        setShareData(share)
        setHideSubPane(estLiquidityUnits > 0 ? false : true)
        checkApproval1(SPARTA)
        checkApproval2(params.pool)

        console.log(shareData, addLiquidityTx, removeLiquidityTx)
    }

    const getPoolSharesInputData = async (input, inputAddress) => {
        const tokenData = await getTokenData(inputAddress, context.walletData)
        const liquidityData = {
            address: inputAddress,
            symbol: tokenData.symbol,
            balance: tokenData.balance,
            input: input,
        }
        return liquidityData
    }

    const onAddLiquidity1Change = async (e) => {
        const input = e.target.value
        setAddLiquidity1Data(await getPoolSharesInputData(convertToWei(input), stake1Data.address))
        const stake = {
            baseAmount: convertToWei(input),
            tokenAmount: stake2Data.input
        }
        setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const changeAddLiquidity1Token = async (tokenAmount) => {
        const inputTokenData = await getTokenData(tokenAmount)
        setAddLiquidity1Data(await getPoolSharesInputData(inputTokenData.balance, tokenAmount))
        const stake = {
            baseAmount: inputTokenData.balance,
            tokenAmount: stake2Data.input
        }
        setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const changeAddLiquidity1Amount = async (amount) => {
        const finalAmt = (amount * stake1Data?.balance) / 100
        setAddLiquidity1Data(await getPoolSharesInputData(finalAmt, stake1Data.address))
        const stake = {
            baseAmount: finalAmt,
            tokenAmount: stake2Data.input
        }
        setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const changeAddLiquidity2Token = async (tokenAmount) => {
        console.log("changing sell tokens not enabled yet")
    }

    const onAddLiquidity2Change = async (e) => {
        const input = e.target.value
        setAddLiquidity2Data(await getPoolSharesInputData(convertToWei(input), BNB))
        const stake = {
            baseAmount: stake1Data.input,
            tokenAmount: convertToWei(input)
        }
        setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const changeAddLiquidity2Amount = async (amount) => {
        const finalAmt = (amount * stake2Data?.balance) / 100
        setAddLiquidity2Data(await getPoolSharesInputData(finalAmt, BNB))
        const stake = {
            baseAmount: stake1Data.input,
            tokenAmount: finalAmt
        }
        setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const changeWithdrawAmount = async (amount) => {
        setWithdrawAmount(amount)
        // const finalAmt1 = (amount * stake1Data?.balance) / 100
        // setAddLiquidity1Data(await getPoolSharesInputData(finalAmt1, stake1Data.address))
        // const finalAmt2 = (amount * stake2Data?.balance) / 100
        // setAddLiquidity1Data(await getPoolSharesInputData(finalAmt2, stake2Data.address))
        // const stake = {
        //     baseAmount: finalAmt1,
        //     tokenAmount: finalAmt2
        // }
        // setLiquidityUnits(getLiquidityUnits(stake, mainPool))
    }

    const getEstShare = () => {
        const newUnits = (bn(estLiquidityUnits)).plus(bn(mainPool.units))
        const share = ((bn(estLiquidityUnits)).div(newUnits)).toFixed(2)
        return (share * 100).toFixed(2)
    }

    const getShare = () => {
        const newUnits = (bn(liquidityData.units)).plus(bn(mainPool.units))
        const share = ((bn(liquidityData.units)).div(newUnits)).toFixed(2)
        return (share * 100).toFixed(2)
    }

    // const getValueShare = () => {
    //     const unitData =  {
    //         estLiquidityUnits:estLiquidityUnits,
    //         totalUnits:mainPool.units
    //     }
    //     const share = getPoolShare(unitData, mainPool)
    //     console.log(share)
    // }

    // const getValueOfShare = () => {
    //     return '$1234.54'
    // }

    const checkApproval1 = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.account, POOLS_ADDR).call()
        const tokenData = await getTokenData(address, context.walletData)
        if (+approval >= tokenData.balance) {
            setApproval1(true)
        }
    }
    const checkApproval2 = async (address) => {
        if (address === BNB) {
            setApproval2(true)
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.account, POOLS_ADDR).call()
            const tokenData = await getTokenData(address, context.walletData)
            if (+approval >= tokenData.balance) {
                setApproval2(true)
            }
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
        await contract.methods.approve(POOLS_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
    }

    const stake = async () => {
        const poolContract = getPoolsContract()
        const tx = await poolContract.methods.addLiquidity(stake1Data.input, stake2Data.input, BNB).send({
            value: stake2Data.input,
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setAddLiquidityTx(tx.transactionHash)
    }

    const unstake = async () => {
        const poolContract = getPoolsContract()
        const tx = await poolContract.methods.removeLiquidity(withdrawAmount*100, BNB).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setUnaddLiquidityTx(tx.transactionHash)
    }

    const poolAttributes = {
        field1: {
            title: 'YOUR SHARE',
            data: `${getShare()}%`
        },
        field2: {
            title: 'YOUR TOKENS',
            data: `${getShare() * convertFromWei(mainPool.depth)}`
        },
        field3: {
            title: 'APY',
            data: `${formatAPY(mainPool.apy)}`
        },
    }

    return (
        <div>
            <BreadcrumbCombo title={'STAKE'} parent={'POOLS'} link={'/pools'} child={'STAKE'}></BreadcrumbCombo>
            <div style={{ marginTop: '-50px' }}>
                <Center><PoolPane
                    symbol={mainPool?.symbol}
                    balance={mainPool?.tokenAmount}
                    data={poolAttributes}
                    hideSubpane={hideSubpane} /></Center>
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="STAKE" key="1">
                    <Row>
                        <Col xs={24}>
                            <Row >
                                <Col xs={2}>
                                </Col>
                                <Col xs={9} style={{ marginRight: 30 }}>
                                    <InputPaneSwap
                                        tokenList={tokenList}
                                        paneData={stake1Data}
                                        onInputChange={onAddLiquidity1Change}
                                        changeToken={changeAddLiquidity1Token}
                                        changeAmount={changeAddLiquidity1Amount}
                                    />

                                </Col>
                                <Col xs={9} style={{ marginLeft: 30 }}>

                                    <InputPaneSwap
                                        tokenList={[BNB]}
                                        paneData={stake2Data}
                                        onInputChange={onAddLiquidity2Change}
                                        changeToken={changeAddLiquidity2Token}
                                        changeAmount={changeAddLiquidity2Amount} />

                                    <br />
                                </Col>

                                <Col xs={2}>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`${convertFromWei(estLiquidityUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                </Col>
                                <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`${getEstShare()}%`} label={'ESTIMATED SHARE'} /></Center>
                                </Col>
                                {/* <Col xs={8}>
                                <Center><LabelGroup size={18} element={`${getValueOfShare()}`} label={'STAKED VALUE'} /></Center>
                                </Col> */}
                            </Row>
                            <Row>
                                <Col xs={8}>
                                    {!approval1 &&
                                        <Center><Button type={'secondary'} onClick={unlockSparta}>Approve {stake1Data.symbol}</Button></Center>
                                    }
                                </Col>
                                <Col xs={8}>
                                {(approval1 && approval2) &&
                                    <Center><Button type={'primary'} onClick={stake}>STAKE IN POOL</Button></Center>
                                }
                                </Col>
                                <Col xs={8}>
                                    {!approval2 &&
                                        <Center><Button type={'secondary'} onClick={unlockAsset}>Approve {stake2Data.symbol}</Button></Center>
                                    }
                                </Col>
                            </Row>
                            <br></br>

                            <br></br>


                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="WITHDRAW" key="2">
                    <Row>
                        <Col xs={24}>
                            <Row>
                                <Col xs={6}>
                                </Col>
                                <Col xs={12}>
                                    <OutputPane
                                        changeAmount={changeWithdrawAmount} />
                                </Col>
                                <Col xs={6}>
                                </Col>
                            </Row>
                            <Row>
                                {/* <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`${convertFromWei(estLiquidityUnits.toFixed(0))}`} label={'POOL UNITS'} /></Center>
                                </Col>
                                <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`${getEstShare()}%`} label={'POOL SHARE'} /></Center>
                                </Col> */}
                                {/* <Col xs={8}>
                                <Center><LabelGroup size={18} element={`${getValueOfShare()}`} label={'STAKED VALUE'} /></Center>
                                </Col> */}
                            </Row>
                            <br></br>
                            <Center><Button type={'primary'} onClick={unstake}>WITHDRAW FROM POOL</Button></Center>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default withRouter(AddLiquidity)
