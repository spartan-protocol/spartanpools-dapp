import React, {useEffect, useState, useContext} from 'react'
import {Context} from '../context'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';

import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

import InputPane from "./InputPane";

import {OutputPane} from '../components/common'
import {bn, formatBN, convertFromWei, convertToWei} from '../utils'
import {getLiquidityUnits} from '../math'
import Breadcrumbs from "../components/Common/Breadcrumb";
import Notification from '../components/CommonForBoth/notification'

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    Alert,
} from "reactstrap";

import classnames from 'classnames';
import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract, getListedTokens,
    getPoolData, getTokenData, getTokenDetails,
    getListedPools, getPoolsData, getPool, getPoolShares, WBNB_ADDR
} from '../client/web3'
import {withNamespaces} from "react-i18next";
import PoolPaneSide from "./PoolPaneSide";


const AddLiquidity = (props) => {

    const [activeTab, setActiveTab] = useState('1');
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const context = useContext(Context)
    const [pool, setPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB_ADDR,
        'price': 0,
        'volume': 0,
        'baseAmount': 0,
        'tokenAmount': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    })

    const [userData, setUserData] = useState({
        'baseBalance': 0,
        'tokenBalance': 0,
        'address': SPARTA_ADDR,
        'symbol': 'XXX',
        'balance': 0,
        'input': 0,
    })

    const [liquidityData, setLiquidityData] = useState({
        'baseAmount': '',
        'tokenAmount': '',
    })

    const [withdrawData, setWithdrawData] = useState({
        'baseAmount': '',
        'tokenAmount': '',
    })

    const [estLiquidityUnits, setLiquidityUnits] = useState(0)
    const [approvalToken, setApprovalToken] = useState(false)
    const [approvalBase, setApprovalBase] = useState(false)
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    const [withdrawAmount, setWithdrawAmount] = useState(0)

    useEffect(() => {
        if (context.connected) {
            getPools()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getPools = async () => {
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})
        let poolArray = await getListedPools()
        context.setContext({'poolArray': poolArray})
        context.setContext({'poolsData': await getPoolsData(tokenArray)})
    }

    useEffect(() => {
        if (context.poolsData) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected, context.poolsData])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        const pool = await getPoolData(params.pool, context.poolsData)
        setPool(pool)

        const baseData = await getTokenData(SPARTA_ADDR, context.walletData)
        const tokenData = await getTokenData(pool.address, context.walletData)

        let _userData = {
            'baseBalance': baseData?.balance,
            'tokenBalance': tokenData?.balance,
            'address': tokenData?.address,
            'symbol': tokenData?.symbol,
            'balance': tokenData?.balance,
            'input': 0,
        }

        setUserData(_userData)

        console.log(baseData?.balance, tokenData?.balance)

        let liquidityData = getPairedAmount(baseData?.balance, tokenData?.balance, pool)
        setLiquidityData(liquidityData)
        const estLiquidityUnits = getLiquidityUnits(liquidityData, pool)
        setLiquidityUnits(estLiquidityUnits)

        await checkApproval(SPARTA_ADDR) ? setApprovalBase(true) : setApprovalBase(false)
        await checkApproval(pool.address) ? setApprovalToken(true) : setApprovalToken(false)

    }

    const checkApproval = async (address) => {
        console.log({address})
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            console.log("BNB")
            return true
        } else {
            const contract = getTokenContract(address)
            const approvalToken = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
            if (+approvalToken > 0) {
                return true
            } else {
                return false
            }
        }
    }

    const onAddTokenChange = async (e) => {
        const input = e.target.value
        let liquidityData = {
            baseAmount: "0",
            tokenAmount: formatBN(convertToWei(input), 0),
        }
        setLiquidityData(liquidityData)
        setLiquidityUnits(getLiquidityUnits(liquidityData, pool))
        let _userData = {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(input), 0),
        }
        setUserData(_userData)
    }

    const changeTokenAmount = async (amount) => {
        const finalAmt = (bn(userData?.tokenBalance)).times(amount).div(100)
        console.log(finalAmt, formatBN(finalAmt, 0))
        let liquidityData = {
            baseAmount: "0",
            tokenAmount: formatBN(finalAmt, 0),
        }
        setLiquidityData(liquidityData)
        setLiquidityUnits(getLiquidityUnits(liquidityData, pool))
        let _userData = {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
    }

    const onAddSymmChange = async (e) => {
        const input = e.target.value
        let liquidityData = getPairedAmount(userData.baseBalance, formatBN(convertToWei(input), 0), pool)
        setLiquidityData(liquidityData)
        setLiquidityUnits(getLiquidityUnits(liquidityData, pool))
        let _userData = {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(input), 0),
        }
        setUserData(_userData)
    }

    const changeSymmAmount = async (amount) => {
        const finalAmt = (bn(userData?.tokenBalance)).times(amount).div(100)
        console.log(finalAmt, formatBN(finalAmt, 0))
        let liquidityData = getPairedAmount(userData.baseBalance, formatBN(finalAmt, 0), pool)
        setLiquidityData(liquidityData)
        setLiquidityUnits(getLiquidityUnits(liquidityData, pool))
        let _userData = {
            'baseBalance': userData.baseBalance,
            'tokenBalance': userData.tokenBalance,
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
    }

    const getPairedAmount = (baseBalance, tokenAmount, pool) => {

        let price = pool.baseAmount / pool.tokenAmount  // 10:100 100/10 = 10
        let baseAmount = price * +tokenAmount  // 10 * 1 = 10

        let liquidityData = {
            baseAmount: "",
            tokenAmount: "",
        }

        if (baseAmount > baseBalance) {
            console.log({baseBalance})
            liquidityData.tokenAmount = (baseBalance / price)  // 5 / 10 -> 0.5
            liquidityData.baseAmount = formatBN(bn(baseBalance), 0) // 5
        } else {
            liquidityData.tokenAmount = formatBN(bn(tokenAmount), 0) // 1
            liquidityData.baseAmount = formatBN(bn(baseAmount), 0) // 10
        }

        console.log(baseBalance, tokenAmount)
        console.log(price, tokenAmount, liquidityData)

        return liquidityData
    }

    const changeWithdrawAmount = async (amount) => {
        setWithdrawAmount(amount)
        let poolShare = await getPoolShares(context.walletData.address, pool.address)
        let withdrawData = {
            'baseAmount': (+poolShare.baseAmount * amount) / 100,
            'tokenAmount': (+poolShare.tokenAmount * amount) / 100,
        }
        setWithdrawData(withdrawData)
    }

    const getEstShare = () => {
        const newUnits = (bn(estLiquidityUnits)).plus(bn(pool.units))
        const share = ((bn(estLiquidityUnits)).div(newUnits)).toFixed(2)
        return (share * 100).toFixed(2)
    }

    const unlockSparta = async () => {
        unlock(SPARTA_ADDR)
    }

    const unlockToken = async () => {
        unlock(pool.address)
    }

    const unlock = async (address) => {
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Approved')
        setNotifyType('success')
    }

    const addLiquidity = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        console.log(liquidityData.baseAmount, liquidityData.tokenAmount, pool.address)
        await contract.methods.addLiquidity(liquidityData.baseAmount, liquidityData.tokenAmount, pool.address).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
            value: pool.address === BNB_ADDR ? liquidityData.tokenAmount : 0
        })
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray)})
    }

    const removeLiquidity = async () => {
        let contract = getRouterContract()
        const tx = await contract.methods.removeLiquidity(withdrawAmount * 100, pool.address).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        console.log(tx.transactionHash)
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray)})

    }

    const updatePool = async () => {
        setPool(await getPool(pool.address))
    }

    const back = () => {
        props.history.push('/pools')
    }

    return (
        <>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <div>
                <React.Fragment>
                    <div className="page-content">
                        <Container fluid>
                            {/* Render Breadcrumb */}
                            <Breadcrumbs title={props.t("Pools")} breadcrumbItem={props.t("Join")}/>
                            <Row>
                                <Col>
                                    <button onClick={back} type="button"
                                            className="btn btn-secondary waves-effect waves-light">
                                        <i className="bx bx-arrow-back font-size-16 align-middle mr-2"></i> {props.t("Back")}
                                    </button>
                                    <br/>
                                    <br/>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <PoolPaneSide pool={pool} price={context.spartanPrice}/>
                                </Col>
                                <Col lg="6">
                                    <Card>
                                        <CardBody>
                                            <h4 className="card-title mb-4">{props.t("Add Liquidity")}</h4>
                                            <Nav pills className="bg-light rounded" role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({active: activeTab === '1'})}
                                                        onClick={() => {
                                                            toggle('1');
                                                        }}
                                                    >
                                                        {`${props.t("Add")} ${pool.symbol} + SPARTA`}
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({active: activeTab === '2'})}
                                                        onClick={() => {
                                                            toggle('2');
                                                        }}
                                                    >
                                                        {`${props.t("Add")} ${pool.symbol}`}
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({active: activeTab === '3'})}
                                                        onClick={() => {
                                                            toggle('3');
                                                        }}
                                                    >
                                                        {`${props.t("Remove")} ${pool.symbol} + SPARTA`}
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent activeTab={activeTab} className="mt-4">
                                                <TabPane tabId="1" id="buy-tab">
                                                    <AddSymmPane
                                                        pool={pool}
                                                        userData={userData}
                                                        liquidityData={liquidityData}
                                                        onAddChange={onAddSymmChange}
                                                        changeAmount={changeSymmAmount}
                                                        estLiquidityUnits={estLiquidityUnits}
                                                        getEstShare={getEstShare}
                                                        approvalBase={approvalBase}
                                                        approvalToken={approvalToken}
                                                        unlockSparta={unlockSparta}
                                                        unlockToken={unlockToken}
                                                        addLiquidity={addLiquidity}
                                                        startTx={startTx}
                                                        endTx={endTx}
                                                    />


                                                </TabPane>
                                                <TabPane tabId="2" id="sell-tab">
                                                    <AddAsymmPane
                                                        pool={pool}
                                                        userData={userData}
                                                        liquidityData={liquidityData}
                                                        onAddChange={onAddTokenChange}
                                                        changeAmount={changeTokenAmount}
                                                        estLiquidityUnits={estLiquidityUnits}
                                                        getEstShare={getEstShare}
                                                        approvalBase={approvalBase}
                                                        approvalToken={approvalToken}
                                                        unlockSparta={unlockSparta}
                                                        unlockToken={unlockToken}
                                                        addLiquidity={addLiquidity}
                                                        startTx={startTx}
                                                        endTx={endTx}
                                                    />
                                                </TabPane>
                                                <TabPane tabId="3" id="sell-tab">
                                                    <RemoveLiquidityPane
                                                        pool={pool}
                                                        changeWithdrawAmount={changeWithdrawAmount}
                                                        approvalToken={approvalToken}
                                                        unlock={unlockToken}
                                                        removeLiquidity={removeLiquidity}
                                                        withdrawData={withdrawData}
                                                        startTx={startTx}
                                                        endTx={endTx}
                                                    />
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>
                        </Container>
                    </div>
                </React.Fragment>
            </div>
        </>
    )
};


const AddSymmPane = (props) => {

    return (
        <>
            <InputPane
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
            />
            <br/>
            <PlusOutlined style={{fontSize: 24}}/>
            <br/>
            <br/>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Estimated Units</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{convertFromWei(props.estLiquidityUnits.toFixed(0))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Estimated Share</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{`${props.getEstShare()}%`}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0 text-left">Paired Amount (SPARTA)</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h2 className="mb-0">{convertFromWei(props.liquidityData.baseAmount)}</h2>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <Col xs={12}>
                {!props.approvalToken &&
                <button color="success" type="button"
                        className="btn btn-success btn-lg btn-block waves-effect waves-light"
                        onClick={props.unlockToken}>
                    <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Unlock {props.pool.symbol}
                </button>
                }
            </Col>
            <Col xs={12}>
                <br/>
                {!props.approvalBase &&
                <button color="success" type="button"
                        className="btn btn-success btn-lg btn-block waves-effect waves-light"
                        onClick={props.unlockSparta}>
                    <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Unlock SPARTA</button>
                }
            </Col>
            <Col xs={8}>
                {props.approvalBase && props.approvalToken && props.startTx && !props.endTx &&
                <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.addLiquidity} icon={<LoadingOutlined/>}>ADD TO
                    POOL</div>
                }
                {props.approvalBase && props.approvalToken && !props.startTx &&
                <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.addLiquidity}>ADD TO POOL</div>
                }
            </Col>


        </>
    )
};


export default withRouter(withNamespaces()(AddLiquidity));

const AddAsymmPane = (props) => {

    return (
        <>
            <Alert color="info">
                Please ensure you understand the risks related to asymmetric staking of assets! If in doubt, research
                “impermanent loss”
            </Alert>
            <br/>
            <InputPane
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
            />
            <br/>
            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated Units</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{convertFromWei(props.estLiquidityUnits.toFixed(0))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated Share</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{`${props.getEstShare()}%`}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Row>
                <Col xs={12}>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    {!props.approvalToken &&
                    <button color="success" type="button"
                            className="btn btn-success btn-lg btn-block waves-effect waves-light"
                            onClick={props.unlockToken}>
                        <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Unlock {props.pool.symbol}
                    </button>
                    }
                </Col>
                <Col xs={12}>
                    {props.approvalBase && props.approvalToken && props.startTx && !props.endTx &&
                    <div className="btn primary" onClick={props.addLiquidity} icon={<LoadingOutlined/>}>ADD TO
                        POOL</div>
                    }
                    {props.approvalBase && props.approvalToken && !props.startTx &&
                    <div className="btn primary" onClick={props.addLiquidity}>ADD TO POOL</div>
                    }
                </Col>

            </Row>

        </>
    )
}

const RemoveLiquidityPane = (props) => {

    return (
        <>

            <OutputPane changeAmount={props.changeWithdrawAmount}/>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{convertFromWei(props.withdrawData.tokenAmount)}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated SPARTA</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{convertFromWei(props.withdrawData.baseAmount)}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <br/>
            {!props.approvalToken &&
            <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light"
                    onClick={props.removeLiquidity}>
                <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Withdraw From
                Pool {props.pool.symbol}</button>
            }
        </>
    )
}