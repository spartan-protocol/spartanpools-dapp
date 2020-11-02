import React, {useEffect, useState, useContext} from 'react'
import {Context} from '../context'

import {withNamespaces} from 'react-i18next';
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import TradePane from "../components/Sections/TradePane";

import PoolPaneSide from '../components/Sections/PoolPaneSide';


import {bn, formatBN, convertToWei} from '../utils'
import {getSwapFee, getSwapOutput, getSwapSlip, getActualSwapSlip, getEstRate} from '../math'

import Notification from '../components/Common/notification'

import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract,
    getPoolData, getNewTokenData, getTokenDetails,
    getPool, WBNB_ADDR
} from '../client/web3'

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    Media,
    Col,
    Row,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroup,
    InputGroupAddon
} from "reactstrap";

import classnames from 'classnames';
import Breadcrumbs from "../components/Common/Breadcrumb";

import {InputPane} from "../components/Sections/InputPane";

const NewSwap = (props) => {

    const [activeTab, setActiveTab] = useState('1');
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    
    const context = useContext(Context)
    const [poolURL, setPoolURL] = useState('')
    const [pool, setPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': 'XXX',
        'price': 0,
        'volume': 0,
        'baseAmount': 0,
        'tokenAmount': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    });

    const [inputTokenData, setInputTokenData] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'balance': 0,
        'address': SPARTA_ADDR
    });
    const [outputTokenData, setOutputTokenData] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'balance': 0,
        'address': BNB_ADDR
    });

    const [buyData, setBuyData] = useState({
        address: SPARTA_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0,
        actualSlip: 0,
        fee: 0,
        estRate: 0
    });
    const [sellData, setSellData] = useState({
        address: BNB_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0,
        actualSlip: 0,
        fee: 0,
        estRate: 0
    });

    const [approval, setApproval] = useState(false)
    const [approvalS, setApprovalS] = useState(false)
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    useEffect(() => {
        if (context.poolsData) {
            getData()
            return function cleanup() {
                getData()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected, context.poolsData])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        if (params.pool !== undefined) {
            setPoolURL(params.pool)
            console.log(params.pool)
            const pool = await getPoolData(params.pool, context.poolsData)
            setPool(pool)

            const inputTokenData = await getNewTokenData(SPARTA_ADDR, context.account)
            const outputTokenData = await getNewTokenData(pool.address, context.account)
            setInputTokenData(inputTokenData)
            setOutputTokenData(outputTokenData)

            setBuyData(await getSwapData(inputTokenData?.balance, inputTokenData, outputTokenData, pool, false))
            setSellData(await getSwapData(outputTokenData?.balance, outputTokenData, inputTokenData, pool, true))

            await checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false)
            await checkApproval(pool.address) ? setApproval(true) : setApproval(false)

            // console.log(await checkApproval(SPARTA_ADDR))
        }
    };

    // MAKE SURE THESE ARE ALL VISIBLE TO USER:
    // SWAP FEE | ACTUAL SLIP | SPOT RATE | OUTPUT | INPUT

    // ACTUAL SLIP ALGO -> {props.tradeData.actualSlip}
    // SLIP = (( X / ( y / x )) - 1)
    // X = {pool.price} SPOT RATE
    // y = {output} OUTPUT
    // x = {input} INPUT

    // SWAP FEE ALGO -> {props.tradeData.fee}
    // FEE = (x * x * Y) / (x + X)^2
    // x = {input} INPUT
    // Y = {pool.baseAmount} SPARTA AMOUNT IN POOL
    // X = {pool.tokenAmount} TOKEN AMOUNT IN POOL

    const getSwapData = async (input, inputTokenData, outputTokenData, poolData, toBase) => {

        var output;
        var slip
        var fee
        var actualSlip
        var estRate
        output = getSwapOutput(input, poolData, toBase)
        slip = getSwapSlip(input, poolData, toBase)
        //console.log(formatBN(output), formatBN(slip))
        fee = getSwapFee(input, poolData, toBase)
        actualSlip = getActualSwapSlip(poolData, output, input, toBase)
        estRate = getEstRate(output, input, toBase)
        //console.log(formatBN(fee), formatBN(actualSlip))

        const swapData = {
            address: poolData.address,
            balance: inputTokenData?.balance,
            input: formatBN(bn(input), 0),
            symbol: inputTokenData?.symbol,
            output: formatBN(output, 0),
            outputSymbol: outputTokenData?.symbol,
            slip: formatBN(slip),
            fee: formatBN(fee),
            actualSlip: formatBN(actualSlip),
            estRate: formatBN(estRate),
        };
        //console.log(swapData)
        return swapData
    };

    const checkApproval = async (address) => {
        //console.log({address})
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            //console.log("BNB")
            return true
        } else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.account, ROUTER_ADDR).call()
            if (+approval > 0) {
                return true
            } else {
                return false
            }
        }
    }

    const onBuyChange = async (e) => {
        setBuyData(await getSwapData(convertToWei(e.target.value), inputTokenData, outputTokenData, pool, false))
    };

    const changeBuyAmount = async (amount) => {
        const finalAmt = (amount * buyData?.balance) / 100
        setBuyData(await getSwapData(finalAmt, inputTokenData, outputTokenData, pool, false))
    };

    const onSellChange = async (e) => {
        setSellData(await getSwapData(convertToWei(e.target.value), outputTokenData, inputTokenData, pool, true))
    };

    const changeSellAmount = async (amount) => {
        const finalAmt = (amount * sellData?.balance) / 100
        setSellData(await getSwapData(finalAmt, outputTokenData, inputTokenData, pool, true))
    };

    const unlockSparta = async () => {
        unlock(SPARTA_ADDR)
    };

    const unlockToken = async () => {
        unlock(pool.address)
    };

    const unlock = async (address) => {
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Approved!')
        setNotifyType('success')
        await checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false)
        await checkApproval(pool.address) ? setApproval(true) : setApproval(false)
    };

    const buy = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        //console.log(buyData.input, outputTokenData.symbol, poolURL)
        await contract.methods.swap(buyData.input, SPARTA_ADDR, poolURL).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray)})
    };

    const sell = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        //console.log(sellData.input, outputTokenData.symbol, poolURL)
        await contract.methods.swap(sellData.input, poolURL, SPARTA_ADDR).send({
            from: context.account,
            gasPrice: '',
            gas: '',
            value: pool.address === BNB_ADDR ? sellData.input : 0
        })
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray)})
    };

    const updatePool = async () => {
        setPool(await getPool(pool.address))
    };


    return (
        <>
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumb */}
                        <Breadcrumbs title="Pools" breadcrumbItem="Swap"/>
                        <Row>

                            <Col lg="6">
                                {pool &&
                                    <Card>
                                        <CardBody>
                                            <div className="float-right">
                                                <Dropdown>
                                                    <DropdownToggle type="button" tag="button" className="btn btn-light">
                                                        <i className="mdi mdi-wallet mr-1"></i>
                                                        <span className="d-none d-sm-inline-block ml-1">Wallet Balance <i
                                                            className="mdi mdi-chevron-down"></i></span>
                                                    </DropdownToggle>
                                                    <DropdownMenu right className="dropdown-menu-md">
                                                        <div className="dropdown-item-text">
                                                            <div>
                                                                <p className="text-muted mb-2">X</p>
                                                                <h5 className="mb-0">XX</h5>
                                                            </div>
                                                        </div>

                                                        <DropdownItem divider/>

                                                        <DropdownItem href="#">
                                                            BTC : <span className="float-right">1.02356</span>
                                                        </DropdownItem>
                                                        <DropdownItem href="#">
                                                            ETH : <span className="float-right">0.04121</span>
                                                        </DropdownItem>
                                                        <DropdownItem href="#">
                                                            LTC : <span className="float-right">0.00356</span>
                                                        </DropdownItem>

                                                        <DropdownItem divider/>

                                                        <DropdownItem className="text-primary text-center" href="#">
                                                            Learn more
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>

                                            <h1 className="display-4">{props.t("Swap")}</h1>
                                            <br/>
                                            <div className="crypto-buy-sell-nav">
                                                <Nav tabs className="nav-tabs-custom" role="tablist">
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({active: activeTab === '1'})}
                                                            onClick={() => {
                                                                toggle('1');
                                                            }}
                                                        >
                                                            {props.t("BUY")} {pool.symbol}
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({active: activeTab === '2'})}
                                                            onClick={() => {
                                                                toggle('2');
                                                            }}
                                                        >
                                                            {props.t("SELL")} {pool.symbol}
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={activeTab} className="crypto-buy-sell-nav-content p-4">
                                                    <TabPane tabId="1" id="buy">
                                                        <TabPane tab={`BUY ${pool.symbol}`} key="1">
                                                            <TradePane
                                                                pool={pool}
                                                                tradeData={buyData}
                                                                onTradeChange={onBuyChange}
                                                                changeTradeAmount={changeBuyAmount}
                                                                approval={approvalS}
                                                                unlock={unlockSparta}
                                                                trade={buy}
                                                                startTx={startTx}
                                                                endTx={endTx}
                                                                type={"Buy"}
                                                            />
                                                        </TabPane>
                                                    </TabPane>
                                                    <TabPane tabId="2" id="sell-tab">
                                                        <TabPane tab={`SELL ${pool.symbol}`} key="2">

                                                        </TabPane>
                                                    </TabPane>
                                                </TabContent>
                                            </div>
                                        </CardBody>
                                    </Card>
                                }
                            </Col>
                            <Col lg="4">
                                <PoolPaneSide pool={pool} price={context.spartanPrice}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        </>
    )
};




export default withRouter(withNamespaces()(NewSwap));