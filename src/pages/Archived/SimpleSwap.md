
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { SPARTA_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getTokenData } from '../../client/web3'


import { Button, Row, Col, message, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AssetTable } from '../layout/WalletDrawer'

import { bn, formatBN, convertFromWei, convertToWei, formatUSD } from '../../utils'
import { getSwapOutput, getSwapSlip } from '../../math'

var utils = require('ethers').utils;

const SimpleSwap = (props) => {

    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [visible, setVisible] = useState(false);

    const [tokenFrom, setAssetFrom] = useState(SPARTA_ADDR);
    const [tokenTo, setAssetTo] = useState('0x0000000000000000000000000000000000000000');
    const [approval, setApproval] = useState(false)
    const [tokenData, setTokenData] = useState({
        'symbol': 'SPARTA',
        'name': 'SPARTAN PROTOCOL TOKEN',
        'balance': 0,
        'address': SPARTA_ADDR
    })
    const [swapData, setSwapData] = useState({
        'output': 0,
        'slip': 0,
    })
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
    }

    const changeToken = async (e) => {
        setAssetFrom(e.target.value)
        setApproval(false)
        checkApproval(e.target.value)
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
        setSwapData(getSwapData(tokenDetails))
    }

    const getSwapData = async (input, inputTokenData, outputTokenData, poolData) => {

        var output; var slip
        output = getSwapOutput(input, poolData, false)
        slip = getSwapSlip(input, poolData, false)
        console.log(formatBN(output), formatBN(slip))

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

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.account, SPARTA_ADDR).call()
        console.log(approval)
        if (+approval > 0) {
            setApproval(true)
        }
    }

    const approve = async () => {
        const contract = getTokenContract(tokenFrom)
        // (utils.parseEther(10**18)).toString()
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(SPARTA_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
    }

    const swap = async () => {
        setStartTx(true)
        let contract = getSpartaContract()
        await contract.methods.upgrade(tokenTo).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray) })
    }

    return (
        <div>
            <Row>
                <Col xs={24}>

                    <Row>
                        <Col xs={24}>
                            <Row>
                                <Col xs={12}>
                                    <h1>Token From</h1>
                                    <Input
                                        // onChange={changeToken}
                                        placeholder={'Enter BEP2E Asset Address'}
                                    >
                                    </Input>
                                    <br /><br />
                                    <h4>Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                                    {!approval &&
                                        <Button onClick={approve} type={'secondary'}>APPROVE</Button>
                                    }
                                    {approval && !startTx &&
                                        <Button onClick={swap} type={'primary'} >UPGRADE</Button>
                                    }
                                    {approval && startTx && !endTx &&
                                        <Button onClick={swap} type={'primary'} icon={<LoadingOutlined />}>UPGRADE</Button>
                                    }
                                </Col>
                                <Col xs={12}>
                                    <h1>Token To</h1>
                                    <Input
                                        // onChange={changeToken}
                                        placeholder={'Enter BEP2E Asset Address'}
                                    >
                                    </Input>
                                    <br /><br />
                                    <h4>Output: {utils.formatEther(swapData.output, { commify: true })}</h4>
                                    <h4>Output: {swapData.slip}%</h4>
                                </Col>
                            </Row>

                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <h1>Tokens on your wallet</h1>
                            {context.connected &&
                                <AssetTable />
                            }
                        </Col>
                        <Col xs={12}>
                            <h1>Tokens you can swap to</h1>
                            {context.connected &&
                                <AssetTable />
                            }
                        </Col>
                    </Row>



                </Col>

            </Row>



        </div>
    )


}

export default SimpleSwap
