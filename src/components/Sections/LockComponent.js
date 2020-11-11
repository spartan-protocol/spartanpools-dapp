import React, { useContext, useEffect, useState } from "react"
import { Context } from "../../context"
import queryString from 'query-string';
import {
    getLockContract, BNB_ADDR,WBNB_ADDR, LOCK_ADDR, getClaimableLP,getAllListedAssets,
    getTokenContract, getLockMemberDetail, SPARTA_ADDR, getPoolData, getTokenData,
} from "../../client/web3"
import Notification from '../../components/Common/notification'

import { bn, formatBN, convertFromWei, convertToWei, formatAllUnits, formatGranularUnits, daysSince, hoursSince } from '../../utils'

import {
    Row, Col, InputGroup, InputGroupAddon, Label, Table,
    FormGroup, Card, CardTitle, CardSubtitle, CardBody,
    Spinner, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap"
import { withNamespaces } from 'react-i18next'
import { TokenIcon } from "../Common/TokenIcon";
import { PercentButtonRow } from "../common";
import { withRouter } from "react-router-dom"

const LockComponent = (props) => {

    const context = useContext(Context)
    const [claimableLP, setClaimableLP] = useState(0)
    const [member, setMember] = useState([])
    const [notifyMessage, setNotifyMessage] = useState("")
    const [notifyType, setNotifyType] = useState("dark")
    const [loadingLockedLP, setloadingLockedLP] = useState(false)
    const [approvalToken, setApprovalToken] = useState(false)

    const [userData, setUserData] = useState({
        'address': SPARTA_ADDR,
        'symbol': 'XXX',
        'balance': 0,
        'input': 0,
    })
    const [startTx, setStartTx] = useState(false)
    const [endTx, setEndTx] = useState(false)

    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(!showModal);
    const remainder = convertFromWei(userData.balance - userData.input)
    useEffect(() => {
        if(context.poolsData){
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
        let lpLocked = await getClaimableLP(context.account, params.pool)
        setClaimableLP(lpLocked)
        let memberDetails = await getLockMemberDetail(context.account, params.pool)
        setMember(memberDetails)
    }
    const getData = async () => {
        let params = queryString.parse(props.location.search)
        const pool = await getPoolData(params.pool, context.poolsData)
        if (!context.tokenData) {
            var tokenData = await getTokenData(pool.address, context.walletData)
        } else {
            var tokenData = context.tokenData
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
        setloadingLockedLP(true)
        let contract = getLockContract()
        let address = userData.address
        let tx = await contract.methods.claim(address).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData()
        setloadingLockedLP(false)
    }

    const refreshData = async () => {
        getLastClaim()
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }
    const checkEnoughForGas = () => {
        if (userData.symbol === 'BNB') { // if input Symbol is BNB
            if (remainder < 0.05) {   //if (wallet BNB balance) minus (transaction BNB amount) < 0.05
                setShowModal(true)
            }
            else depositAsset()
        }else{
            depositAsset()
        }
    }
    const checkApproval = async (address) => {
        if (address === BNB_ADDR || address === WBNB_ADDR) {
            //console.log("BNB")
            return true
        } else {
            const contract = getTokenContract(address)
            const approvalToken = await contract.methods.allowance(context.account, LOCK_ADDR).call()
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
        await contract.methods.approve(LOCK_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        setNotifyMessage('Approved')
        setNotifyType('success')
        setApprovalToken(true)
    }

    const depositAsset = async () => {
        setStartTx(true)
        let contract = getLockContract()
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
                                <CardTitle><h4>Claim Locked LP Tokens</h4></CardTitle>
                                <CardSubtitle className="mb-3">
                                    Claim back vested LP tokens.<br />
                                </CardSubtitle>
                                {context.walletData &&
                                    <>
                                        <Row>
                                            <Col xs='12' sm='3' className='text-center p-2'>
                                                <h5><Spinner type="grow" color="primary" className='m-2' style={{ height: '15px', width: '15px' }} />{formatGranularUnits(convertFromWei(claimableLP))} LP Tokens</h5>
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={claimLP}>
                                                    <i className="bx bx-log-in-circle font-size-16 align-middle mr-2" /> Claim Locked LP Tokens
                                                </button>
                                            </Col>
                                            <Col xs='12' sm='8' className='p-2'>
                                                <p></p>
                                                <p> <strong>{formatAllUnits(convertFromWei(member.lockedLP))}</strong> SPARTA LP Tokens left to claim. </p>
                                                <p>
                                                    <strong>{member.lastBlockTime > 0 && daysSince(member.lastBlockTime)}</strong> passed since your last claim.
                                                </p>
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
                                    <CardTitle><h4>Add BNB and Mint SPARTA</h4></CardTitle>
                                    <CardSubtitle className="mb-3">
                                        By adding BNB you will receive an additional amount in SPARTA, then your liquidity is added to the pool. 50% of your LP tokens are given back to you, the rest is locked and vested back over 12 months.<br />
                                        Earn extra SPARTA by locking these LP tokens in the DAO.
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
                                                    <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>
                                                        <i className="bx bx-spin bx-loader" /> LOCK
                                                        </div>
                                                }
                                                {approvalToken && !startTx &&
                                                    <div className="btn btn-success btn-lg btn-block waves-effect waves-light" onClick={checkEnoughForGas}>LOCK</div>
                                                }
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Modal isOpen={showModal} toggle={toggle}>
                                        <ModalHeader toggle={toggle}>BNB balance will be low after this transaction!</ModalHeader>
                                        <ModalBody>
                                            {remainder >= 0.05 &&
                                                <>
                                                    This transaction will now leave you with (~{formatAllUnits(remainder)} BNB)<br />
                            This is plenty of gas to interact with the BSC network.<br />
                            If you would rather a different amount please cancel txn and manually input your amount.<br />
                            Remember though, we recommend leaving ~0.05 BNB in your wallet for gas purposes.<br />
                                                </>
                                            }
                                            {remainder < 0.05 &&
                                                <>
                                                    This transaction will leave you with a very low BNB balance (~{formatAllUnits(remainder)} BNB)<br />
                            Please ensure you understand that BNB is used as 'gas' for the BSC network.<br />
                            If you do not have any/enough BNB in your wallet you may not be able to transfer assets or interact with BSC DApps after this transaction.<br />
                            Keep in mind however, gas fees are usually very low (~0.005 BNB).<br />
                            0.05 BNB is usually enough for 10+ transactions.<br />
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            {remainder >= 0.05 &&
                                                <Button color="primary" onClick={() => {
                                                    toggle();
                                                    depositAsset();
                                                }}>
                                                    Continue Transaction!
                                                </Button>
                                            }
                                            {remainder < 0.05 &&
                                                <>
                                                    <Button color="primary" onClick={() => { onInputChange((0.999 - (0.05 / convertFromWei(userData.balance))) * 100); }}>
                                                        Change to ~{formatAllUnits(convertFromWei(userData.balance * (0.999 - (0.05 / convertFromWei(userData.balance)))))} BNB
                                                    </Button>
                                                    <Button color="danger" onClick={() => {
                                                        toggle();
                                                        depositAsset();
                                                    }}>
                                                        Continue (Might Fail!)
                                                    </Button>
                                                </>
                                            }
                                            <Button color="secondary" onClick={toggle}>Cancel</Button>
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

export default withRouter(withNamespaces()(LockComponent));