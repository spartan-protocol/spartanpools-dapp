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
    Nav, NavItem, NavLink,
    TabContent, TabPane,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";

import classnames from 'classnames';
import Breadcrumbs from "../components/Common/Breadcrumb";
import {manageBodyClass} from "../components/common";

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
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    useEffect(() => {
        checkPoolReady()
    // eslint-disable-next-line
    }, []);

      const checkPoolReady = async () => {
        let params = queryString.parse(props.location.search)
        if (context.poolsData && context.poolsDataLoading !== true) {
            var existsInPoolsData = await context.poolsData.some(e => (e.address === params.pool))
            if (existsInPoolsData === true) {
                await getData()
            }
            else {
                await checkPoolReady()
            }
        }
    }

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        if (params.pool !== undefined) {
            setPoolURL(params.pool)
            //console.log(params.pool)
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
        await checkApproval(SPARTA_ADDR) ? setApprovalS(true) : setApprovalS(false)
        await checkApproval(pool.address) ? setApproval(true) : setApproval(false)

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
                                        <CardBody>
                                            <Link to='/pools'>
                                                <button type="button" tag="button" className="btn btn-light">
                                                    <i className="bx bx-arrow-back font-size-20 align-middle mr-2"/> Back to Liquidity Pools
                                                </button>
                                            </Link>
                                            <div className="float-right mr-2">
                                                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                    <DropdownToggle type="button" tag="button" className="btn btn-light">
                                                        <i className="mdi mdi-wallet mr-1"/>
                                                        <span className="d-none d-sm-inline-block ml-1">Balance <i className="mdi mdi-chevron-down"/></span>
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
                                            <br/><br/>
                                            <div className="crypto-buy-sell-nav">
                                                <Nav tabs className="nav-tabs-custom" role="tablist">
                                                    <NavItem className="text-center w-50">
                                                        <NavLink className={classnames({active: activeTab === '1'})} onClick={() => {toggle('1');}}>
                                                            <i className="bx bxs-chevron-down mr-1 bx-sm"/>
                                                            <br/>{props.t("BUY")} {pool.symbol}
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem className="text-center w-50">
                                                        <NavLink className={classnames({active: activeTab === '2'})} onClick={() => {toggle('2');}}>
                                                            <i className="bx bxs-chevron-up mr-1 bx-sm"/>
                                                            <br/>{props.t("SELL")} {pool.symbol}
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
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
                                                            type={"Buy"}/>
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