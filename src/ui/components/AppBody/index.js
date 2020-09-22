import { Container } from '../../layout/theme/components'
import SVGArrowDown from '../../../assets/svg/SVGArrowDown'

import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../../context'
import { LoadingOutlined } from '@ant-design/icons';
import { SPARTA_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getTokenData } from '../../../client/web3'
import { message, Tabs, Row } from 'antd';
import { bn, formatBN, convertFromWei, convertToWei, formatUSD } from '../../../utils'
import { getSwapOutput, getSwapSlip } from '../../../math'
import { Center } from '../elements';

const { TabPane } = Tabs;
var utils = require('ethers').utils;

const AppBody = (props) => {

    const context = useContext(Context)
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
        const approval = await contract.methods.allowance(context.walletData.address, SPARTA_ADDR).call()
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
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
    }

    const swap = async () => {
        setStartTx(true)
        let contract = getSpartaContract()
        await contract.methods.upgrade(tokenTo).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }


    return (
        <div>
            <br /><br /><br /><br /><br /><br />
            <Center>
                <img src='favicon.png' />
            </Center>
            <br /><br /><br /><br /><br /> 
            <br /><br />
            <div class='outerContainer'>
                <Container>



                    <div class='container2'>
                        <Container>
                            <h1>&nbsp; Input</h1>
                            <div class='textBox'>
                                <input onChange={changeToken} placeholder={'   Enter BEP2E Asset Address'}></input>
                            </div>
                            <h4>&nbsp; Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                        </Container>
                    </div>
                    <div class='arrow'>
                        <SVGArrowDown />
                    </div>
                    <br />
                    <div class='container2'>
                        <Container>
                            <h1>&nbsp; Output</h1>
                            <div class='textBox'>
                                <input onChange={changeToken}  placeholder={'  Enter BEP2E Asset Address'}></input>
                            </div>
                            <h4>&nbsp; Output: {utils.formatEther(swapData.output, { commify: true })}</h4>
                        </Container>
                    </div>
                    <h4>&nbsp; Slippage: {swapData.slip}%</h4>
                </Container>
                <br /><br />
                {
                    !approval &&
                    <button1 onClick={approve}>APPROVE</button1>
                }
                {
                    approval && !startTx &&
                    <button1 onClick={swap}>UPGRADE</button1>
                }
                {
                    approval && startTx && !endTx &&
                    <button1 onClick={swap}>UPGRADE</button1>
                }
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
        
    )
}
export default AppBody




