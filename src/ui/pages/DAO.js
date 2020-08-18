
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { getSpartaContract } from '../../client/web3'

import { Button, Row, Col, message, Input, Table } from 'antd';
import { paneStyles, colStyles } from '../components/styles'

import ERC20 from '../../artifacts/ERC20.json'
var utils = require('ethers').utils;

const ERC20_ABI = ERC20.abi

const DAO = (props) => {

    // Show Spartan Token Info
    // Show Spartan Balance
    // Input field of token, upgrade button


    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [visible, setVisible] = useState(false);

    const [asset, setAsset] = useState(false);
    const [maxClaim, setMaxClaim] = useState(false);
    const [claimRate, setClaimRate] = useState(false);

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        
    }


    const changeAsset = (e) => {
        setAsset(e.target.value)
    }
    const changeMaxClaim = (e) => {
        let wei = utils.parseEther(e.target.value)
        setMaxClaim(wei.toString())
    }
    const changeClaimRate = (e) => {
        let wei = utils.parseEther(e.target.value)
        setClaimRate(wei.toString())
    }

    const listAsset = async () => {
        console.log('listAsset')
        let contract = getSpartaContract()
        let tx = await contract.methods.listAssetWithClaim(asset, maxClaim, claimRate).send({from:context.walletData.address})
        console.log(tx.transactionHash)
    }

    const indentStyles = {
        marginLeft: 100,
        marginRight: 100,
    }

    return (
        <div>
            <h1>DAO Functions</h1>
            <p>The Spartan DAO can govern the contract.</p>
            <br/><br/>
            <Row style={indentStyles}>
                <Col xs={24}>
                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <h2>LIST ASSET</h2>
                            <Input onChange={changeAsset}
                                placeholder={'Enter BEP2E Asset Address'}
                                allowClear={true}></Input>
                            <Input onChange={changeMaxClaim}
                                placeholder={'Enter Max Claim'}
                                allowClear={true}></Input>
                            <Input onChange={changeClaimRate}
                                placeholder={'Enter Claim Rate'}
                                allowClear={true}></Input>
                            <Button onClick={listAsset} primary>LIST</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    )

}

export default DAO
