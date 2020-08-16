import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col, Divider, Tabs, Input, Form } from 'antd';

import { BreadcrumbCombo, InputPane, PercentButtonRow, InputPaneStatic, CDPPane, OutputPane } from '../components/common'
import '../../App.css';
import { Center, HR, Text, Label, LabelGroup } from '../components/elements';
import { paneStyles, colStyles, rowStyles } from '../components/styles'
import { formatBN, convertFromWei, convertToWei, ETH_ADDRESS, BASE_ADDRESS, formatUSD, bn } from '../../utils'
import { getSwapOutput, getSwapSlip, getDoubleSwapOutput, getDoubleSwapSlip, getMAXMINT } from '../../math'
import { getPoolData, filterTokensByPoolSelection } from '../../client/web3_old'
import { getWalletData, getAccountCDP, getTokenSymbol, getContract, getWalletTokenData, getContractAddrs } from '../../client/web3'
import { symbol } from 'prop-types';

const { TabPane } = Tabs;
const ManageCDP = (props) => {

    const context = useContext(Context)

    useEffect(() => {
        getData()
    }, [context.accountCDP])

    useEffect(() => {
        getData()
    }, [context.transaction])

    const getData = async () => {
        if (!context.accountCDP) {
            const address = context.wallet?.address
            context.setContext({ accountCDP: await getAccountCDP(address) })
        }

        context.setContext({ mainPool: await getPoolData(ETH_ADDRESS) })

    }



    return (
        <div>
            <BreadcrumbCombo title={'Manage CDP'} parent={'CDPs'} link={'/cdps'} child={'Manage CDP'}></BreadcrumbCombo>
            <br />
            <div style={{ marginTop: '-30px' }}>
                <CDPDETAILS />
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Add Collateral" key="1">
                    <AddCollateralTab />
                </TabPane>
                <TabPane tab="Close Debt" key="2">
                    <CloseDebtTab/>
                </TabPane>
                <TabPane tab="Remint MAI" key="3">
                    <RemintTab />
                </TabPane>
            </Tabs>

        </div>
    )
}

export default ManageCDP

export const CDPDETAILS = () => {
    const context = useContext(Context)
    useEffect(() => {

    }, [context.accountCDP])

    return (<div>
        <Center>
            <Row>
                <CDPPane
                    name={"Collateral"}
                    symbol={"ETH"}
                    balance={context.accountCDP?.collateral}
                />
                <CDPPane
                    name={"Debt"}
                    symbol={"MAI"}
                    balance={context.accountCDP?.debt}
                />
            </Row>
        </Center>
    </div>)

}
export const AddCollateralTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)

    const [addCollateralData, setAddCollateralData] = useState({
        address: context.ETHData?.address,
        symbol: context.ETHData?.symbol,
        balance: context.ETHData?.balance,
        collateral: context.accountCDP?.collateral,
        input: 0
    })
    const [mainPool, setMainPool] = useState({
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        depth: context.mainPool?.depth,
        balance: context.mainPool?.balance,
    })
    useEffect(() => {
        getData()
    }, [context.ETHData])

    useEffect(() => {
        getData()
    }, [context.transaction])



    const getData = async () => {
        const address = context.wallet?.address
        context.setContext({ accountCDP: await getAccountCDP(address) })
        setAddCollateralData(getCollateralData(context.ETHData?.balance, context.ETHData?.address))
        setMainPool({
            symbol: context.mainPool?.symbol,
            address: context.mainPool?.address,
            depth: context.mainPool?.depth,
            balance: context.mainPool?.balance
        })
        setAccount(address)

    }

    const getCollateralData = (input, inputAddress) => {
        const balance = context.ETHData?.balance
        const symbol = context.ETHData?.symbol
        const collateral = parseInt(context.accountCDP?.collateral) + parseInt(input)
        const CollateralData = {
            address: inputAddress,
            symbol: symbol,
            balance: balance,
            collateral: collateral,
            input: input,
        }
        return CollateralData
    }
    const onAddCollateralChange = (e) => {
        const input = e.target.value
        setAddCollateralData(getCollateralData(convertToWei(input), context.ETHData?.address))


    }
    const addCollateral = async () => {
        const contract = getContract(0)
        const amount = addCollateralData.input
        const tx = await contract.methods.addCollateralToCDP().send({ from: account, value: amount })
        context.setContext({ transaction: tx })
    }
    const changeAddCollateralAmount = (amount) => {
        const finalAmt = (amount * addCollateralData?.balance) / 100
        setAddCollateralData(getCollateralData(finalAmt, context.ETHData?.address))
    }


    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
                <Row >
                    <Col xs={8}></Col>
                    <Col xs={8}>
                        <InputPaneStatic
                            tokenSymbol={addCollateralData}
                            paneData={addCollateralData}
                            onInputChange={onAddCollateralChange}
                            changeAmount={changeAddCollateralAmount} />
                        <br />
                    </Col>
                    <Col xs={8}>
                    </Col>
                </Row>
                <Row style={rowStyles}>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(addCollateralData.collateral)}`} label={'ESTIMATED TOTAL COLLATERAL'} /></Center>
                    </Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(parseInt(getMAXMINT(addCollateralData.collateral, mainPool, 101)) - parseInt(context.accountCDP?.debt))}`} label={'ESTIMATED MAX MINTABLE'} /></Center>
                    </Col>
                    <Col xs={6}></Col>
                </Row>
                <br></br>
                <Center><Button onClick={addCollateral} type={'primary'}>Add Collateral</Button></Center>

            </Col>
        </Row>
    </div>)

}

export const RemintTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    const [setCR, setCollaterisation] = useState('150')
    const [contractAddr, setContractAddr] = useState(null)
    useEffect(() => {
        getData()
    }, [context.transaction])

    const getData = async () => {
        const address = context.wallet?.address
        context.setContext({ accountCDP: await getAccountCDP(address) })
        setAccount(address)
        setContractAddr(context.contractAddr)

    }

    const onRatioAmountChange = e => {
        setCollaterisation(e.target.value)
    }

    const remintTOKEN = async () => {
        const contract = getContract(0)
        const collateralisation = setCR
        const tx = await contract.methods.remintMAIFromCDP(collateralisation).send({from: account, to: contractAddr})
        console.log(tx)
        context.setContext({ transaction: tx })
    }


    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
                <Row style={rowStyles}>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(context.accountCDP?.collateral)}`} label={'COLLATERAL'} /></Center>
                    </Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(parseInt(getMAXMINT(context.accountCDP?.collateral, context.mainPool, 102)) - parseInt(context.accountCDP?.debt))}`} label={'MAX MINTABLE'} /></Center>
                    </Col>
                    <Col xs={6}></Col>
                </Row>
                <br />
                <Row>
                    <Col xs={6}></Col>
                    <Col xs={10}>
                        <Form>
                            <Form.Item label="Collaterisation" >
                                <Input size={'medium'} allowClear onChange={onRatioAmountChange} placeholder={'Minimum 102% - Default 150%'} />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col xs={6}>
                    </Col>
                </Row>

                <Row style={rowStyles}>
                    
                    <Col xs={24}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(getMAXMINT(context.accountCDP?.collateral, context.mainPool, setCR))}`} label={'ESTIMATED FINAL DEBT'} /></Center>
                    </Col>
                    
                </Row>
                <br></br>
                <Center><Button onClick={remintTOKEN} type={'primary'}>MINT MAI </Button></Center>
            </Col>
        </Row>
    </div>)

}

export const CloseDebtTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    const [contractAddr, setContractAddr] = useState(null)
    //const [closeDebt, setCloseDebt] = useState(null)

    const [closeDebtData, setCloseDebtData] = useState({
        symbol: context.BASEData?.symbol,
        balance: context.BASEData?.balance,
        debt: context.accountCDP?.debt,
        input: 50
    })
    // const [mainPool, setMainPool] = useState({
    //     symbol: 'ETH',
    //     address: '0x0000000000000000000000000000000000000000',
    //     depth: context.mainPool?.depth,
    //     balance: context.mainPool?.balance,
    // })
    useEffect(() => {
        getData()
    }, [context.BASEData])

    useEffect(() => {
        getData()
    }, [context.transaction])

    const getData = async () => {
        const address = context.wallet?.address
        context.setContext({ accountCDP: await getAccountCDP(address) })
        setCloseDebtData(getDebtData(50))
        setContractAddr(context.contractAddr)
        // setMainPool({
        //     symbol: context.mainPool?.symbol,
        //     address: context.mainPool?.address,
        //     depth: context.mainPool?.depth,
        //     balance: context.mainPool?.balance
        // })
        setAccount(address)

    }

    const getDebtData = (input) => {
        const balance = context.BASEData?.balance
        const symbol = context.BASEData?.symbol
        const debt = (input * context.accountCDP?.debt)/100
        const DebtData = {
            symbol: symbol,
            balance: balance,
            debt: debt,
            input: input,
        }
        return DebtData
    }
    const onAddDebtChange = (e) => {
        const input = e.target.value
        setCloseDebtData(getDebtData(input))


    }
    const closeDebt = async () => {
        const contract = getContract(0)
        const liquidation = (closeDebtData.input *100)
        const tx = await contract.methods.closeCDP(liquidation).send({ from: account, to: contractAddr })
        console.log(tx)
        context.setContext({ transaction: tx })
    }
    const changeCloseDebtAmount = (amount) => {
        //const finalAmt = (amount * closeDebtData?.balance) / 100
        setCloseDebtData(getDebtData(amount, context.BASEData?.address))
    }
const precise = (x) => {
    return Number.parseFloat(x).toPrecision(3);
  }



    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
            <Row style={rowStyles}>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${precise(convertFromWei((context.accountCDP?.collateral)*closeDebtData.input)/100)}`} label={'ESTIMATED COLLATERAL RECIEVING'} /></Center>
                    </Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${precise(convertFromWei((context.accountCDP?.debt)*closeDebtData.input)/100)}`} label={'ESTIMATED DEBT SENDING'} /></Center>
                    </Col>
                    <Col xs={6}></Col>
                </Row>
                <br/>
                <Row >
                <Col xs={6}></Col>
                    <Col xs={10}>
                     <Form>
                            <Form.Item label="Closing Amount %" >
                                <Input size={'medium'} allowClear onChange={onAddDebtChange} placeholder={closeDebtData.input} />
                            </Form.Item>

                           <Center> <PercentButtonRow changeAmount={changeCloseDebtAmount} /></Center>
                        </Form>
                        <br />
                    </Col>
                    <Col xs={6}></Col>
                   
                </Row>
                <Row style={rowStyles}>
                    
                    <Col xs={24}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(parseInt(context.accountCDP?.debt)-parseInt(closeDebtData.debt))}`} label={'ESTIMATED REMAINING DEBT '} /></Center>
                    </Col>
                   
                </Row>
                <br></br>
                <Center><Button onClick={closeDebt} type={'primary'}>Close Debt</Button></Center>

            </Col>
        </Row>
    </div>)

}
