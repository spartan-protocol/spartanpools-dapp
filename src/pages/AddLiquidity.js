import React, {useEffect, useState, useContext} from 'react'
import {Context} from '../context'

import {withRouter, useLocation} from 'react-router-dom';
import queryString from 'query-string';

import InputPane from "../components/Sections/InputPane";

import {OutputPane} from '../components/common'
import {bn, formatBN, convertFromWei, convertToWei, formatAllUnits} from '../utils'
import {getLiquidityUnits} from '../math'
import Breadcrumbs from "../components/Common/Breadcrumb";
import Notification from '../components/Common/notification'

import {
    Container,
    Row,
    Button,
    Col,
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    Alert,
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

import classnames from 'classnames';
import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract,
    getPoolData, getTokenData, getTokenDetails, checkArrayComplete,
    getPool, getPoolShares, WBNB_ADDR, getNextPoolsData, getNextWalletData, getNextPoolSharesData
} from '../client/web3'
import {withNamespaces} from "react-i18next";
import PoolPaneSide from "../components/Sections/PoolPaneSide"


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
        'baseAmount': '0',
        'tokenAmount': '0',
    })

    const [withdrawData, setWithdrawData] = useState({
        'baseAmount': '0',
        'tokenAmount': '0',
    })

    const [estLiquidityUnits, setLiquidityUnits] = useState(0)
    const [approvalToken, setApprovalToken] = useState(false)
    const [approvalBase, setApprovalBase] = useState(false)
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const [withdrawAmount, setWithdrawAmount] = useState(0)

    useEffect(() => {
        checkPoolReady()
        checkPoolSharesDataReady()
    // eslint-disable-next-line
      }, []);

    const checkPoolReady = async () => {
        let params = queryString.parse(props.location.search)
        if (context.poolsData && !context.poolsDataLoading) {
            var existsInPoolsData = await context.poolsData.some(e => (e.address === params.pool))
            if (existsInPoolsData === true) {
                await checkWalletReady()
            }
            else {
                await nextPoolsDataPage()
                await checkPoolReady()
            }
        }
    }

    const checkWalletReady = async () => {
        let params = queryString.parse(props.location.search)
        if (context.walletData && !context.walletDataLoading) {
            var existsInWalletData = await context.walletData.some(e => (e.address === params.pool))
            //console.log(context.walletData)
            if (existsInWalletData === true) {
                await getData()
            }
            else {
                await nextWalletDataPage()
                await checkWalletReady()
            }
        }
    }

    const checkPoolSharesDataReady = async () => {
        let pool = ''
        let params = queryString.parse(props.location.search)
        if (params.pool === BNB_ADDR) {
            pool = WBNB_ADDR
        }
        else {pool = params.pool}
        if (context.stakesData && !context.poolSharesDataLoading) {
            var existsInStakesData = await context.stakesData.some(e => (e.address === pool))
            //console.log(context.stakesData)
            if (existsInStakesData === true) {
                return
            }
            else {
                await nextPoolSharesDataPage()
                await checkPoolSharesDataReady()
            }
        }
    }

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

            //console.log(baseData?.balance, tokenData?.balance)

            let liquidityData = getPairedAmount(baseData?.balance, tokenData?.balance, pool)
            setLiquidityData(liquidityData)
            const estLiquidityUnits = getLiquidityUnits(liquidityData, pool)
            setLiquidityUnits(estLiquidityUnits)

            await checkApproval(SPARTA_ADDR) ? setApprovalBase(true) : setApprovalBase(false)
            await checkApproval(pool.address) ? setApprovalToken(true) : setApprovalToken(false)
    }

    const nextPoolsDataPage = async () => {
        if (context.poolsData && !context.poolsDataLoading) {
            var lastPage = await checkArrayComplete(context.tokenArray, context.poolsData)
            context.setContext({'poolsDataLoading': true})
            context.setContext({'poolsData': await getNextPoolsData(context.tokenArray, context.poolsData)})
            context.setContext({'poolsDataLoading': false})
            context.setContext({'poolsDataComplete': lastPage})
        }
    }

    const nextWalletDataPage = async () => {
        if (context.walletData && !context.walletDataLoading) {
            var lastPage = await checkArrayComplete(context.tokenArray, context.walletData)
            context.setContext({'walletDataLoading': true})
            context.setContext({'walletData': await getNextWalletData(context.account, context.tokenArray, context.walletData)})
            context.setContext({'walletDataLoading': false})
            context.setContext({'walletDataComplete': lastPage})
        }
      }

    const nextPoolSharesDataPage = async () => {
        if (context.stakesData && !context.poolSharesDataLoading) {
            var lastPage = await checkArrayComplete(context.tokenArray, context.stakesData)
            context.setContext({'poolSharesDataLoading': true})
            context.setContext({'stakesData': await getNextPoolSharesData(context.account, context.tokenArray, context.stakesData)})
            context.setContext({'poolSharesDataLoading': false})
            context.setContext({'poolSharesDataComplete': lastPage})
            console.log(context.stakesData)
        }
    }

    const checkApproval = async (address) => {
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            //console.log("BNB")
            return true
        } else {
            const contract = getTokenContract(address)
            const approvalToken = await contract.methods.allowance(context.account, ROUTER_ADDR).call()
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
        //console.log(finalAmt, formatBN(finalAmt, 0))
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
        //console.log(finalAmt, formatBN(finalAmt, 0))
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
            //console.log({baseBalance})
            liquidityData.tokenAmount = (baseBalance / price)  // 5 / 10 -> 0.5
            liquidityData.baseAmount = formatBN(bn(baseBalance), 0) // 5
        } else {
            liquidityData.tokenAmount = formatBN(bn(tokenAmount), 0) // 1
            liquidityData.baseAmount = formatBN(bn(baseAmount), 0) // 10
        }

        //console.log(baseBalance, tokenAmount)
        //console.log(price, tokenAmount, liquidityData)

        return liquidityData
    }

    const changeWithdrawAmount = async (amount) => {
        setWithdrawAmount(amount)
        let poolShare = await getPoolShares(context.account, pool.address)
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
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Approved')
        setNotifyType('success')
    }

    const addLiquidity = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        //console.log(liquidityData.baseAmount, liquidityData.tokenAmount, pool.address)
        await contract.methods.addLiquidity(liquidityData.baseAmount, liquidityData.tokenAmount, pool.address).send({
            from: context.account,
            gasPrice: '',
            gas: '',
            value: pool.address === BNB_ADDR ? liquidityData.tokenAmount : 0
        })
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray)})
    }

    const removeLiquidity = async () => {
        let contract = getRouterContract()
        const tx = await contract.methods.removeLiquidity(withdrawAmount * 100, pool.address).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        console.log(tx.transactionHash)
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        updatePool()
        context.setContext({'tokenDetailsArray': await getTokenDetails(context.account, context.tokenArray)})
    }

    const updatePool = async () => {
        setPool(await getPool(pool.address))
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
                            <Breadcrumbs title={props.t("Pools")} breadcrumbItem={props.t("Join")}/>
                            {context.stakesData &&
                                <Row>
                                    
                                    <Col lg="4">
                                        <PoolPaneSide pool={pool} price={context.spartanPrice} address={pool.address}/>
                                    </Col>
                                    <Col lg="6">
                                        <Card className="h-100">
                                            {pool.address !== 'XXX' &&
                                                <CardBody>
                                                    <h4 className="card-title mb-4">{props.t("Add Liquidity")}</h4>
                                                    <Nav  className="nav nav-pills nav-fill bg-light rounded" role="tablist">
                                                        <NavItem className="text-center ">
                                                            <NavLink
                                                                className={classnames({active: activeTab === '1'})}
                                                                onClick={() => {
                                                                    toggle('1');
                                                                }}
                                                            >
                                                                {`${props.t("Add")} ${pool.symbol} + SPARTA`}
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem className="text-center">
                                                            <NavLink
                                                                className={classnames({active: activeTab === '2'})}
                                                                onClick={() => {
                                                                    toggle('2');
                                                                }}
                                                            >
                                                                {`${props.t("Add")} ${pool.symbol}`}
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem className="text-center">
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
                                                                activeTab={activeTab}
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
                                                                activeTab={activeTab}
                                                            />
                                                        </TabPane>
                                                        <TabPane tabId="3" id="sell-tab">
                                                            <RemoveLiquidityPane
                                                                pool={pool}
                                                                userData={userData}
                                                                changeWithdrawAmount={changeWithdrawAmount}
                                                                approvalToken={approvalToken}
                                                                unlock={unlockToken}
                                                                removeLiquidity={removeLiquidity}
                                                                withdrawData={withdrawData}
                                                                startTx={startTx}
                                                                endTx={endTx}
                                                                location={props.location.search}
                                                            />
                                                        </TabPane>
                                                    </TabContent>
                                                </CardBody>
                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            }
                            {!context.stakesData &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                        </Container>
                    </div>
                </React.Fragment>
            </div>
        </>
    )
};


const AddSymmPane = (props) => {

    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(!showModal);

    const remainder = convertFromWei(props.userData.balance - props.userData.input)

    const checkEnoughForGas = () => {
        if (props.userData.symbol === 'BNB') { // if input Symbol is BNB
            if (remainder < 0.05) {   //if (wallet BNB balance) minus (transaction BNB amount) < 0.05
                setShowModal(true)
            }    
            else props.addLiquidity()
        }

        else {
            props.addLiquidity()
        }
    }

    return (
        <>
            <InputPane
                address={props.pool.address}
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
                activeTab={props.activeTab}
            />
            <br/>
            <div className="text-center">
            <i className="bx bx-plus"/>
            </div>
            <br/>
            <br/>
            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Estimated LP Units</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{formatAllUnits(convertFromWei(props.estLiquidityUnits))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Estimated Pool Share</p>
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
                            <h2 className="mb-0">{formatAllUnits(convertFromWei(props.liquidityData.baseAmount))}</h2>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <div className="text-center">
                <Row>
                    <Col xs={12}>
                        {!props.approvalToken &&
                        <button color="success" type="button"
                                className="btn btn-success btn-lg btn-block waves-effect waves-light"
                                onClick={props.unlockToken}>
                            <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Approve {props.pool.symbol}
                        </button>
                        }
                    </Col>
                    <Col xs={12}>
                        <br/>
                        {!props.approvalBase &&
                        <button color="success" type="button"
                                className="btn btn-success btn-lg btn-block waves-effect waves-light"
                                onClick={props.unlockSparta}>
                            <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"></i> Approve SPARTA</button>
                        }
                    </Col>
                    <Col xs={12}>
                        {props.approvalBase && props.approvalToken && props.startTx && !props.endTx &&
                        <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}><i className="bx bx-spin bx-loader"/> ADD TO
                            POOL</div>
                        }
                        {props.approvalBase && props.approvalToken && !props.startTx &&
                        <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>ADD TO POOL</div>
                        }
                    </Col>
                </Row>
            </div>

            <Modal isOpen={showModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>BNB balance will be low after this transaction!</ModalHeader>
                <ModalBody>
                    {remainder >= 0.05 &&
                        <>
                            This transaction will now leave you with (~{formatAllUnits(remainder)} BNB)<br/>
                            This is plenty of gas to interact with the BSC network.<br/>
                            If you would rather a different amount please cancel txn and manually input your amount.<br/>
                            Remember though, we recommend leaving ~0.05 BNB in your wallet for gas purposes.<br/>
                        </>
                    }
                    {remainder < 0.05 &&
                        <>
                            This transaction will leave you with a very low BNB balance (~{formatAllUnits(remainder)} BNB)<br/>
                            Please ensure you understand that BNB is used as 'gas' for the BSC network.<br/>
                            If you do not have any/enough BNB in your wallet you may not be able to transfer assets or interact with BSC DApps after this transaction.<br/>
                            Keep in mind however, gas fees are usually very low (~0.005 BNB).<br/>
                            0.05 BNB is usually enough for 10+ transactions.<br/>
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    {remainder >= 0.05 &&
                        <Button 
                        color="primary" 
                        onClick={() => {
                            toggle();
                            props.addLiquidity();
                        }}>
                            Continue Transaction!
                        </Button>
                    }
                    {remainder < 0.05 &&
                        <>
                            <Button 
                            color="primary" 
                            onClick={() => {
                                props.changeAmount((0.999 - (0.05 / convertFromWei(props.userData.balance))) * 100);
                            }}>
                                Change to ~{formatAllUnits(convertFromWei(props.userData.balance * (0.999 - (0.05 / convertFromWei(props.userData.balance)))))} BNB
                            </Button>
                            <Button 
                                color="danger" 
                                onClick={() => {
                                    toggle();
                                    props.addLiquidity();
                                }}>
                                    Continue (Might Fail!)
                            </Button>
                        </>
                    }
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </>
    )
};

export default withRouter(withNamespaces()(AddLiquidity));

const AddAsymmPane = (props) => {

    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(!showModal);

    const remainder = convertFromWei(props.userData.balance - props.userData.input)

    const checkEnoughForGas = () => {
        if (props.userData.symbol === 'BNB') { // if input Symbol is BNB
            if (remainder < 0.05) {   //if (wallet BNB balance) minus (transaction BNB amount) < 0.05
                setShowModal(true)
            }    
            else props.addLiquidity()
        }

        else {
            props.addLiquidity()
        }
    }

    return (
        <>
            <Alert color="info">
                Please ensure you understand the risks related to asymmetric staking of assets! If in doubt, research
                “impermanent loss”
            </Alert>
            <br/>
            <InputPane
                address={props.pool.address}
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
                            <p className="mb-0">Estimated LP Units</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{formatAllUnits(convertFromWei(props.estLiquidityUnits))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated Pool Share</p>
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
            <div className="text-center">
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
                                <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}><i className="bx bx-spin bx-loader"/> ADD TO POOL</div>
                            }

                            {props.approvalBase && props.approvalToken && !props.startTx &&
                                <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>ADD TO POOL</div>
                            }
                        </Col>
                </Row>
            </div>

            <Modal isOpen={showModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>BNB balance will be low after this transaction!</ModalHeader>
                <ModalBody>
                    {remainder >= 0.05 &&
                        <>
                            This transaction will now leave you with (~{formatAllUnits(remainder)} BNB)<br/>
                            This is plenty of gas to interact with the BSC network.<br/>
                            If you would rather a different amount please cancel txn and manually input your amount.<br/>
                            Remember though, we recommend leaving ~0.05 BNB in your wallet for gas purposes.<br/>
                        </>
                    }
                    {remainder < 0.05 &&
                        <>
                            This transaction will leave you with a very low BNB balance (~{formatAllUnits(remainder)} BNB)<br/>
                            Please ensure you understand that BNB is used as 'gas' for the BSC network.<br/>
                            If you do not have any/enough BNB in your wallet you may not be able to transfer assets or interact with BSC DApps after this transaction.<br/>
                            Keep in mind however, gas fees are usually very low (~0.005 BNB).<br/>
                            0.05 BNB is usually enough for 10+ transactions.<br/>
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    {remainder >= 0.05 &&
                        <Button 
                        color="primary" 
                        onClick={() => {
                            toggle();
                            props.addLiquidity();
                        }}>
                            Continue Transaction!
                        </Button>
                    }
                    {remainder < 0.05 &&
                        <>
                            <Button 
                            color="primary" 
                            onClick={() => {
                                props.changeAmount((0.999 - (0.05 / convertFromWei(props.userData.balance))) * 100);
                            }}>
                                Change to ~{formatAllUnits(convertFromWei(props.userData.balance * (0.999 - (0.05 / convertFromWei(props.userData.balance)))))} BNB
                            </Button>
                            <Button 
                                color="danger" 
                                onClick={() => {
                                    toggle();
                                    props.addLiquidity();
                                }}>
                                    Continue (Might Fail!)
                            </Button>
                        </>
                    }
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </>
    )
}

const RemoveLiquidityPane = (props) => {

    const context = useContext(Context)
    const [lockedAmnt,setLockedAmnt] = useState('')
    const [availAmnt,setAvailAmnt] = useState('')
    const [base,setBase] = useState(0)
    const [token,setToken] = useState(0)

    const location = useLocation()

    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    useEffect(() => {
        checkPoolSharesDataReady(props)
        // eslint-disable-next-line
    }, [])

    const checkPoolSharesDataReady = async (props) => {
        let pool = ''
        let params = queryString.parse(location.search)
        if (params.pool === BNB_ADDR) {
            pool = WBNB_ADDR
        }
        else {pool = params.pool}
        if (context.stakesData && !context.poolSharesDataLoading) {
            var existsInStakesData = await context.stakesData.some(e => (e.address === pool))
            //console.log(context.stakesData)
            if (existsInStakesData === true) {
                getLockedAmount(pool, props.pool)
            }
            else {
                await pause(2000)
                await checkPoolSharesDataReady()
            }
        }
    }

    const getLockedAmount = async (pool, poolData) => {
        const lockedAmount = context.stakesData.find(x => x.address === pool).locked
        const availAmount = context.stakesData.find(x => x.address === pool).units
        setLockedAmnt(lockedAmount)
        setAvailAmnt(availAmount)
        getRates(poolData, lockedAmount)
    }

    const getRates = (poolData, lockedAmount) => {
        let units = poolData.units
        let sparta = poolData.baseAmount
        let tokens = poolData.tokenAmount
        let share = lockedAmount / units
        setBase(bn(sparta) * bn(share))
        setToken(bn(tokens) * bn(share))
    }

    return (
        <>

            <OutputPane changeAmount={props.changeWithdrawAmount}/>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Avail. LP Tokens</p>
                        </td>
                        <td>
                            <h5 className="mb-0 text-right">{formatAllUnits(convertFromWei(availAmnt))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Available {props.pool.symbol}</p>
                        </td>
                        <td>
                            <h6 className="mb-0 text-right">~ {formatAllUnits(convertFromWei(props.withdrawData.tokenAmount))}</h6>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Available SPARTA</p>
                        </td>
                        <td>
                            <h6 className="mb-0 text-right">~ {formatAllUnits(convertFromWei(props.withdrawData.baseAmount))}</h6>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <div className="text-center">
                {props.approvalToken &&
                    <button
                    color="success"
                    type="button"
                    className="btn btn-success btn-lg btn-block waves-effect waves-light"
                    onClick={props.removeLiquidity}>
                        <i className="bx bx-log-in-circle font-size-20 align-middle mr-2" /> Withdraw From Pool {props.pool.symbol}
                    </button>
                }
            </div>
            <br/>
            <div>
            <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Locked LP tokens</p>
                        </td>
                        <td className='text-right'>           
                            <h5 className="mb-0">{formatAllUnits(convertFromWei(lockedAmnt))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Locked {props.pool.symbol}</p>
                        </td>
                        <td className='text-right'>        
                            <h6 className="mb-0 text-right">~ {formatAllUnits(convertFromWei(token))}</h6>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">Locked SPARTA</p>
                        </td>
                        <td>
                            <h6 className="mb-0 text-right">~ {formatAllUnits(convertFromWei(base))}</h6>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}