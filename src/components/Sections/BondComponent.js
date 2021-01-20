import React, {useContext, useEffect, useState} from "react"
import {Context} from "../../context"
import queryString from 'query-string';
import {
    getBondv2Contract,getBondv3Contract, BNB_ADDR, WBNB_ADDR,BONDv3_ADDR, getClaimableLPBondv2,getClaimableLPBondv3, getUtilsContract, updateSharesData, getBNBBalance,
    getTokenContract, getBondedv2MemberDetails,getBondedv3MemberDetails, SPARTA_ADDR, getPoolData, getTokenData, updateWalletData, getBaseAllocation, getGasPrice,
} from "../../client/web3"
import Notification from '../Common/notification'

import {bn, one, formatBN, convertFromWei, convertToWei, formatAllUnits, formatGranularUnits, daysSince, hoursSince } from '../../utils'

import {
    Row, Col, InputGroup, InputGroupAddon, Label, UncontrolledTooltip,
    FormGroup, Card, CardTitle, CardSubtitle, CardBody,
    Spinner, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Progress
} from "reactstrap"

import {withNamespaces} from 'react-i18next'
import {TokenIcon} from "../Common/TokenIcon";
import {PercentSlider} from "../common";
import {withRouter, Link} from "react-router-dom"
import {Doughnut} from 'react-chartjs-2';

const BondComponent = (props) => {

    const context = useContext(Context)
    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const [claimableLPBondv2, setClaimableLPBondv2] = useState(0)
    const [claimableLPBondv3, setClaimableLPBondv3] = useState(0)
    const [memberBondv2, setBondv2Member] = useState([])
    const [memberBondv3, setBondv3Member] = useState([])
    const [notifyMessage, setNotifyMessage] = useState("")
    const [notifyType, setNotifyType] = useState("dark")
    const [loadingBondedLP, setloadingBondedLP] = useState(false)
    const [approvalToken, setApprovalToken] = useState(false)
    const [loadingApproval, setLoadingApproval] = useState(false)
    const [spartaAllocation, setSpartaAllocation] = useState("")
    const [spartaEstimatedAllocation, setSpartaEstimatedAllocation] = useState("")
    const [poolTokenDepth, setPoolTokenDepth] = useState('')
    const [enoughSpartaAlloc, setEnoughSpartaAlloc] = useState('')

    const [userData, setUserData] = useState({
        'address': SPARTA_ADDR,
        'symbol': 'XXX',
        'balance': 0,
        'input': 0,
    })

    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const [showBondModal, setShowBondModal] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showClaimNewModal, setShowClaimNewModal] = useState(false);

    const remainder = convertFromWei(userData.balance - userData.input)

    const [getDataCount, setGetDataCount] = useState(0)
    useEffect(() => {
        if (context.poolsData && context.walletData) {
            getData()
        }
        // eslint-disable-next-line
    }, [context.poolsData, context.walletData, getDataCount])

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        var existsInPoolsData = await context.poolsData.some(e => (e.address === params.pool))
        var existsInWalletData = await context.walletData.some(e => (e.address === params.pool))
        if (existsInPoolsData === true && existsInWalletData === true) {
            const pool = await getPoolData(params.pool, context.poolsData)
            setPoolTokenDepth(pool.tokenAmount)
            const tokenData = await getTokenData(pool.address, context.walletData)
            let _userData = {
                'address': tokenData?.address,
                'symbol': tokenData?.symbol,
                'balance': tokenData?.balance,
                'input': 0,
            }
            setUserData(_userData)
            await checkApproval(pool.address) ? setApprovalToken(true) : setApprovalToken(false)
        }
        else {
            await pause(2000)
            setGetDataCount(getDataCount + 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (context.account && userData.symbol !== 'XXX') {
                getLPData()
            }
        }, 3000);
        return () => clearInterval(interval)
        // eslint-disable-next-line
    }, [context.account, userData])

    const getLPData = async () => {
        let params = queryString.parse(props.location.search)
        let data = await Promise.all([
            getClaimableLPBondv2(context.account, params.pool), getBondedv2MemberDetails(context.account, params.pool),
            getClaimableLPBondv3(context.account, params.pool), getBondedv3MemberDetails(context.account, params.pool)
        ])
        let bondedLPBondv2 = data[0]
        let bondv2MemberDetails = data[1]
        let bondedLPBondv3 = data[2]
        let bondv3MemberDetails = data[3]
        let allocation = await getBaseAllocation()
        setSpartaAllocation(allocation)
        setClaimableLPBondv2(bondedLPBondv2)
        setClaimableLPBondv3(bondedLPBondv3)
        setBondv2Member(bondv2MemberDetails)
        setBondv3Member(bondv3MemberDetails)
        if (bn(allocation).comparedTo(bn(convertToWei(10))) === -1) {setEnoughSpartaAlloc(false)}
        else {setEnoughSpartaAlloc(true)}
    }

    const claimOldLP = async () => {
        setNotifyMessage('...')
        setloadingBondedLP(true)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contractBondv2 = getBondv2Contract()
        let address = userData.address
        console.log('Estimating gas', estGasPrice)
        await contractBondv2.methods.claim(address).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setloadingBondedLP(false)
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
            setloadingBondedLP(false)
        }
        else if (enoughBNB === true) {
            console.log('Claiming Old LP', estGasPrice, gasLimit, gasFee)
            await contractBondv2.methods.claim(address).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                    setloadingBondedLP(false)
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('V2 Bond - LP Token-Claim Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('V2 Bond - LP Tokens Claimed!')
                setNotifyType('success')
                await refreshData()
                setloadingBondedLP(false)
            }
        }
    }

    const claimNewLP = async () => {
        setNotifyMessage('...')
        setloadingBondedLP(true)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contractBondv3 = getBondv3Contract()
        let address = userData.address
        console.log('Estimating gas', estGasPrice)
        await contractBondv3.methods.claimAndLock(address).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setloadingBondedLP(false)
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
            setloadingBondedLP(false)
        }
        else if (enoughBNB === true) {
            console.log('Claiming Old LP', estGasPrice, gasLimit, gasFee)
            await contractBondv3.methods.claimAndLock(address).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                    setloadingBondedLP(false)
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('Bond - LP Token-Claim Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('Bond - LP Tokens Claimed!')
                setNotifyType('success')
                await refreshData()
                setloadingBondedLP(false)
            }
        }
    }

    const refreshData = async () => {
        let params = queryString.parse(props.location.search)
        if (context.walletDataLoading !== true) {
            // Refresh BNB & TOKEN balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            walletData = await updateWalletData(context.account, walletData, params.pool)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
        if (context.sharesDataLoading !== true) {
            // Refresh sharesData for token
            let sharesData = await updateSharesData(context.account, context.sharesData, params.pool)
            context.setContext({'sharesDataLoading': true})
            context.setContext({'sharesData': sharesData})
            context.setContext({'sharesDataLoading': false})
        }
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
    }

    const toggleLock = () => {
        setShowBondModal(!showBondModal)
    }

    const toggleClaim = () => {
        if(bn(claimableLPBondv2).comparedTo(0) === 1 && !memberBondv3.isMember){
            claimOldLP();
        }else if(bn(claimableLPBondv2).comparedTo(0) === 1){
            toggleNewClaim();
            setShowClaimModal(!showClaimModal)
        }else {
            setShowClaimModal(!showClaimModal)
        }
    }

    const toggleNewClaim = () => {
        setShowClaimNewModal(!showClaimNewModal)
    }

    const checkApproval = async (address) => {
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            return true
        } else {
            const contract = getTokenContract(address)
            const approvalToken = await contract.methods.allowance(context.account, BONDv3_ADDR).call()
            if (+approvalToken > 0) {
                return true
            } else {
                return false
            }
        }
    }

    const onChange = async (amount) => {
        let finalAmt = ''
        if (amount === '100') {finalAmt = bn(userData?.balance)}
        else {
            finalAmt = (bn(userData?.balance)).times(amount).div(100)
        }
        let _userData = {
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
        //console.log(userData)
    }

    const onInputChange = async (e) => {
        const input = e.target.value
        let finalAmt = formatBN(convertToWei(input), 0)

        let _userData = {
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
    }

    const unlockToken = async () => {
        unlock(userData.address)
    }

    const unlock = async (address) => {
        setNotifyMessage('...')
        setLoadingApproval(true)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(BONDv3_ADDR, supply).estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setLoadingApproval(false)
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
            setLoadingApproval(false)
        }
        if (enoughBNB === true) {
            console.log('Approving token', estGasPrice, gasLimit, gasFee)
            await contract.methods.approve(BONDv3_ADDR, supply).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function (error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Token Approval Cancelled')
                    setNotifyType('warning')
                    setLoadingApproval(false)
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
                setLoadingApproval(false)
                setApprovalToken(true)
                if (context.walletDataLoading !== true) {
                    // Refresh BNB balance
                    context.setContext({'walletDataLoading': true})
                    let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
                    context.setContext({'walletData': walletData})
                    context.setContext({'walletDataLoading': false})
                }
            }
        }
    }

    const [estLiqTokens, setEstLiqTokens] = useState('0')

    const getEstLiqTokens = async () => {
        let contract = getUtilsContract()
        let data = await Promise.all([getPoolData(userData.address, context.poolsData), contract.methods.calcTokenPPinBase(userData.address, userData.input).call()])
        const pool = data[0]
        const estBaseValue = data[1]
        setSpartaEstimatedAllocation(estBaseValue)
        const tokenInput = userData.input
        setEstLiqTokens(formatBN(calcLiquidityUnits(estBaseValue, pool.baseAmount, tokenInput, pool.tokenAmount, pool.units ), 0))
    }

    const calcLiquidityUnits = (_b, _B, _t, _T, _P) => {
            let b = bn(_b)
            let B = bn(_B)
            let t = bn(_t)
            let T = bn(_T)
            let P = bn(_P)
            let slipAdjustment = getSlipAdustment(b, B, t, T);
            let part1 = t.times(B);
            let part2 = T.times(b);
            let part3 = T.times(B).times(2);
            let _units = (P.times(part1.plus(part2))).div(part3);
            return _units.times(slipAdjustment).div(one);  // Divide by 10**18
    }

    const getSlipAdustment = ( b,  B,  t,  T) => {
        // slipAdjustment = (1 - ABS((B t - b T)/((2 b + B) (t + T))))
        // 1 - ABS(part1 - part2)/(part3 * part4))
        let _one = bn(one);
        let part1 = B.times(t);
        let part2 = b.times(T);
        let part3 = b.times(2).plus(B);
        let part4 = t.plus(T);
        let numerator;
        if(part1 > part2){
            numerator = part1.minus(part2);
        } else {
            numerator = part2.minus(part1);
        }
        let denominator = part3.times(part4);
        return _one.minus((numerator.times(_one)).div(denominator)); // Multiply by 10**18
    }

    const depositAsset = async () => {
        setNotifyMessage('...')
        setStartTx(true)
        setEndTx(false)
        let gasFee = 0
        let gasLimit = 0
        let validInput = true
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let inputAmount = userData.input
        let contract = getBondv3Contract()
        console.log('Estimating gas', inputAmount, estGasPrice)
        await contract.methods.deposit(userData.address, '1').estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
            value: userData.address === BNB_ADDR ? '1' : '0'
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
            if (userData.address === BNB_ADDR && bn(userData.balance).minus(gasFee).comparedTo(bn(inputAmount)) === -1 ) {
                inputAmount = bn(inputAmount).minus(gasFee).toFixed(0)
                if (bn(inputAmount).comparedTo(0) === -1) {
                    validInput = false
                    setNotifyMessage('Gas larger than BNB input amount')
                    setNotifyType('warning')
                    setStartTx(false)
                    setEndTx(true)
                }
            }
            if (validInput === true) {
                console.log('Bonding Asset', inputAmount, estGasPrice, gasLimit, gasFee)
                await contract.methods.deposit(userData.address, inputAmount).send({
                    from: context.account,
                    gasPrice: estGasPrice,
                    gas: gasLimit,
                    value: userData.address === BNB_ADDR ? inputAmount : '0'
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
                        setNotifyMessage('Asset-Bond Pending...')
                        setNotifyType('success')
                        contTxn = true
                    }
                })
                if (contTxn === true) {
                    setNotifyMessage('Assets Bonded!')
                    setNotifyType('success')
                    setStartTx(false)
                    setEndTx(true)
                    await refreshData()
                }
            }
        }
    }

    const chartData = {
        labels: [
            "Instant",
            "Over 12 Months",
        ],
        datasets: [
            {
                data: [(0),(convertFromWei(estLiqTokens)*100/100).toFixed(2)],
                backgroundColor: [
                    "#626262",
                    "#a80005"
                ],
                hoverBackgroundColor: [
                    "#626262",
                    "rgba(168,0,5,0.6)"
                ],
                borderColor: "#2a3042",
                borderWidth: '1',
                hoverBorderWidth: '2',
            }]
    }

    const chartOptions = {
        legend: {
            position: 'bottom',
            labels: {
                fontColor: '#FFF'
            }
        }
    }

    return (
        <>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <Card>
                <Row>
                    <Col sm={12} className="mr-20">
                        <Card>
                            <CardBody>
                                <CardTitle><h4>Time-Locked LP Tokens</h4></CardTitle>
                                <CardSubtitle className="mb-3">
                                    Bond {userData.symbol} to get SPARTA LP Tokens. Claim your vested LP tokens.
                                </CardSubtitle>
                                {context.walletData &&
                                    <>
                                        <Row>
                                            <Col xs='12' sm='3' className='text-center p-2'>
                                                <h5><Spinner type="grow" color="primary" className='m-2' style={{ height: '15px', width: '15px' }} />{formatGranularUnits(convertFromWei(claimableLPBondv3).plus(convertFromWei(claimableLPBondv2)))} LP Tokens</h5>
                                               
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={toggleClaim}>
                                                    <i className="bx bx-log-in-circle font-size-16 align-middle" /> Claim LP Tokens
                                                    {loadingBondedLP === true &&
                                                        <i className="bx bx-spin bx-loader ml-1"/>
                                                    }
                                                </button>
                                            </Col>
                                            <Col xs='12' sm='8' className='p-2'>
                                                <p>
                                                    <strong>{formatAllUnits(convertFromWei(memberBondv3.bondedLP).plus(convertFromWei(memberBondv2.bondedLP)))}</strong> SPARTA:{userData.symbol} LP tokens remaining in time-locked contract.
                                                </p>
                                                
                                                {memberBondv3.bondedLP > 0 &&
                                                <p>
                                                    <strong>{memberBondv3.lastBlockTime > 0 && daysSince(memberBondv3.lastBlockTime)}</strong> passed since your last claim.
                                                </p>
                                                }
                                                 
                                            </Col>
                                        </Row>
                                    </>
                                }
                                {!context.walletData &&
                                    <div className="text-center m-2"><i className="bx bx-spin bx-loader" /></div>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Card>
            <Row>
                <Col sm={12} className="mr-20">
                    <Card>
                        <CardBody>
                            {userData.symbol !== 'XXX' &&
                                <div className="table-responsive">
                                    <CardTitle><h4>Bond {userData.symbol} to Mint SPARTA</h4></CardTitle>
                                    <CardSubtitle className="mb-3">
                                        <h6>Bond assets into the pools. </h6>
                                        <li>The equivalent purchasing power in SPARTA is minted with both assets added symmetrically to the {userData.symbol}:SPARTA liquidity pool.</li>
                                        <li>LP tokens will be issued as usual and vested to you over a 12 month period.</li>
                                    </CardSubtitle>

                                    <Col sm="10" md="6">
                                    
                                    <p>
                                        <strong>{enoughSpartaAlloc === false ? 'No' : formatAllUnits(convertFromWei(spartaAllocation))}</strong> Remaining Sparta Allocation.<br/>
                                    </p>
                                        <div><Progress color="info" value={(2500000 - convertFromWei(spartaAllocation))*100/2500000} /></div>
                                        <br/>
                                        {enoughSpartaAlloc === false &&
                                            <div className='mb-3'>
                                                Visit BonDAO to mint more SPARTA for Bond+Mint:
                                                <Link to="/dao/proposals"><div className="btn btn-success align-middle ml-2"><i className="bx bx-pin align-middle mr-1" /> Proposals</div></Link>
                                            </div>
                                        }
                                            <div className="mb-3">
                                                <label className="card-radio-label mb-2">
                                                    <input type="radio" name="currency" className="card-radio-input" />
                                                    <div className="card-radio">
                                                        <Row>
                                                            <Col md={3}>
                                                                <TokenIcon address={userData.address} />
                                                                <span>  {userData.symbol}</span></Col>
                                                            <div className="ml-5">
                                                                <Col md={4}>
                                                                    <p className="text-muted mb-1"><i className="bx bx-wallet mr-1" />Available:</p>
                                                                    <h5 className="font-size-16">{formatAllUnits(convertFromWei(userData.balance))}</h5>
                                                                </Col>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </label>
                                            </div>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="12">
                                                    <InputGroup className="mb-1">
                                                        <InputGroupAddon addonType="prepend">
                                                            <Label className="input-group-text">{props.t("Input")}</Label>
                                                        </InputGroupAddon>
                                                        <Input type="text" className="form-control" onChange={onInputChange}
                                                            placeholder={'Manually input ' + userData.symbol + ' here'}
                                                            bssize={'large'} id={"manualInput-" + props.name}
                                                        ></Input>
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <div className="text-center">
                                            <PercentSlider changeAmount={onChange} name={props.name} />
                                        </div>

                                        <Row>
                                            <Col xs={4} className='py-1'>
                                                <h6 className='font-weight-light m-0'>{props.t("Input")} <i className="bx bx-info-circle align-middle" id="tooltipBondInput" role='button'/></h6>
                                                <UncontrolledTooltip placement="right" target="tooltipBondInput">Estimated input amount</UncontrolledTooltip>
                                            </Col>
                                            <Col xs={8} className='py-1'><h6 className="text-right font-weight-light m-0">{formatAllUnits(convertFromWei(userData.input))} {userData.symbol}*</h6></Col>
                                        </Row>

                                        <br />
                                        <Row>
                                            <Col xs={12}>
                                                {approvalToken && hoursSince(memberBondv3.lastBlockTime) > 3 && memberBondv3.isMember && enoughSpartaAlloc === true &&
                                                    <div className='text-center'>
                                                        <button type="button" className="btn btn-primary btn-lg waves-effect waves-light" onClick={toggleClaim}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle" /> Claim LP Tokens First!
                                                            {loadingBondedLP === true &&
                                                                <i className="bx bx-spin bx-loader ml-1"/>
                                                            }
                                                        </button>
                                                        <h6 className='mt-2'>Bonding will reset your 'last claim' time.</h6>
                                                        <h6>Ensure you claim LP tokens first if you have not claimed in a while.</h6>
                                                    </div>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {!approvalToken && enoughSpartaAlloc === true &&
                                                    <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={unlockToken}>
                                                        <i className="bx bx-log-in-circle font-size-20 align-middle mr-2" /> Approve {userData.symbol}
                                                        {loadingApproval &&
                                                            <i className="bx bx-spin bx-loader ml-1" />
                                                        }
                                                    </button>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {approvalToken && bn(userData.balance).comparedTo(bn(userData.input)) === -1 && enoughSpartaAlloc === true && enoughSpartaAlloc === true &&
                                                    <div className='text-center'>
                                                        <button className="btn btn-danger btn-lg btn-block waves-effect waves-light">
                                                            <i className="bx bx-error-circle font-size-20 align-middle mr-2" /> Not Enough {userData.symbol} in Wallet!
                                                        </button>
                                                    </div>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {approvalToken && bn(userData.balance).comparedTo(bn(userData.input)) >= 0 && (bn(poolTokenDepth).div(5)).comparedTo(bn(userData.input)) === -1 && enoughSpartaAlloc === true &&
                                                    <div className='text-center'>
                                                        <button className="btn btn-danger btn-lg btn-block waves-effect waves-light">
                                                            <i className="bx bx-error-circle font-size-20 align-middle mr-2" /> Bond Too High!
                                                        </button>
                                                        <h6 className='mt-2'>Please reduce your bond input.</h6>
                                                        <h6>Max bond amount is ~10% of the pools total depth.</h6>
                                                        <h6>This is to protect you against slippage and prevent manipulation.</h6>
                                                    </div>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {approvalToken && bn(userData.balance).comparedTo(bn(userData.input)) >= 0 && (bn(poolTokenDepth).div(5)).comparedTo(bn(userData.input)) >= 0 && enoughSpartaAlloc === true &&
                                                    <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={() => {
                                                        getEstLiqTokens();
                                                        toggleLock();
                                                    }}>
                                                        Bond
                                                        {startTx && !endTx &&
                                                            <i className="bx bx-spin bx-loader ml-1" />
                                                        }
                                                    </div>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {enoughSpartaAlloc === false &&
                                                    <div className="btn btn-danger btn-lg btn-block">
                                                        No Allocation Remaining
                                                    </div>
                                                }
                                            </Col>
                                        </Row>

                                    </Col>
                                
                                    <Modal isOpen={showBondModal} toggle={toggleLock}>
                                        <ModalHeader toggle={toggleLock}>You are bonding {formatAllUnits(convertFromWei(userData.input))} {userData.symbol} and {formatAllUnits(convertFromWei(spartaEstimatedAllocation))} SPARTA into the pool for 12 months!</ModalHeader>
                                        <ModalBody>
                                            <h6>Please proceed with caution!</h6>
                                            <li>There will be no way to reverse this transaction!</li>
                                            <li>{formatAllUnits(convertFromWei(estLiqTokens))} estimated LP tokens will be generated from this transaction.</li>
                                            <li>100% ({formatAllUnits(convertFromWei(estLiqTokens))} LP tokens) will be released to you linearly over the next 12 months</li>


                                            {userData.symbol === 'BNB' && remainder < 0.05 &&
                                                <>
                                                    <h6 className='mt-2'>You will be left with a very low BNB balance (~{formatAllUnits(remainder)} BNB)</h6>
                                                    <li>If you do not have BNB in your wallet you will not be able to transfer assets or interact with BSC DApps after this transaction.</li>
                                                </>
                                            }
                                            <Doughnut className='pt-2' width={474} height={260} data={chartData} options={chartOptions} />
                                        </ModalBody>
                                        <ModalFooter>
                                            {userData.symbol !== 'BNB' &&
                                                <Button color="primary" onClick={() => {
                                                    toggleLock();
                                                    depositAsset();
                                                }}>
                                                    Bond for 12 months!
                                                </Button>
                                            }
                                            {userData.symbol === 'BNB' && remainder < 0.05 &&
                                                <>
                                                    <Button color="primary" onClick={() => {
                                                        onChange((0.999 - (0.05 / convertFromWei(userData.balance))) * 100); 
                                                        getEstLiqTokens();
                                                    }}>
                                                        Change to ~{formatAllUnits(convertFromWei(userData.balance * (0.999 - (0.05 / convertFromWei(userData.balance)))))} BNB
                                                    </Button>
                                                    <Button color="danger" onClick={() => {
                                                        toggleLock();
                                                        depositAsset();
                                                    }}>
                                                        Bond for 12 months (Low BNB; might fail!)
                                                    </Button>
                                                </>
                                            }
                                            {userData.symbol === 'BNB' && remainder >= 0.05 &&
                                                <Button color="primary" onClick={() => {
                                                    toggleLock();
                                                    depositAsset();
                                                }}>
                                                    Bond for 12 months!
                                                </Button>
                                            }
                                            <Button color="secondary" onClick={toggleLock}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>
                                    {(bn(claimableLPBondv3).plus(bn(claimableLPBondv2))).comparedTo(0) === 1 && 
                                    <Modal isOpen={showClaimModal} toggle={toggleClaim}>
                                        <ModalHeader toggle={toggleClaim}>Claim Locked LP Tokens </ModalHeader>
                                        
                                        <ModalBody>
                                        {bn(claimableLPBondv3).comparedTo(0) === 1 && 
                                        <div>
                                        <h6>For your convenience, LP Tokens will be locked into the DAO to earn more SPARTA for you</h6> 
                                        </div>
                                        }
                                        
                                            {bn(claimableLPBondv2).comparedTo(0) === 1 && 
                                            <div>
                                                <h6>Early Bonder Found!</h6>
                                                <li><strong>Alert!</strong> You will need to confirm two transactions!</li>
                                                <li><strong>1.</strong> Claim Early Bonder LP Tokens</li>
                                                <li><strong>2.</strong> Claim and Lock LP Tokens</li>
                                            </div>
                                            }
                                            
                                        </ModalBody>
                                        <ModalFooter>
                                            {showClaimNewModal && 
                                            <Button color="primary" onClick={() => {
                                                if(bn(claimableLPBondv3).comparedTo(0) === 1){
                                                    toggleNewClaim()
                                                }else{
                                                    toggleClaim()
                                                }
                                                    claimOldLP();
                                                }}>
                                                Claim Early Bonder LP Tokens!
                                                </Button>
                                        
                                            }
                                            {!showClaimNewModal && 
                                    
                                                <Button color="primary" onClick={() => {
                                                    toggleClaim();
                                                    claimNewLP();
                                                }}>
                                                    Claim and Lock LP Tokens!
                                                </Button>
                                    
                                            }
                                        </ModalFooter>
                                        
                                    </Modal>
                                    }
                                </div>

                            }
                            {userData.symbol === 'XXX' &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader" /></div>
                            }

                            {context.sharesDataLoading !== true && !context.walletData &&
                                <div className="text-center m-2">Please connect your wallet to proceed</div>
                            }
                               
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

export default withRouter(withNamespaces()(BondComponent));
