import React, { useContext, useEffect, useState } from "react"
import { Context } from "../../context"
import queryString from 'query-string';
import {
    getBondContract, BNB_ADDR, WBNB_ADDR, BOND_ADDR, getClaimableLP, getUtilsContract,
    getTokenContract, getBondedMemberDetails, SPARTA_ADDR, getPoolData, getTokenData,
} from "../../client/web3"
import Notification from '../Common/notification'

import { bn, formatBN, convertFromWei, convertToWei, formatAllUnits, formatGranularUnits, daysSince, hoursSince } from '../../utils'

import {
    Row, Col, InputGroup, InputGroupAddon, Label,
    FormGroup, Card, CardTitle, CardSubtitle, CardBody,
    Spinner, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import { withNamespaces } from 'react-i18next'
import { TokenIcon } from "../Common/TokenIcon";
import { PercentButtonRow } from "../common";
import { withRouter } from "react-router-dom"

import { Doughnut } from 'react-chartjs-2';

const BondComponent = (props) => {

    const context = useContext(Context)
    const [claimableLP, setClaimableLP] = useState(0)
    const [member, setMember] = useState([])
    const [notifyMessage, setNotifyMessage] = useState("")
    const [notifyType, setNotifyType] = useState("dark")
    const [loadingBondedLP, setloadingBondedLP] = useState(false)
    const [approvalToken, setApprovalToken] = useState(false)

    const [userData, setUserData] = useState({
        'address': SPARTA_ADDR,
        'symbol': 'XXX',
        'balance': 0,
        'input': 0,
    })
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const [showBondModal, setShowBondModal] = useState(false);

    const remainder = convertFromWei(userData.balance - userData.input)
    useEffect(() => {
        if (context.poolsData) {
            getData()
        }
        const interval = setInterval(() => {
            if (context.walletData) {
                getLPData()
            }
        }, 3000);
        return () => clearInterval(interval);

        // eslint-disable-next-line
    }, [context.walletData, context.poolsData]);

    const getLPData = async () => {
        let params = queryString.parse(props.location.search)
        let bondedLP = await getClaimableLP(context.account, params.pool)
        setClaimableLP(bondedLP)
        let memberDetails = await getBondedMemberDetails(context.account, params.pool)
        setMember(memberDetails)
    }

    const getData = async () => {
        let params = queryString.parse(props.location.search)
        const pool = await getPoolData(params.pool, context.poolsData)
        var tokenData = ''
        if (!context.tokenData) {
            tokenData = await getTokenData(pool.address, context.walletData)
        } else {
            tokenData = context.tokenData
        }
        let _userData = {
            'address': tokenData?.address,
            'symbol': tokenData?.symbol,
            'balance': tokenData?.balance,
            'input': 0,
        }

        setUserData(_userData)

        await checkApproval(pool.address) ? setApprovalToken(true) : setApprovalToken(false)
    }

    const [lastClaimed, setlastClaimed] = useState(100);

    const getLastClaim = () => setlastClaimed(hoursSince(member.lastBlockTime))

    const claimLP = async () => {
        setloadingBondedLP(true)
        let contract = getBondContract()
        let address = userData.address
        let tx = await contract.methods.claim(address).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData()
        setloadingBondedLP(false)
    }

    const refreshData = async () => {
        getLastClaim()
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    const toggleLock = () => {
        setShowBondModal(!showBondModal)
    }

    const checkApproval = async (address) => {
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            //console.log("BNB")
            return true
        } else {
            const contract = getTokenContract(address)
            const approvalToken = await contract.methods.allowance(context.account, BOND_ADDR).call()
            if (+approvalToken > 0) {
                return true
            } else {
                return false
            }
        }
    }

    const onChange = async (amount) => {
        const finalAmt = (bn(userData?.balance)).times(amount).div(100)
        let _userData = {
            'address': userData.address,
            'symbol': userData.symbol,
            'balance': userData.balance,
            'input': formatBN(bn(finalAmt), 0),
        }
        setUserData(_userData)
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
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(BOND_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Approved')
        setNotifyType('success')
        setApprovalToken(true)
    }

    const [estLiqTokens, setEstLiqTokens] = useState('0')

    const getEstLiqTokens = async () => {
        const pool = await getPoolData(userData.address, context.poolsData)
        let contract = getUtilsContract()
        console.log(userData.address)
        console.log(userData.input)
        const estBaseValue = await contract.methods.calcValueInBase(userData.address, userData.input).call()
        console.log(estBaseValue)

        const tokenInput = userData.input

        setEstLiqTokens(calcEstLiqUnits(estBaseValue, tokenInput, pool) * 2)
    }

    const calcEstLiqUnits = (estBaseValue, tokenInput, pool) => {
        // formula: ((V + T) (v T + V t))/(4 V T)
        // part1 * (part2 + part3) / denominator
        const v = bn(estBaseValue)
        const t = bn(tokenInput)
        const V = bn(pool.baseAmount).plus(v) // Must add r first
        const T = bn(pool.tokenAmount).plus(t) // Must add t first
        const part1 = V.plus(T)
        const part2 = v.times(T)
        const part3 = V.times(t)
        const numerator = part1.times(part2.plus(part3))
        const denominator = V.times(T).times(4)
        const result = numerator.div(denominator)
        return result
    }

    const depositAsset = async () => {
        setStartTx(true)
        let contract = getBondContract()
        console.log(userData.address, userData.input)
        await contract.methods.deposit(userData.address, userData.input).send({
            from: context.account,
            gasPrice: '',
            gas: '',
            value: userData.address === BNB_ADDR ? userData.input : 0
        })
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
        setStartTx(false)
        setEndTx(true)
        context.setContext({ 'tokenData': await getTokenData(userData.address, context.walletData) })
    }

    const chartData = {
        labels: [
            "Instant",
            "Over 12 Months",
        ],
        datasets: [
            {
                data: [formatAllUnits(convertFromWei(estLiqTokens)) * 0.25, formatAllUnits(convertFromWei(estLiqTokens)) * 0.75],
                backgroundColor: [
                    "#556ee6",
                    "#34c38f"
                ],
                hoverBackgroundColor: [
                    "#556ee6",
                    "#34c38f"
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
                                    Bond {userData.symbol} to get SPARTA LP Tokens.<br />
                                    Claim your vested LP tokens.<br />
                                </CardSubtitle>
                                {context.walletData &&
                                    <>
                                        <Row>
                                            <Col xs='12' sm='3' className='text-center p-2'>
                                                <h5><Spinner type="grow" color="primary" className='m-2' style={{ height: '15px', width: '15px' }} />{formatGranularUnits(convertFromWei(claimableLP))} LP Tokens</h5>
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={claimLP}>
                                                    <i className="bx bx-log-in-circle font-size-16 align-middle mr-2" /> Claim LP Tokens
                                                </button>
                                            </Col>
                                            <Col xs='12' sm='8' className='p-2'>
                                                <p>
                                                    <strong>{formatAllUnits(convertFromWei(member.bondedLP))}</strong> SPARTA:{userData.symbol} LP tokens remaining in time-locked contract.
                                                </p>
                                                {member.bondedLP > 0 && 
                                                <p>
                                                    <strong>{member.lastBlockTime > 0 && daysSince(member.lastBlockTime)}</strong> passed since your last claim.
                                                   
                                                    
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
                                
                                    <div className="table-responsive">
                                    <CardTitle><h4>Bond {userData.symbol} to Mint SPARTA</h4></CardTitle>
                                    <CardSubtitle className="mb-3">
                                        <h6>Bond assets into the pools. </h6>
                                        <li>The equivalent value in SPARTA is minted with both assets added symmetrically to the {userData.symbol}:SPARTA liquidity pool.</li>
                                        <li>LP tokens will be issued as usual, however only 25% are available to you immediately.</li>
                                        <li>The remaining 75% will be vested to you over a 12 month period.</li>
                                        <li>Farm extra SPARTA by locking your LP tokens on the Earn page.</li>
                                    </CardSubtitle>
                                    
                                    <Col sm="10" md="6">
                                        {userData.symbol !== 'XXX' &&
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
                                        }
                                        {userData.symbol === 'XXX' &&
                                            <div className="text-center m-2"><i className="bx bx-spin bx-loader" /></div>
                                        }
                                        <FormGroup>
                                            <Row>
                                                <Col sm="12">
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <Label className="input-group-text">{props.t("Total")}</Label>
                                                        </InputGroupAddon>
                                                        <Input type="text" className="form-control" onChange={onInputChange}
                                                            placeholder={formatAllUnits(convertFromWei(userData.input))}
                                                            bssize={'large'}
                                                        ></Input>
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <br />
                                        <div className="text-center">
                                            <PercentButtonRow changeAmount={onChange} />
                                        </div>
                                        <br />
                                        <Row>
                                            <Col xs={12}>
                                                {!approvalToken &&
                                                    <button color="success" type="button" className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={unlockToken}>
                                                        <i className="bx bx-log-in-circle font-size-20 align-middle mr-2" /> Approve {userData.symbol}
                                                    </button>
                                                }
                                            </Col>
                                            <Col xs={12}>
                                                {approvalToken && startTx && !endTx &&
                                                    <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={() => {
                                                        getEstLiqTokens()
                                                        toggleLock()
                                                    }}>
                                                        <i className="bx bx-spin bx-loader" /> LOCK
                                                    </div>
                                                }
                                                {approvalToken && !startTx &&
                                                    <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={() => {
                                                        getEstLiqTokens()
                                                        toggleLock()
                                                    }}>LOCK</div>
                                                }
                                            </Col>
                                        </Row>

                                    </Col>
                                  
                                    <Modal isOpen={showBondModal} toggle={toggleLock}>
                                        <ModalHeader toggle={toggleLock}>You are about to time-lock {formatAllUnits(convertFromWei(userData.input))} {userData.symbol} for 12 months!</ModalHeader>
                                        <ModalBody>
                                            <h6>Please proceed with caution!</h6>
                                            <li>There will be no way to reverse this transaction!</li>
                                            <li>{formatAllUnits(convertFromWei(estLiqTokens))} LP tokens will be generated from this transaction.</li>
                                            <li>You will receive 25% straight after the transaction finalizes</li>
                                            <li>75% will release to you linearly over the next 12 months</li>

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
                                                    <Button color="primary" onClick={() => { onInputChange((0.999 - (0.05 / convertFromWei(userData.balance))) * 100); }}>
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
                                </div>
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