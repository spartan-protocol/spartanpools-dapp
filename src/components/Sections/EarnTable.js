import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../context";
import {getListedTokens, getRewards, getDaoContract, getPoolSharesData, getNextPoolSharesData, checkArrayComplete} from "../../client/web3";
import Notification from '../../components/Common/notification'

import {convertFromWei, formatGranularUnits} from '../../utils'

import {Row, Col, Card, CardTitle, CardSubtitle, CardBody, Table, Spinner} from "reactstrap";
import {withNamespaces} from 'react-i18next';

import EarnTableItem from "./EarnTableItem";
import { withRouter } from "react-router-dom";

const EarnTable = (props) => {

    const context = useContext(Context);
    const [reward, setReward] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    //const [showLockModal, setShowLockModal] = useState(false);
    //const [showUnlockModal, setShowUnlockModal] = useState(false);

    //const toggleLock = () => setShowLockModal(!showLockModal);
    //const toggleUnlock = () => setShowUnlockModal(!showUnlockModal);

    // eslint-disable-next-line
    {/*
    const deposit = async (record) => {
        console.log(record)
        let contract = getDaoContract()
        let tx = await contract.methods.deposit(record.address, record.units).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const withdraw = async (record) => {
        console.log(record)
        let contract = getDaoContract()
        let tx = await contract.methods.withdraw(record.address).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData()
    }
    */}

    useEffect(() => {
        const interval = setInterval(() => {
            if (context.walletData) {
                getData()
            }
        }, 3000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
      }, [context.walletData]);

    const getData = async () => {
        let rewards = await getRewards(context.account)
        console.log({rewards})
        setReward(rewards)
    }

    const harvest = async () => {
        let contract = getDaoContract()
        let tx = await contract.methods.harvest().send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const refreshData = async () => {
        let stakesData = await getPoolSharesData(context.account, await getListedTokens())
        context.setContext({ 'stakesData': stakesData })
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    const nextPoolSharesDataPage = async () => {
        var lastPage = await checkArrayComplete(context.tokenArray, context.stakesData)
        context.setContext({'poolSharesDataLoading': true})
        context.setContext({'stakesData': await getNextPoolSharesData(context.account, context.tokenArray, context.stakesData)})
        context.setContext({'poolSharesDataLoading': false})
        context.setContext({'poolSharesDataComplete': lastPage})
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
                                <h2>Claim Rewards</h2>
                                <h6>Witness the power of BSC's fast block-times! Watch your harvest accumulate in real-time!</h6>
                                    {context.walletDataLoading &&
                                        <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                    }
                                    {context.walletData &&
                                        <div>
                                            <h5><Spinner type="grow" color="primary" className='m-2' style={{height:'15px', width:'15px'}} />{formatGranularUnits(convertFromWei(reward))} SPARTA</h5>
                                            <button type="button" className="btn btn-primary waves-effect waves-light" onClick={harvest}>
                                                <i className="bx bx-log-in-circle font-size-16 align-middle mr-2"></i> Harvest SPARTA
                                            </button>
                                        </div>
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
                            {context.stakesData &&
                                <div className="table-responsive">
                                    <CardTitle><h4>Earn</h4></CardTitle>
                                    <CardSubtitle className="mb-3">
                                        By adding liquidity to the pools you receive Spartan Protocol LP Tokens.<br/>
                                        Earn extra SPARTA by locking these LP tokens in the DAO.
                                    </CardSubtitle>
                                    <Table className="table-centered mb-0">

                                        <thead className="center">
                                        <tr>
                                            <th scope="col">{props.t("Icon")}</th>
                                            <th scope="col">{props.t("Symbol")}</th>
                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Balance")}</th>
                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Locked")}</th>
                                            <th scope="col">{props.t("Action")}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {context.stakesData.sort((a, b) => (parseFloat(a.units + a.locked) > parseFloat(b.units + b.locked)) ? -1 : 1).map(c =>
                                                <EarnTableItem 
                                                    key={c.address}
                                                    symbAddr={c.address}
                                                    address={c.poolAddress}
                                                    symbol={c.symbol}
                                                    units={c.units}
                                                    locked={c.locked}
                                                    //lockModal={toggleLock}
                                                    //unlockModal={toggleUnlock}
                                                />
                                            )}
                                            <tr>
                                                <td colSpan="5">
                                                    {!context.poolSharesDataLoading && !context.poolSharesDataComplete &&
                                                        <button color="primary"
                                                            className="btn btn-primary waves-effect waves-light m-1"
                                                            onClick={()=>nextPoolSharesDataPage()}
                                                            >
                                                            Load More
                                                        </button>
                                                    }
                                                    {context.poolSharesDataLoading &&
                                                        <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                                    }
                                                    {!context.poolSharesDataLoading && context.poolSharesDataComplete &&
                                                        <div className="text-center m-2">All LP Tokens Loaded</div>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            }
                            {context.stakesDataLoading &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                            {!context.stakesDataLoading && !context.walletData &&
                                <div className="text-center m-2">Please connect your wallet to proceed</div>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/*
            <Modal isOpen={showLockModal} toggle={toggleLock}>
                        <ModalHeader toggle={toggleLock}>You are locking your tokens!</ModalHeader>
                        <ModalBody>
                            Locking your tokens enables them to earn yield.<br/>
                            If you confirm below you will lock all of your available tokens.<br/>
                            However, you can unlock them at any time.<br/>
                            Check in daily to harvest your rewards!<br/>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                            color="primary" 
                            onClick={() => {
                                toggleLock();
                                deposit(props);
                            }}>
                                Lock Tokens!
                            </Button>{' '}
                            <Button color="secondary" onClick={toggleLock}>Cancel</Button>
                        </ModalFooter>
                </Modal>

                <Modal isOpen={showUnlockModal} toggle={toggleUnlock}>
                        <ModalHeader toggle={toggleUnlock}>You are unlocking your tokens!</ModalHeader>
                        <ModalBody>
                            Unlocking your tokens means they will no longer be earning daily rewards.<br/>
                            If you confirm below you will unlock all of your available tokens.<br/>
                            However, you can re-lock them at any time.<br/>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                            color="primary" 
                            onClick={() => {
                                toggleUnlock();
                                withdraw(props);
                            }}>
                                Unlock Tokens!
                            </Button>{' '}
                            <Button color="secondary" onClick={toggleUnlock}>Cancel</Button>
                        </ModalFooter>
                </Modal>
                */}

        </>
    )
};

export default withRouter(withNamespaces()(EarnTable));