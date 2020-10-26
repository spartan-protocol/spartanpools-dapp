
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { BNB_ADDR, SPARTA_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getWalletData } from '../../client/web3'

import { Row, Col, message, Input, Table } from 'antd';

import { H1, H2, Button } from '../components/elements';

var utils = require('ethers').utils;

const Upgrade = (props) => {

    // Show Spartan Token Info
    // Show Spartan Balance
    // Input field of token, upgrade button


    const context = useContext(Context)
    // const [connecting, setConnecting] = useState(false)
    // const [connected, setConnected] = useState(false)
    // const [visible, setVisible] = useState(false);

    const [token, setAsset] = useState('0x0000000000000000000000000000000000000000');
    const [approval, setApproval] = useState(false)
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.tokenDetailsArray])

    const getData = async () => {
        // let eligibleAssetArray = context.eligibleAssetArray ? context.eligibleAssetArray : await getEligibleAssets(account)
        // context.setContext({ 'eligibleAssetArray': eligibleAssetArray })
    }
    const changeToken = (e) => {
        setAsset(e.target.value)
        setApproval(false)
        checkApproval(e.target.value)
    }

    const checkApproval = async (address) => {
        if (address === BNB_ADDR) {
            setApproval(true)
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.account, SPARTA_ADDR).call()
            console.log(approval)
            if (+approval > 0) {
                setApproval(true)
            }
        }
    }

    const approve = async () => {
        const contract = getTokenContract(token)
        // (utils.parseEther(10**18)).toString()
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(SPARTA_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`,  2);
        checkApproval(token)
    }

    const upgrade = async () => {
        setStartTx(true)
        let contract = getSpartaContract()
        await contract.methods.upgrade(token).send({
            from: context.account,
            gasPrice: '',
            gas: '',
            // value: token === BNB_ADDR ? sellData.input : 0
        })
        message.success(`Transaction Sent!`,  2);
        setStartTx(false)
        setEndTx(true)
        let tokenDetailsArray = await getTokenDetails(context.account, context.tokenArray)
        context.setContext({ 'tokenDetailsArray': tokenDetailsArray })
        let walletData = await getWalletData(context.account, tokenDetailsArray)
        context.setContext({ 'walletData': walletData })
    }

    return (
        <div>
            <H1>UPGRADE</H1>
            <p>A minimum of 300 members each from 30 Binance Chain projects can acquire SPARTA using Proof-Of-Burn. </p>
            <p><span>Acquiring SPARTA will destroy your previous tokens and mint SPARTA in accordance with the &nbsp;
            <a href="http://spartanprotocol.org/sparta" target="blank">
                Genesis Allocations.
            </a>
            </span></p>
            <br/><br/>
            <Row>
                <Col xs={24}>
                    <Row>
                        <Col xs={24}>
                            <h2>UPGRADE</h2>
                            <Input onChange={changeToken}
                                placeholder={'Enter BEP2E Asset Address'}
                                size={'large'}
                                >
                                </Input>
                                <br/><br/>
                                {!approval &&
                                    <Button onClick={approve} type={'secondary'}>APPROVE</Button>
                                }
                                {approval && !startTx &&
                                    <Button onClick={upgrade} type={'primary'} >UPGRADE</Button>
                                }
                                {approval && startTx && !endTx &&
                                    <Button onClick={upgrade} type={'primary'}><i className="bx bx-spin bx-loader"/> UPGRADE</Button>
                                }

                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/><br/>
            <H2>ELIGIBLE TOKENS</H2>
            <p>The following tokens on your wallet can be upgraded to acquire SPARTA.</p>
            <BalanceTable />
        </div>
    )

}

export default Upgrade

export const BalanceTable = () => {

    const context = useContext(Context)

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <h3>{name}</h3>
            )
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol) => (
                <h3>{symbol}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'tokenAddress',
            key: 'tokenAddress',
            render: (tokenAddress) => (
                <h3>{tokenAddress}</h3>
            )
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => (
                <h3>{utils.formatEther(balance, {commify: true})}</h3>
            )
        },
        {
            title: 'Max Claim',
            dataIndex: 'maxClaim',
            key: 'maxClaim',
            render: (balance) => (
                <h3>500</h3>
            )
        }
    ]

    return (
        <>
            <Table dataSource={context.tokenDetailsArray} columns={columns} rowKey="symbol" />
        </>
    )
}

export const AllocationTable = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <h3>{name}</h3>
            )
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol) => (
                <h3>{symbol}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address) => (
                <h3>{address}</h3>
            )
        },
        {
            title: 'Rate (SPARTA per token)',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate) => (
                <h3>{rate}</h3>
            )
        },
        {
            title: 'Max Claim (SPARTA) ',
            dataIndex: 'maxClaim',
            key: 'maxClaim',
            render: (maxClaim) => (
                <h3>{maxClaim}</h3>
            )
        },
        {
            title: 'SPARTA Remaining',
            dataIndex: 'spartaRemaining',
            key: 'spartaRemaining',
            render: (spartaRemaining) => (
                <h3>{spartaRemaining}</h3>
            )
        }]

    const allocationData = [{
        "name": 'Binance Coin',
        "symbol": 'BNB',
        "address": '0x0000000000000000000000000000000000000000',
        "maxClaim" : 33333,
        "rate": 500,
        'spartaRemaining': 10000000,
    }, {
        "name": 'Matic',
        "symbol": 'MATIC',
        "address": '0x0000000000000000000000000000000000000000',
        "maxClaim" : 33333,
        "rate": 1,
        'spartaRemaining': 10000000,
    }, {
        "name": 'Harmony',
        "symbol": 'ONE',
        "address": '0x0000000000000000000000000000000000000000',
        "maxClaim" : 33333,
        "rate": 2,
        'spartaRemaining': 10000000,
    }

    ]

    return (
        <>
            <Table dataSource={allocationData} columns={columns} rowKey="symbol" />
        </>
    )
}

export const AllocationData = () => {
    return ([{
        "name": 'Binance Coin',
        "symbol": 'BNB',
        "address": '0x0000000000000000000000000000000000000000',
    }, {
        "name": 'Matic',
        "symbol": 'MATIC',
        "address": '0x0000000000000000000000000000000000000000',
    }, {
        "name": 'Harmony',
        "symbol": 'ONE',
        "address": '0x0000000000000000000000000000000000000000',
    }
    ])
}
