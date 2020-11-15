import React, {useEffect, useState, useContext} from 'react'
import {Context} from '../context'

import {withNamespaces} from 'react-i18next';
import {withRouter, Link} from 'react-router-dom';
import queryString from 'query-string';
import TradePaneBuy from "../components/Sections/TradePaneBuy";

import PoolPaneSide from '../components/Sections/PoolPaneSide';

import {bn, formatBN, convertToWei, formatAllUnits, convertFromWei} from '../utils'
import {getSwapFee, getSwapOutput, getSwapSlip, getActualSwapSlip, getEstRate} from '../math'

import Notification from '../components/Common/notification'

import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract,
    getPoolData, getNewTokenData,
    getPool, WBNB_ADDR, updateWalletData,
} from '../client/web3'

import {
    Card, CardBody,
    Col, Row, Container,
    TabContent, TabPane,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";

import Breadcrumbs from "../components/Common/Breadcrumb";
import {manageBodyClass} from "../components/common";

const NewSwap = (props) => {

    const context = useContext(Context);

    const [activeTab, setActiveTab] = useState('1');
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    const toggleTab = () => {
        if (activeTab === '1') {setActiveTab('2')}
        else {setActiveTab('1')}
    }
    
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
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    useEffect(() => {
        checkPoolReady()
    // eslint-disable-next-line
    }, [context.poolsData])

    useEffect(() => {
        if (context.poolsDataComplete === true) {
            getData()
        }
    // eslint-disable-next-line
    }, [context.walletData])

    const checkPoolReady = async () => {
        let params = queryString.parse(props.location.search)
        if (context.poolsData) {
            var existsInPoolsData = await context.poolsData.some(e => (e.address === params.pool))
            if (existsInPoolsData === true) {
                getData()
            }
            else {
                await pause(3000)
                checkPoolReady()
            }
        }
        else {
            await pause(3000)
            checkPoolReady()
        }
    }

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        if (params.pool !== undefined) {
            setPoolURL(params.pool)
            //console.log(params.pool)
            const pool = await getPoolData(params.pool, context.poolsData)
            setPool(pool)

            let data = await Promise.all([getNewTokenData(SPARTA_ADDR, context.account), getNewTokenData(pool.address, context.account)])
            const inputTokenData = data[0]
            const outputTokenData = data[1]
            setInputTokenData(inputTokenData)
            setOutputTokenData(outputTokenData)

            const buyInitInput = (inputTokenData?.balance * 1) / 100
            const sellInitInput = (outputTokenData?.balance * 1) / 100

            data = await Promise.all([getSwapData(buyInitInput, inputTokenData, outputTokenData, pool, false), getSwapData(sellInitInput, outputTokenData, inputTokenData, pool, true)])
            const tempBuyData = data[0]
            const tempSellData = data[1]
            setBuyData(tempBuyData)
            setSellData(tempSellData)

            await Promise.all([checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false), checkApproval(pool.address) ? setApproval(true) : setApproval(false)])
        }
    }

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
            outputBalance: outputTokenData?.balance,
            slip: slip,
            fee: formatBN(fee),
            actualSlip: actualSlip,
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
        
        await Promise.all([checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false), checkApproval(pool.address) ? setApproval(true) : setApproval(false)])

        if (context.walletDataLoading !== true) {
            // Refresh BNB balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
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
    };

    const updatePool = async () => {
        setPool(await getPool(pool.address))
        if (context.walletDataLoading !== true) {
            // Refresh BNB balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
            // Refresh SPARTA balance
            context.setContext({'walletDataLoading': true})
            walletData = await updateWalletData(context.account, context.walletData, SPARTA_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
            // Refresh TOKEN balance
            context.setContext({'walletDataLoading': true})
            walletData = await updateWalletData(context.account, context.walletData, pool.address)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const toggleRightbar = (cssClass) => {
        manageBodyClass("right-bar-enabled");
    };

    return (
        <>
            <Notification type={notifyType} message={notifyMessage}/>
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Pools" breadcrumbItem="Swap"/>
                        <Row>
                            <Col lg="6">
                                {pool &&
                                    <Card>
                                        <CardBody className='p-3 p-md-4'>
                                            <Row className='align-middle'>
                                                <Col xs={4} className='my-auto'>
                                                    <Link to='/pools'>
                                                        <button type="button" tag="button" className="btn btn-light">
                                                            <i className="bx bx-arrow-back align-middle"/> Pools <i className="bx bx-swim align-middle d-none d-sm-inline-block"/>
                                                        </button>
                                                    </Link>
                                                </Col>
                                                <Col xs={4} className='text-center my-auto'>
                                                    <h4 className='mb-0'>Swap</h4>
                                                </Col>
                                                <Col xs={4} className='my-auto'>
                                                    <div className="float-right">
                                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                            <DropdownToggle type="button" tag="button" className="btn btn-light">
                                                                <i className="bx bx-wallet align-middle d-none d-sm-inline-block"/>
                                                                <span className="ml-1">Wallet <i className="mdi mdi-chevron-down"/></span>
                                                            </DropdownToggle>
                                                            <DropdownMenu right className="dropdown-menu-md">
                                                                {pool.address !== 'XXX' &&
                                                                    <>
                                                                        <div className="dropdown-item-text">
                                                                            <div>
                                                                                <p className="text-muted mb-2">Available Balance</p>
                                                                            </div>
                                                                        </div>
                                                                        <DropdownItem divider/>
                                                                        <DropdownItem href="">
                                                                            SPARTA : <span className="float-right">{formatAllUnits(convertFromWei(buyData?.balance))}</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            {buyData.outputSymbol} : <span className="float-right">{formatAllUnits(convertFromWei(buyData?.outputBalance))}</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem divider/>
                                                                        <DropdownItem className="text-primary text-center" onClick={toggleRightbar}>
                                                                            View all assets
                                                                        </DropdownItem>
                                                                    </>
                                                                }
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <br/>
                                            <div className="crypto-buy-sell-nav">
                                                <TabContent activeTab={activeTab} className="crypto-buy-sell-nav-content p-4">
                                                    <TabPane tabId="1" id="buy">
                                                        <TradePaneBuy
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
                                                            toggleTab={toggleTab}
                                                        />
                                                    </TabPane>
                                                    <TabPane tabId="2" id="sell-tab">
                                                        <TradePaneBuy
                                                            pool={pool}
                                                            tradeData={sellData}
                                                            onTradeChange={onSellChange}
                                                            changeTradeAmount={changeSellAmount}
                                                            approval={approval}
                                                            unlock={unlockToken}
                                                            trade={sell}
                                                            startTx={startTx}
                                                            endTx={endTx}
                                                            type={"Sell"}
                                                            toggleTab={toggleTab}
                                                        />
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