
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { getSpartaContract, getDaoContract } from '../../client/web3'

import { Row, Col, Input } from 'antd';
import { paneStyles, colStyles } from '../components/styles'

import { H1, Button } from '../components/elements';

var utils = require('ethers').utils;

const DAO = (props) => {

    // Show Spartan Token Info
    // Show Spartan Balance
    // Input field of token, upgrade button


    const context = useContext(Context)
    // const [connecting, setConnecting] = useState(false)
    // const [connected, setConnected] = useState(false)
    // const [visible, setVisible] = useState(false);

    const [asset, setAsset] = useState(false);
    const [maxClaim, setMaxClaim] = useState(false);
    const [claimRate, setClaimRate] = useState(false);
    const [daoAddress, setDAOAddress] = useState(false);
    const [routerAddress, setRouterAddress] = useState(false);

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

    const changeDAOAddress = (e) => {
        setDAOAddress(e.target.value)
    }

    const changeRouterAddress = (e) => {
        setRouterAddress(e.target.value)
    }

    const listAsset = async () => {
        console.log('listAsset')
        let contract = getSpartaContract()
        let tx = await contract.methods.listAssetWithClaim(asset, maxClaim, claimRate).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
    }
    const listDAO = async () => {
        console.log('listDAO')
        let contract = getSpartaContract()
        let tx = await contract.methods.changeDAO(daoAddress).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
    }
    const listRouter = async () => {
        console.log('listRouter')
        let contract = getDaoContract()
        let tx = await contract.methods.setGenesisRouter(routerAddress).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
    }

    const indentStyles = {
        marginLeft: 100,
        marginRight: 100,
    }

    return (
        <div>
            <H1>DAO</H1>
            <p>The Spartan DAO can govern the contract.</p>
            <Row style={indentStyles}>
                <Col xs={24}>
                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row>
                                <Col xs={24}>
                                    <h2>LIST ASSET IN SPARTA</h2>
                                    <Input onChange={changeAsset}
                                        placeholder={'Enter BEP2E Asset Address'}
                                        allowClear={true}></Input>
                                    <Input onChange={changeMaxClaim}
                                        placeholder={'Enter Max Claim'}
                                        allowClear={true}></Input>
                                    <Input onChange={changeClaimRate}
                                        placeholder={'Enter Claim Rate'}
                                        allowClear={true}></Input>
                                        <br />
                                    <Button onClick={listAsset}  type={'primary'} style={{marginTop:10, float:"right"}}>LIST ASSET</Button>
                                </Col>
                            </Row>
                            <br /><br />
                            <Row>
                                <Col xs={24}>
                                    <h2>LIST DAO IN SPARTA</h2>
                                    <Input onChange={changeDAOAddress}
                                        placeholder={'Enter BEP2E Asset Address'}
                                        allowClear={true}></Input>
                                        <br />
                                    <Button onClick={listDAO}  type={'primary'} style={{marginTop:10, float:"right"}}>LIST DAO</Button>
                                </Col>
                            </Row>
                            <br /><br />
                            <Row>
                                <Col xs={24}>
                                    <h2>LIST ROUTER IN DAO</h2>
                                    <Input onChange={changeRouterAddress}
                                        placeholder={'Enter BEP2E Asset Address'}
                                        allowClear={true}></Input>
                                        <br />
                                    <Button onClick={listRouter} type={'primary'} style={{marginTop:10, float:"right"}}>LIST ROUTER</Button>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    )

}

export default DAO
