
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { SPARTA_ADDR, ROUTER_ADDR, BNB_ADDR, getTokenContract, getRouterContract,
    getTokenDetails, getTokenData } from '../../client/web3'


import { Button, Row, Col, message, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AssetTable } from '../layout/WalletDrawer'
var utils = require('ethers').utils;

const SimpleAddLiquidity = (props) => {

    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)

    const [listed, setListed] = useState(false);

    const [tokenFrom, setAssetFrom] = useState(SPARTA_ADDR);
    const [tokenTo, setAssetTo] = useState('0x0000000000000000000000000000000000000000');
    const [approval, setApproval] = useState(false)
    const [approvalS, setApprovalS] = useState(false)
    const [tokenData, setTokenData] = useState({
        'symbol': 'SPARTA',
        'name': 'SPARTAN PROTOCOL TOKEN',
        'balance': 0,
        'address': SPARTA_ADDR
    })
    const [tokenAmount, setTokenAmount] = useState(false);
    const [spartaAmount, setSpartaAmount] = useState(false);

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
        checkApproval(SPARTA_ADDR)
    }

    const changeToken = (e) => {
        // console.log(e)
        setAssetFrom(e.target.value)
        setApproval(false)
        e.target.value === BNB_ADDR ? setApproval(true) : checkApproval(e.target.value)
        // let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        // setTokenData(tokenDetails)
        console.log(e.target.value)
        // checkListed(e.target.value)
        // setSwapData(getSwapData(tokenDetails))
    }

    const checkListed = async (address) => {
        var contract = getRouterContract()
        let pool = (await contract.methods.getPool(address).call())
        console.log({pool})
        if(pool === '0x0000000000000000000000000000000000000000'){
            setListed(false)
        } else {
            setListed(true)
        }
    }

    // const getSwapData = (details) => {
    //     return {
    //         'output': '100000000000000000',
    //         'slip': 0.01,
    //     }
    // }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.account, ROUTER_ADDR).call()
        console.log(approval, address)
        if (+approval > 0) {
            address === SPARTA_ADDR ? setApprovalS(true) : setApproval(true)
        }
    }

    const approveSparta = async () => {
        approveToken(SPARTA_ADDR)
    }

    const approve = async () => {
       approveToken(tokenFrom)
    }

    const approveToken = async (address) => {
        const contract = getTokenContract(address)
        // (utils.parseEther(10**18)).toString()
        const supply = '1000000000000000000000000'
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        checkApproval(address)
    }

    const changeTokenAmount = (e) => {
        setTokenAmount((utils.parseEther(e.target.value)).toString())
    }
    const changeSpartaAmount = (e) => {
        setSpartaAmount((utils.parseEther(e.target.value)).toString())
    }

    const create = async () => {
        setStartTx(true)
        console.log(spartaAmount, tokenAmount, tokenFrom)
        let contract = getRouterContract()
        await contract.methods.createPool(spartaAmount, tokenAmount, tokenFrom).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        // context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray) })
    }

    return (
        <div>
            <Row>
                <Col xs={24}>

                    <Row>
                        <Col xs={24}>
                        <Row>
                                <Col xs={12}>
                                <h1>Enter Token To AddLiquidity</h1>
                                    <Input
                                        onChange={changeToken}
                                        placeholder={'Enter BEP2E Asset Address'}
                                    >
                                    </Input>
                                </Col>
                                <Col>
                                <h2>Token is {listed ? "true" : "false"}</h2>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>

                                    <h4>Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                                    <Input
                                        onChange={changeTokenAmount}
                                        placeholder={'Enter Amount of Token'}
                                    >
                                    </Input>
                                    <br/><br/>
                                    {!approval &&
                                        <Button onClick={approve} type={'secondary'}>APPROVE</Button>
                                    }
                                    {approval && !startTx &&
                                        <Button onClick={create} type={'primary'} >CREATE</Button>
                                    }
                                    {approval && startTx && !endTx &&
                                        <Button onClick={create} type={'primary'} icon={<LoadingOutlined />}>CREATE</Button>
                                    }
                                </Col>
                                <Col xs={12}>
                                <h4>Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                                    <Input
                                        onChange={changeSpartaAmount}
                                        placeholder={'Enter Amount of Sparta'}
                                    >
                                    </Input>
                                    <br/><br/>
                                    {!approvalS &&
                                        <Button onClick={approveSparta} type={'secondary'}>APPROVE</Button>
                                    }
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

                        </Col>
                    </Row>



                </Col>

            </Row>



        </div>
    )


}

export default SimpleAddLiquidity
