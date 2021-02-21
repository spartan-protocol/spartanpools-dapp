import React, {useEffect, useState, useContext} from 'react'
import {Context} from '../context'

import {withRouter, useLocation, Link} from 'react-router-dom';
import queryString from 'query-string';

import InputPaneJoin from "../components/Sections/InputPaneJoin";

import {bn, formatBN, convertFromWei, convertToWei, formatAllUnits, formatGranularUnits} from '../utils'
import {getLiquidityUnits} from '../math'
import Breadcrumbs from "../components/Common/Breadcrumb";
import {manageBodyClass} from "../components/common";
import Notification from '../components/Common/notification'

import {
    Container, Row, Button, Col,
    Card, CardBody,
    Nav, NavItem, NavLink,
    TabPane, TabContent,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

import classnames from 'classnames';
import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getRouterContract, getTokenContract,
    getPoolData, getTokenData, updateSharesData, getGasPrice,
    getPool, WBNB_ADDR, updateWalletData, getBNBBalance,
} from '../client/web3'
import {withNamespaces} from "react-i18next";
import PoolPaneSide from "../components/Sections/PoolPaneSide"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";


const AddLiquidity = (props) => {

    const [activeTab, setActiveTab] = useState('1');
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    const toggleTab = tab => {
        if (activeTab !== tab) {
            clearAmounts()
            setActiveTab(tab)
        }
    };

    const context = useContext(Context)
    const [pool, setPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'decimals': 18,
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

    const [poolShare, setPoolShare] = useState({
        'address': 'XXX',
        'baseAmount': 0,
        'locked': 0,
        'name': 'XXX',
        'poolAddress': 'XXX',
        'share': 0,
        'symbol': 'XXX',
        'tokenAmount': 0,
        'units': 0,
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
        'lpAmount': '0',
    })

    const [estLiquidityUnits, setLiquidityUnits] = useState(0)
    const [approvalToken, setApprovalToken] = useState(false)
    const [approvalBase, setApprovalBase] = useState(false)
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const [withdrawAmount, setWithdrawAmount] = useState(0)

    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const [getDataCount, setGetDataCount] = useState(0)
    useEffect(() => {
        if (context.poolsData && context.walletData && context.sharesData) {
            getData()
        }
        // eslint-disable-next-line
    }, [context.poolsData, context.walletData, context.sharesData, getDataCount])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        var existsInPoolsData = await context.poolsData.some(e => (e.address === params.pool))
        var existsInWalletData = await context.walletData.some(e => (e.address === params.pool))
        let sharesPool = ''
        if (params.pool === BNB_ADDR) {sharesPool = WBNB_ADDR}
        else {sharesPool = params.pool}
        var existsInSharesData = await context.sharesData.some(e => (e.address === sharesPool))
        if (existsInPoolsData === true && existsInWalletData === true && existsInSharesData === true) {
            const tempPool = await getPoolData(params.pool, context.poolsData)
            setPool(tempPool)
            let data = await Promise.all([getTokenData(SPARTA_ADDR, context.walletData), getTokenData(tempPool.address, context.walletData)])
            const baseData = data[0]
            const tokenData = data[1]
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
            let tempSharesData = context.sharesData.find(e => (e.address === sharesPool))
            setPoolShare(tempSharesData)

            data = await Promise.all([checkApproval(SPARTA_ADDR), checkApproval(tempPool.address)])
            setApprovalBase(data[0])
            setApprovalToken(data[1])
        }
        else {
            await pause(2000)
            setGetDataCount(getDataCount + 1)
        }
    }

    const clearAmounts = async () => {
        context.setContext({'clearInputs': true})
        setLiquidityData({
            'baseAmount': '0',
            'tokenAmount': '0',
        })
        setLiquidityUnits('0')
        await pause(1)
        context.setContext({'clearInputs': false})
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

        if (bn(baseAmount).comparedTo(bn(baseBalance)) === 1) {
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

    const onWithdrawChange = async (e) => {
        const input = e.target.value
        var temp = ((bn(convertToWei(input)).div(bn(poolShare.units))).times(100)).toFixed(2)
        setWithdrawAmount(temp)
        let decDiff = 10 ** (18 - pool.decimals)
        let tokenAmnt = bn(poolShare.tokenAmount).times(decDiff)
        const percent = convertToWei(input) / +poolShare.units
        let baseAmount = bn(poolShare.baseAmount).times(percent)
        let tokenAmntFinal = +tokenAmnt * percent
        let finalLPUnits = +poolShare.units * percent
        let withdrawData = {
            'baseAmount': bn(baseAmount).comparedTo(bn(poolShare.baseAmount)) === 1 ? 0 : +baseAmount,
            'tokenAmount': bn(tokenAmntFinal).comparedTo(bn(tokenAmnt)) === 1 ? 0 : tokenAmntFinal,
            'lpAmount': bn(finalLPUnits).comparedTo(bn(poolShare.baseAmount)) === 1 ? 0 : finalLPUnits,
        }
        setWithdrawData(withdrawData)
    }

    const changeWithdrawAmount = async (amount) => {
        setWithdrawAmount(amount)
        let decDiff = 10 ** (18 - pool.decimals)
        let tokenAmnt = bn(poolShare.tokenAmount).times(decDiff).toFixed(0)
        let withdrawData = {
            'baseAmount': ((bn(poolShare.baseAmount).times(amount)).div(100)).toFixed(0),
            'tokenAmount': ((bn(tokenAmnt).times(amount)).div(100)).toFixed(0),
            'lpAmount': ((bn(poolShare.units).times(amount)).div(100)).toFixed(0),
        }
        setWithdrawData(withdrawData)
        //console.log(withdrawData)
    }

    const getEstShare = () => {
        const newUnits = (bn(estLiquidityUnits)).plus(bn(pool.units))
        const share = ((bn(estLiquidityUnits)).div(newUnits)).toFixed(18)
        return (share * 100).toFixed(4)
    }

    const unlockSparta = async () => {
        unlock(SPARTA_ADDR)
    }

    const unlockToken = async () => {
        unlock(pool.address)
    }

    const unlock = async (address) => {
        setNotifyMessage('...')
        setStartTx(true)
        setEndTx(false)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        console.log('Estimating gas', estGasPrice, supply)
        await contract.methods.approve(ROUTER_ADDR, supply).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setStartTx(false)
                setEndTx(true)
            }
            gasLimit = (Math.floor(gasAmount * 1.5)).toFixed(0)
            gasFee = (bn(gasLimit).times(bn(estGasPrice))).toFixed(0)
        })
        let enoughBNB = true
        var gasBalance = await getBNBBalance(context.account)
        if (bn(gasBalance).comparedTo(bn(gasFee)) === -1) {
            enoughBNB = false
            setNotifyMessage('You do not have enough BNB for gas fee!')
            setNotifyType('warning')
            setStartTx(false)
            setEndTx(true)
        }
        if (enoughBNB === true) {
            console.log('Approving token', estGasPrice, gasLimit, gasFee)
            await contract.methods.approve(ROUTER_ADDR, supply).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function (error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Token Approval Cancelled')
                    setNotifyType('warning')
                    setStartTx(false)
                    setEndTx(true)
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('Token Approval Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('Token Approved!')
                setNotifyType('success')
                setStartTx(false)
                setEndTx(true)
                let data = await Promise.all([checkApproval(SPARTA_ADDR), checkApproval(pool.address)])
                setApprovalBase(data[0])
                setApprovalToken(data[1])
                if (context.walletDataLoading !== true) {
                    // Refresh BNB balance
                    context.setContext({'walletDataLoading': true})
                    let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
                    context.setContext({'walletData': walletData})
                    context.setContext({'walletDataLoading': false})
                }
                clearAmounts()
            }
        }
    }

    const addLiquidity = async () => {
        setNotifyMessage('...')
        setStartTx(true)
        setEndTx(false)
        let gasFee = 0
        let gasLimit = 0
        let validInput = true
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let decDiff = 10 ** (18 - pool.decimals)
        let tokenAmnt = bn(liquidityData.tokenAmount).div(decDiff)
        let contract = getRouterContract()
        console.log('Estimating gas', liquidityData.baseAmount, formatBN(tokenAmnt, 0), estGasPrice)
        await contract.methods.addLiquidity(liquidityData.baseAmount, '1', pool.address).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
            value: pool.address === BNB_ADDR ? '1' : '0'
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setStartTx(false)
                setEndTx(true)
            }
            gasLimit = (Math.floor(gasAmount * 1.5)).toFixed(0)
            gasFee = (bn(gasLimit).times(bn(estGasPrice))).toFixed(0)
        })
        let enoughBNB = true
        var gasBalance = await getBNBBalance(context.account)
        if (bn(gasBalance).comparedTo(bn(gasFee)) === -1) {
            enoughBNB = false
            setNotifyMessage('You do not have enough BNB for gas fee!')
            setNotifyType('warning')
            setStartTx(false)
            setEndTx(true)
        }
        else if (enoughBNB === true) {
            if (pool.address === BNB_ADDR && bn(userData.tokenBalance).minus(gasFee).comparedTo(bn(tokenAmnt)) === -1) {
                tokenAmnt = tokenAmnt.minus(gasFee)
                if (bn(tokenAmnt).comparedTo(0) === -1) {
                    validInput = false
                    setNotifyMessage('Gas larger than BNB input amount')
                    setNotifyType('warning')
                    setStartTx(false)
                    setEndTx(true)
                }
            }
            if (validInput === true) {
                console.log('Adding Liq', liquidityData.baseAmount, formatBN(tokenAmnt, 0), estGasPrice, gasLimit, gasFee)
                await contract.methods.addLiquidity(liquidityData.baseAmount, formatBN(tokenAmnt, 0), pool.address).send({
                    from: context.account,
                    gasPrice: estGasPrice,
                    gas: gasLimit,
                    value: pool.address === BNB_ADDR ? tokenAmnt : '0'
                }, function(error, transactionHash) {
                    if (error) {
                        console.log(error)
                        setNotifyMessage('Transaction cancelled')
                        setNotifyType('warning')
                        setStartTx(false)
                        setEndTx(true)
                    }
                    else {
                        console.log('txn:', transactionHash)
                        setNotifyMessage('Liquidity-Add Pending...')
                        setNotifyType('success')
                        contTxn = true
                    }
                })
                if (contTxn === true) {
                    setNotifyMessage('Liquidity Added!')
                    setNotifyType('success')
                    setStartTx(false)
                    setEndTx(true)
                }
            }
        }
        updatePool()
    }

    const removeLiquidity = async () => {
        setNotifyMessage('...')
        setStartTx(true)
        setEndTx(false)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contract = getRouterContract()
        console.log('Estimating gas', withdrawAmount, estGasPrice)
        await contract.methods.removeLiquidity(withdrawAmount * 100, pool.address).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setStartTx(false)
                setEndTx(true)
            }
            gasLimit = (Math.floor(gasAmount * 1.5)).toFixed(0)
            gasFee = (bn(gasLimit).times(bn(estGasPrice))).toFixed(0)
        })
        let enoughBNB = true
        var gasBalance = await getBNBBalance(context.account)
        if (bn(gasBalance).comparedTo(bn(gasFee)) === -1) {
            enoughBNB = false
            setNotifyMessage('You do not have enough BNB for gas fee!')
            setNotifyType('warning')
            setStartTx(false)
            setEndTx(true)
        }
        if (enoughBNB === true) {
            console.log('Removing Liq', withdrawAmount * 100, estGasPrice, gasLimit, gasFee)
            await contract.methods.removeLiquidity(withdrawAmount * 100, pool.address).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                    setStartTx(false)
                    setEndTx(true)
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('Liquidity-Removal Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('Liquidity-Removal Complete!')
                setNotifyType('success')
                setStartTx(false)
                setEndTx(true)
            }
        }
        updatePool()
    }

    const updatePool = async () => {
        setPool(await getPool(pool.address))
        if (context.walletDataLoading !== true) {
            // Refresh BNB, SPARTA & TOKEN balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            walletData = await updateWalletData(context.account, walletData, SPARTA_ADDR)
            walletData = await updateWalletData(context.account, walletData, pool.address)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
        if (context.sharesDataLoading !== true) {
            // Refresh sharesData for token
            let sharesData = await updateSharesData(context.account, context.sharesData, pool.address)
            context.setContext({'sharesDataLoading': true})
            context.setContext({'sharesData': sharesData})
            context.setContext({'sharesDataLoading': false})
        }
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const toggleRightbar = () => {
        manageBodyClass("right-bar-enabled");
    };

    return (
        <>
            <Notification type={notifyType} message={notifyMessage}/>
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title={props.t("Pools")} breadcrumbItem={props.t("Join")}/>
                        <Row>
                            <Col lg="6">
                                <Card className="h-100">
                                    {context.sharesData &&
                                        <CardBody className='p-3 p-md-4'>
                                            <Row className='align-middle'>
                                                <Col xs={6} className='my-auto'>
                                                    <Link to='/pools'>
                                                        <button type="button" tag="button" className="btn btn-light w-100">
                                                            <i className="bx bx-arrow-back align-middle"/> Pools <i className="bx bx-swim align-middle"/>
                                                        </button>
                                                    </Link>
                                                </Col>

                                                <Col xs={6} className='my-auto'>
                                                    <div className="float-right w-100">
                                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                            <DropdownToggle type="button" tag="button" className="btn btn-light w-100">
                                                                <i className="bx bx-wallet align-middle"/>
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
                                                                            SPARTA : <span className="float-right">{formatAllUnits(convertFromWei(userData.baseBalance))}</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            {userData.symbol} : <span className="float-right">{formatAllUnits(convertFromWei(userData.tokenBalance))}</span>
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

                                            {pool.address !== 'XXX' &&
                                                <div className="crypto-buy-sell-nav">
                                                    <br />
                                                    <Nav  className="nav-tabs-custom" role="tablist">
                                                        <NavItem className="text-center w-33">
                                                            <NavLink className={classnames({active: activeTab === '1'})} onClick={() => {toggleTab('1');}}>
                                                                <i className="bx bxs-chevrons-up bx-sm"/>
                                                                <br/>
                                                                <h6 style={{fontSize:'0.68rem'}}>{`${props.t("ADD")} BOTH`}</h6>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem className="text-center w-33">
                                                            <NavLink className={classnames({active: activeTab === '2'})} onClick={() => {toggleTab('2');}}>
                                                                <i className="bx bxs-chevron-up bx-sm"/>
                                                                <br/>
                                                                <h6 style={{fontSize:'0.68rem'}}>{`${props.t("ADD")} ${pool.symbol}`}</h6>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem className="text-center w-33">
                                                            <NavLink className={classnames({active: activeTab === '3'})} onClick={() => {toggleTab('3');}}>
                                                                <i className="bx bxs-chevrons-down bx-sm"/>
                                                                <br/>
                                                                <h6 style={{fontSize:'0.68rem'}}>{`${props.t("REMOVE")} BOTH`}</h6>
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>
                                                    <TabContent activeTab={activeTab} className="crypto-buy-sell-nav-content p-4">
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
                                                                name='addsymm'
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
                                                                toggleTab={toggleTab}
                                                                name='addasymm'
                                                            />
                                                        </TabPane>
                                                        <TabPane tabId="3" id="remove-tab">
                                                            <RemoveLiquidityPane
                                                                pool={pool}
                                                                userData={userData}
                                                                onWithdrawChange={onWithdrawChange}
                                                                changeWithdrawAmount={changeWithdrawAmount}
                                                                approvalToken={approvalToken}
                                                                unlock={unlockToken}
                                                                removeLiquidity={removeLiquidity}
                                                                withdrawData={withdrawData}
                                                                startTx={startTx}
                                                                endTx={endTx}
                                                                name='remove'
                                                                location={props.location.search}
                                                            />
                                                        </TabPane>
                                                    </TabContent>
                                                </div>
                                            }
                                            {pool.address === 'XXX' &&
                                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                            }
                                        </CardBody>
                                    }
                                    {!context.sharesData &&
                                        <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                    }
                                </Card>
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

const AddSymmPane = (props) => {
    const [showModal, setShowModal] = useState(false);
    const toggle = () => setShowModal(!showModal);
    const remainder = convertFromWei(props.userData.balance - props.liquidityData.tokenAmnt)

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
            <InputPaneJoin
                address={props.pool.address}
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
                activeTab={props.activeTab}
                name={props.name}
            />

            <Row className='align-items-center'>
                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Input <i className="bx bx-info-circle align-middle" id="tooltipAddBase" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipAddBase">The quantity of {props.userData.symbol} & SPARTA you are adding to the pool.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'>
                    <h6 className="text-right font-weight-light m-0 mb-1">{formatAllUnits(convertFromWei(props.liquidityData.tokenAmount))} of {formatAllUnits(convertFromWei(props.userData.balance))} {props.userData.symbol}*</h6>
                    <h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(props.liquidityData.baseAmount))} of {formatAllUnits(convertFromWei(props.userData.baseBalance))} SPARTA*</h6>
                </Col>

                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Share <i className="bx bx-info-circle align-middle" id="tooltipPoolShare" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipPoolShare">An estimate of the total share of the pool that this liquidity-add represents.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h6 className="text-right font-weight-light m-0">{`${props.getEstShare()}%`}*</h6></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='m-0'>Output <i className="bx bx-info-circle align-middle" id="tooltipUnits" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipUnits">An estimate of the amount of LP tokens you will receive from this transaction.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h5 className="text-right m-0 py-2">{formatGranularUnits(convertFromWei(props.estLiquidityUnits))} *</h5></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={12}><p className='text-right'>Estimated*</p></Col>
            </Row>
            <div className="text-center">
                <Row>
                    <Col xs={12}>
                        {!props.approvalToken &&
                            <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.unlockToken}>
                                <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"/> Approve {props.pool.symbol}
                                {props.startTx && !props.endTx &&
                                    <i className="bx bx-spin bx-loader ml-1"/>
                                }
                            </button>
                        }
                    </Col>
                    <Col xs={12}>
                        <br/>
                        {!props.approvalBase &&
                            <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.unlockSparta}>
                                <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"/> Approve SPARTA
                                {props.startTx && !props.endTx &&
                                    <i className="bx bx-spin bx-loader ml-1"/>
                                }
                            </button>
                        }
                    </Col>
                    <Col xs={12}>
                        {props.approvalBase && props.approvalToken &&
                            <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>
                                ADD TO POOL
                                {props.startTx && !props.endTx &&
                                    <i className="bx bx-spin bx-loader ml-1"/>
                                }
                            </div>
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
                        <Button color="primary" onClick={() => {
                            toggle();
                            props.addLiquidity();
                        }}>
                            Continue Transaction!
                        </Button>
                    }
                    {remainder < 0.05 &&
                        <>
                            <Button color="primary" onClick={() => {props.changeAmount((0.999 - (0.05 / convertFromWei(props.userData.balance))) * 100);}}>
                                Change to ~{formatAllUnits(convertFromWei(props.userData.balance * (0.999 - (0.05 / convertFromWei(props.userData.balance)))))} BNB
                            </Button>
                            <Button color="danger" onClick={() => {
                                toggle();
                                props.addLiquidity();
                            }}>
                                Continue
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
            <InputPaneJoin
                address={props.pool.address}
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
                name={props.name}
            />

            <Row className='align-items-center'>
                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Input <i className="bx bx-info-circle align-middle" id="tooltipAddBaseAsym" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipAddBaseAsym">The quantity of {props.userData.symbol} you are adding to the pool.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(props.liquidityData.tokenAmount))} of {formatAllUnits(convertFromWei(props.userData.balance))} {props.userData.symbol}*</h6></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Share <i className="bx bx-info-circle align-middle" id="tooltipPoolShare" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipPoolShare">An estimate of the total share of the pool that this liquidity-add represents.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h6 className="text-right font-weight-light m-0">{`${props.getEstShare()}%`}*</h6></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='m-0'>Output <i className="bx bx-info-circle align-middle" id="tooltipUnits" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipUnits">An estimate of the amount of LP tokens you will receive from this transaction.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h5 className="text-right m-0 py-2">{formatGranularUnits(convertFromWei(props.estLiquidityUnits))} *</h5></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={12}><p className='text-right'>Estimated*</p></Col>
            </Row>

                <Row className='text-center'>
                    <Col xs={12}>
                        <br/>
                        {convertFromWei(props.pool.depth) > 10000 && !props.approvalToken &&
                            <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.unlockToken}>
                                {props.startTx && !props.endTx &&
                                    <i className="bx bx-spin bx-loader"/>
                                }
                                <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"/> Approve {props.pool.symbol}
                            </button>
                        }
                    </Col>
                    <Col xs={12}>
                        {convertFromWei(props.pool.depth) > 10000 && props.approvalToken &&
                            <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>
                                {props.startTx && !props.endTx &&
                                    <i className="bx bx-spin bx-loader"/>
                                } ADD TO POOL
                            </div>
                        }
                        {props.approvalToken && bn(props.liquidityData.tokenAmount).comparedTo(props.userData.balance) === 1 &&
                            <button className="btn btn-danger btn-lg btn-block waves-effect waves-light">
                                <i className="bx bx-error-circle font-size-20 align-middle mr-2" /> Not Enough {props.userData.symbol} in Wallet!
                            </button>
                        }

                        {convertFromWei(props.pool.depth) <= 10000 &&
                            <>
                                <h5>This pool is too shallow to safely add liquidity asymmetrically.</h5>
                                <h5>Please add symmetrically instead.</h5>
                                <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={() => {props.toggleTab('1');}}>
                                    ADD BOTH (SYMMETRICAL)
                                </div>
                            </>
                        }
                    </Col>
                </Row>

                <Card className='text-center mt-2'>
                    <h5><i className="bx bxs-error mr-1"/>Please ensure you understand the risks related to this asymmetric add!</h5>
                    <h6>50% of the input {props.userData.symbol} will be swapped to SPARTA before adding both to the pool.</h6>
                    <h6>This is subject to the usual swap fees and may have unfavourable 'impermanent loss' vs hodling your assets!</h6>
                </Card>

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
                            <Button color="primary" onClick={() => {props.changeAmount((0.999 - (0.05 / convertFromWei(props.userData.balance))) * 100);}}>
                                Change to ~{formatAllUnits(convertFromWei(props.userData.balance * (0.999 - (0.05 / convertFromWei(props.userData.balance)))))} BNB
                            </Button>
                            <Button color="danger" onClick={() => {
                                toggle();
                                props.addLiquidity();
                            }}>
                                Continue
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

    const [getDataCount, setGetDataCount] = useState(0)
    useEffect(() => {
        if (context.sharesData) {
            getData()
        }
        // eslint-disable-next-line
    }, [context.sharesData, getDataCount])

    const getData = async () => {
        let pool = ''
        let params = queryString.parse(location.search)
        if (params.pool === BNB_ADDR) {pool = WBNB_ADDR}
        else {pool = params.pool}
        var existsInSharesData = await context.sharesData.some(e => (e.address === pool))
        if (existsInSharesData === true) {
            const lockedAmount = context.sharesData.find(x => x.address === pool).locked
            const availAmount = context.sharesData.find(x => x.address === pool).units
            setLockedAmnt(lockedAmount)
            setAvailAmnt(availAmount)
            let units = props.pool.units
            let sparta = props.pool.baseAmount
            let tokens = props.pool.tokenAmount
            let share = (bn(lockedAmount).div(bn(units))).toFixed(18)
            setBase((bn(sparta).times(bn(share))).toFixed(0))
            setToken((bn(tokens).times(bn(share))).toFixed(0))
        }
        else {
            await pause(2000)
            setGetDataCount(getDataCount + 1)
        }
    }

    return (
        <>
            <InputPaneJoin 
                changeAmount={props.changeWithdrawAmount}
                name={props.name}
                paneData={props.userData}
                onInputChange={props.onWithdrawChange}
            />

            <Row className='align-items-center'>
                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Redeem LP Tokens <i className="bx bx-info-circle align-middle" id="tooltipRedeem" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipRedeem">The amount of LP tokens you are redeeming to withdraw liquidity from the pool.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(props.withdrawData.lpAmount))} of {formatAllUnits(convertFromWei(availAmnt))}</h6></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Receive <i className="bx bx-info-circle align-middle" id="tooltipReceive" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipReceive">The quantity of {props.userData.symbol} & SPARTA you are receiving from the pool.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1 mb-3'>
                    <h6 className="text-right font-weight-light m-0 mb-1">{formatAllUnits(convertFromWei(props.withdrawData.tokenAmount))} {props.pool.symbol}*</h6>
                    <h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(props.withdrawData.baseAmount))} SPARTA*</h6>
                </Col>

            </Row>

            <div className="text-center">
                {bn(props.withdrawData.lpAmount).comparedTo(bn(availAmnt)) <= 0 && bn(props.withdrawData.lpAmount).comparedTo(0) === 1 &&
                    <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={props.removeLiquidity}>
                        {props.startTx && !props.endTx &&
                            <i className="bx bx-spin bx-loader"/>
                        }
                        <i className="bx bx-log-in-circle font-size-20 align-middle mr-2" /> Withdraw From Pool {props.pool.symbol}
                    </button>
                }
                {bn(props.withdrawData.lpAmount).comparedTo(bn(availAmnt)) === 1 &&
                    <button className="btn btn-danger btn-lg btn-block waves-effect waves-light">
                        <i className="bx bx-error-circle font-size-20 align-middle mr-2" /> Not Enough LP Tokens in Wallet!
                    </button>
                }
            </div>

            <Row className='align-items-center mt-3'>
                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Staked LP Tokens <i className="bx bx-info-circle align-middle" id="tooltipStakedTokens" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipStakedTokens">Your LP tokens that are staked in the DAO.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(lockedAmnt))}</h6></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='font-weight-light m-0'>Projected Output <i className="bx bx-info-circle align-middle" id="tooltipStakedOutput" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipStakedOutput">Estimate of the quantity of {props.userData.symbol} & SPARTA you would receive if you unstaked your LP tokens and redeemed them.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'>
                    <h6 className="text-right font-weight-light m-0 mb-1">{formatAllUnits(convertFromWei(token))} {props.pool.symbol}*</h6>
                    <h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(base))} SPARTA*</h6>
                </Col>

                <Col xs={12}><p className='text-right'>Estimated*</p></Col>
            </Row>
        </>
    )
}