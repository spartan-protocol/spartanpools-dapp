import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { BreadcrumbCombo, InputPaneSwap, PoolPane } from '../components/common'
import { Center, HR, Text } from '../components/elements';
import { bn, formatBN, convertFromWei, convertToWei, formatUSD } from '../../utils'
import { getSwapOutput, getSwapSlip } from '../../math'

import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getTokenContract, getPoolsContract,
    getPoolData, getTokenData, filterTokensByPoolSelection,
    getListedPools, getPoolsData, getSharesData, getWalletData
} from '../../client/web3'

const Swap = (props) => {

    const context = useContext(Context)
    const [mainPool, setMainPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB_ADDR,
        'price': 0,
        'volume': 0,
        'baseAmount': 0,
        'token': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    })
    const [tokenList, setTokenList] = useState([SPARTA_ADDR])

    const [inputTokenData, setInputTokenData] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'balance': 0,
        'address': BNB_ADDR
    })
    const [outputTokenData, setOutputTokenData] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'balance': 0,
        'address': BNB_ADDR
    })

    const [buyData, setBuyData] = useState({
        address: SPARTA_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0
    })
    const [sellData, setSellData] = useState({
        address: BNB_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0
    })

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(true)
    const [buyTx, setBuyTx] = useState(null)

    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(true)
    const [sellTx, setSellTx] = useState(null)

    const [approvalBuy, setApprovalBuy] = useState(false)
    const [approvalSell, setApprovalSell] = useState(false)

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected, context.poolsData])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        const mainPool = await getPoolData(params.pool, context.poolsData)
        setMainPool(mainPool)

        setTokenList(await filterTokensByPoolSelection(mainPool.address, context.poolsData, context.walletData))

        const inputTokenData = await getTokenData(SPARTA_ADDR, context.walletData)
        const outputTokenData = await getTokenData(mainPool.address, context.walletData)
        setInputTokenData(inputTokenData)
        setOutputTokenData(outputTokenData)

        setBuyData(await getSwapData(inputTokenData.balance, inputTokenData, outputTokenData, mainPool))
        setSellData(await getSwapData(outputTokenData.balance, outputTokenData, inputTokenData, mainPool))

        checkApprovalBuy(SPARTA_ADDR)
        checkApprovalSell(mainPool.address)

        console.log(buyFlag, loadedBuy, buyTx, sellFlag, loadedSell, sellTx)
    }

    const onBuyChange = async (e) => {
        // const amt = convertToWei(e.target.value) > buyData.balance ? buyData.balance : convertToWei(e.target.value)
        setBuyData(await getSwapData(convertToWei(e.target.value), inputTokenData, outputTokenData, mainPool))
    }

    // const changeBuyToken = async (token) => {
    //     // setBuyPool(await getPoolData(token))
    //     const inputTokenData = await getTokenData(token)
    //     setBuyData(await getSwapData(inputTokenData.balance, inputTokenData, outputTokenData, mainPool))
    //     const outputTokenData = await getTokenData(mainPool.address)
    //     setSellData(await getSwapData(outputTokenData.balance, outputTokenData, inputTokenData, mainPool))
    // }

    const changeBuyAmount = async (amount) => {
        // const amt = amount > buyData.balance ? buyData.balance : amount
        const finalAmt = (amount * buyData?.balance) / 100
        setBuyData(await getSwapData(finalAmt, inputTokenData, outputTokenData, mainPool))
    }

    // const changeSellToken = async (token) => {
    //     console.log("changing sell tokens not enabled yet")
    // }

    const onSellChange = async (e) => {
        const amt = convertToWei(e.target.value) > sellData.balance ? sellData.balance : convertToWei(e.target.value)
        setSellData(await getSwapData(amt, outputTokenData, inputTokenData, mainPool))
    }

    const changeSellAmount = async (amount) => {
        const amt = amount > sellData.balance ? sellData.balance : amount
        const finalAmt = (amt * sellData?.balance) / 100
        setSellData(await getSwapData(finalAmt, outputTokenData, inputTokenData, mainPool))
    }

    const getSwapData = async (input, inputTokenData, outputTokenData, poolData) => {

        // var buyPool_
        // if (inputAddress === SPARTA_ADDR) {
        //     buyPool_ = await getPoolData(mainPool.address, context.poolsData)
        // } else {
        //     buyPool_ = await getPoolData(inputAddress, context.poolsData)
        // }
        // console.log(input, inputAddress, outputAddress, balance, inputSymbol, outputSymbol, mainPool_, buyPool_)

        var output; var slip
        output = getSwapOutput(input, poolData, false)
        slip = getSwapSlip(input, poolData, false)
        console.log(formatBN(output), formatBN(slip))


        // if (inputAddress === SPARTA_ADDR && outputAddress === mainPool.address) {
        //     //single swap to params.pool
        //     output = getSwapOutput(input, mainPool, false)
        //     slip = getSwapSlip(input, mainPool, false)
        // } else if (inputAddress !== SPARTA_ADDR && outputAddress === mainPool.address) {
        //     // double swap to params.pool
        //     output = getDoubleSwapOutput(input, buyPool_, mainPool_)
        //     slip = getDoubleSwapSlip(input, buyPool_, mainPool_)
        // } else if (inputAddress === mainPool.address && outputAddress === SPARTA_ADDR) {
        //     // single swap to sparta
        //     output = getSwapOutput(input, mainPool_, true)
        //     slip = getSwapSlip(input, mainPool_, true)
        // } else {
        //     // double swap to token
        //     output = getDoubleSwapOutput(input, mainPool_, buyPool_)
        //     slip = getDoubleSwapSlip(input, mainPool_, buyPool_)
        // }

        const swapData = {
            address: poolData.address,
            balance: inputTokenData.balance,
            input: formatBN(bn(input), 0),
            inputSymbol: inputTokenData.symbol,
            output: formatBN(output, 0),
            outputSymbol: outputTokenData.symbol,
            slip: formatBN(slip)
        }
        console.log(swapData)
        return swapData
    }

    const checkApprovalBuy = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.account, ROUTER_ADDR).call()
        if (+approval >= +inputTokenData.balance) {
            setApprovalBuy(true)
        }
    }
    const checkApprovalSell = async (address) => {
        if (address === BNB_ADDR) {
            setApprovalSell(true)
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.account, ROUTER_ADDR).call()
            if (+approval >= +outputTokenData.balance) {
                setApprovalSell(true)
            }
        }

    }

    const unlockSparta = async () => {
        unlockToken(buyData.address)
    }

    const unlockAsset = async () => {
        unlockToken(sellData.address)
    }

    const unlockToken = async (address) => {
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
    }

    const buyAsset = async () => {
        setBuyFlag(true)
        setLoadedBuy(false)
        const poolContract = getPoolsContract()
        console.log(buyData.input, SPARTA_ADDR, mainPool.address)
        const tx = await poolContract.methods.swap(buyData.input, SPARTA_ADDR, mainPool.address)
            .send({
                from: context.account,
                gasPrice: '',
                gas: '',

            })
        setBuyTx(tx.transactionHash)
        await reloadData()
        setLoadedBuy(true)
    }

    const sellAsset = async () => {
        setLoadedSell(false)
        setSellFlag(true)
        const poolContract = getPoolsContract()
        console.log(sellData.input, SPARTA_ADDR, mainPool.address)
        let tx
        if (sellData.address === BNB_ADDR) {
            tx = await poolContract.methods.swap(sellData.input, mainPool.address, SPARTA_ADDR)
                .send({
                    from: context.account,
                    gasPrice: '',
                    gas: '240085',
                    value: sellData.input
                })
        } else {
            tx = await poolContract.methods.swap(sellData.input, mainPool.address, SPARTA_ADDR)
                .send({
                    from: context.account,
                    gasPrice: '',
                    gas: '240085',
                })
        }

        setSellTx(tx.transactionHash)
        await reloadData()
        setLoadedSell(true)
    }

    const reloadData = async () => {
        let poolArray = await getListedPools()
        let poolsData = await getPoolsData(poolArray)
        let sharesData = await getSharesData(context.account, poolArray)
        let walletData = await getWalletData(poolArray)
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': poolsData })
        context.setContext({ 'sharesData': sharesData })
        context.setContext({ 'walletData': walletData })
    }

    const poolAttributes = {
        field1: {
            title: 'VOLUME',
            data: `${formatUSD(convertFromWei(mainPool?.volume), context.spartanPrice)}`
        },
        field2: {
            title: 'TX COUNT',
            data: mainPool?.txCount
        },
        field3: {
            title: 'PRICE',
            data: `${formatUSD(mainPool?.price, context.spartanPrice)}`
        },
    }

    return (
        <div>
            <BreadcrumbCombo title={'SWAP'} parent={'POOLS'} link={'/pools'} child={'SWAP'}></BreadcrumbCombo>
            <div style={{ marginTop: '-50px' }}>
                <Center><PoolPane
                    symbol={mainPool?.symbol}
                    balance={mainPool?.tokenAmount}
                    data={poolAttributes} /></Center>
            </div>

            <HR></HR>
            <br />
            <Row>
                <Col xs={24}>
                    <Row >
                        <Col xs={2}>
                        </Col>
                        <Col xs={9} style={{ marginRight: 30 }}>
                            <InputPaneSwap
                                mainPool={mainPool}
                                tokenList={tokenList}
                                paneData={buyData}
                                onInputChange={onBuyChange}
                                // changeToken={changeBuyToken}
                                changeAmount={changeBuyAmount}
                            />
                            <Text>Output: {convertFromWei(buyData.output)} ({buyData.outputSymbol})</Text>
                            <br />
                            <Text>Slip: {((buyData.slip) * 100).toFixed(2)}%</Text>
                            <br /><br />
                            {!approvalBuy &&
                                <Center><Button type={'secondary'} onClick={unlockSparta}> Approve SPARTA_ADDR</Button></Center>
                            }
                            {(approvalBuy && !loadedBuy) &&
                                <Center><Button type={'primary'} onClick={buyAsset} icon={<LoadingOutlined />}>BUY {mainPool?.symbol}</Button></Center>
                            }
                            {(approvalBuy && loadedBuy) &&
                                <Center><Button type={'primary'} onClick={buyAsset}>BUY {mainPool?.symbol}</Button></Center>
                            }
                        </Col>
                        <Col xs={9} style={{ marginLeft: 30 }}>
                            <InputPaneSwap
                                poolsData={context.poolsData}
                                tokenList={[mainPool.address]}
                                paneData={sellData}
                                onInputChange={onSellChange}
                                // changeToken={changeSellToken}
                                changeAmount={changeSellAmount} />
                            <Text>Output: {convertFromWei(sellData.output)} ({sellData.outputSymbol})</Text>
                            <br />
                            <Text>Slip: {((sellData.slip) * 100).toFixed(2)}%</Text>
                            <br /><br />
                            {!approvalSell &&
                                <Center><Button type={'secondary'} onClick={unlockAsset}> Approve {mainPool?.symbol}</Button></Center>
                            }
                            {(approvalSell && !loadedSell) &&
                                <Center><Button type={'primary'} onClick={sellAsset} icon={<LoadingOutlined />} danger>SELL {mainPool?.symbol}</Button></Center>
                            }
                            {(approvalSell && loadedSell) &&
                                <Center><Button type={'primary'} onClick={sellAsset} danger>SELL {mainPool?.symbol}</Button></Center>
                            }
                        </Col>

                        <Col xs={2}>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default withRouter(Swap)
