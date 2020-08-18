
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import axios from 'axios'

import { Button, Row, Col, message } from 'antd';
import { paneStyles, colStyles } from '../components/styles'

import ERC20 from '../../artifacts/ERC20.json'
const ERC20_ABI = ERC20.abi

const SimpleSwap = (props) => {


    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // connectWallet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        
    }

    

    const indentStyles = {
        margin: 100,
        minHeight: 400
    }

    return (
        <div>
            <Row style={indentStyles}>
                <Col xs={24}>

                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <h1>hi</h1>
                        </Col>
                    </Row>

                </Col>

            </Row>



        </div>
    )


}

export default SimpleSwap