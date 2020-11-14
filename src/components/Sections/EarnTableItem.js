import React, {useContext, useState} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUnits} from "../../utils";
import {
    Progress, Button,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'

import {getDaoContract, updateSharesData, updateWalletData, BNB_ADDR} from '../../client/web3'
import Notification from '../../components/Common/notification'

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import BigNumber from 'bignumber.js';

export const EarnTableItem = (props) => {

    const context = useContext(Context)
    const [notifyMessage,setNotifyMessage] = useState("");
    const [notifyType,setNotifyType] = useState("dark");

    const units = new BigNumber(props.units)
    const locked = new BigNumber(props.locked)
    const total = units.plus(locked)
    const lockedPC = locked.dividedBy(total).times(100).toFixed(0)
    //const availPC = units.dividedBy(total).times(100).toFixed(0)

    const deposit = async (record) => {
        console.log(record)
        let contract = getDaoContract()
        let tx = await contract.methods.deposit(record.address, record.units).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData(record.symbAddr)
    }

    const withdraw = async (record) => {
        console.log(record)
        let contract = getDaoContract()
        let tx = await contract.methods.withdraw(record.address).send({ from: context.account })
        console.log(tx.transactionHash)
        await refreshData(record.symbAddr)
    }

    const refreshData = async (tokenAddr) => {
        if (context.walletDataLoading !== true) {
            // Refresh BNB balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
        if (context.sharesDataLoading !== true) {
            // Refresh sharesData for specific token
            console.log(tokenAddr)
            let sharesData = await updateSharesData(context.account, context.sharesData, tokenAddr)
            context.setContext({'sharesDataLoading': true})
            context.setContext({'sharesData': sharesData})
            context.setContext({'sharesDataLoading': false})
        }
        // Get new 'last harvest'
        props.getLastHarvest()
        // Notification to show txn complete
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    const [isMember, setIsMember] = useState(false)
    const getIsMember = (props) => {
        if (props.member.weight > 0) {setIsMember(true)}
        if (props.member.weight === 0) {setIsMember(false)}
    }

    const [showLockModal, setShowLockModal] = useState(false)
    const [showUnlockModal, setShowUnlockModal] = useState(false)

    const toggleLock = (props) => {
        props.getLastHarvest()
        getIsMember(props)
        setShowLockModal(!showLockModal)
    }

    const toggleUnlock = (props) => {
        props.getLastHarvest()
        getIsMember(props)
        setShowUnlockModal(!showUnlockModal)
    }

    return (
        <>
            <tr>
                <td className="d-none d-lg-table-cell">
                    <TokenIcon address={props.symbAddr}/>
                </td>
                <td>
                    <div className='d-block d-lg-none'><TokenIcon address={props.symbAddr}/></div>
                    {props.symbol}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUnits(convertFromWei(props.units))}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUnits(convertFromWei(props.locked))}
                    <Progress multi className="m-1 my-2">
                        <Progress bar color="success" value={convertFromWei(locked).toFixed(2)} max={convertFromWei(total).toFixed(2)}>{lockedPC <= 0 && "0%"}{lockedPC > 0 && lockedPC + " %"}</Progress>
                        <Progress bar color="danger" value={convertFromWei(units).toFixed(2)} max={convertFromWei(total).toFixed(2)}></Progress>
                    </Progress>
                </td>
                <td>
                    {props.units > 0 &&
                        <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={()=>toggleLock(props)}>
                            <i className="bx bx-lock font-size-16 align-middle mr-2"/> Lock
                        </button>
                    }
                    {props.locked > 0 &&
                        <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={()=>toggleUnlock(props)}>
                            <i className="bx bx-lock-open font-size-16 align-middle mr-2"/> Unlock
                        </button>
                    }
                    <Notification type={notifyType} message={notifyMessage}/>

                        <Modal isOpen={showLockModal} toggle={()=>toggleLock(props)}>
                            <ModalHeader toggle={()=>toggleLock(props)}>You are locking your tokens!</ModalHeader>
                            <ModalBody>
                                {isMember === false &&
                                    <>
                                        Locking your tokens enables them to earn yield.<br/>
                                        Doing so increases your weight in the DAO.<br/>
                                        This leads to higher SPARTA harvestable rewards.<br/>
                                        Confirming will lock all of your available {props.symbol} tokens.<br/>
                                        However, you can unlock them at any time.<br/>
                                        Check in daily to harvest your rewards!<br/>
                                    </>
                                }
                                {isMember === true && props.lastHarvest <= 1 &&
                                    <>
                                        Locking your tokens enables them to earn yield.<br/>
                                        Doing so increases your weight in the DAO.<br/>
                                        This leads to higher SPARTA harvestable rewards.<br/>
                                        Confirming will lock all of your available {props.symbol} tokens.<br/>
                                        However, you can unlock them at any time.<br/>
                                        Check in daily to harvest your rewards!<br/>
                                    </>
                                }
                                {isMember === true && props.lastHarvest > 1 &&
                                    <>
                                        Before you lock your tokens a harvest must be performed.<br/>
                                        This is due to your DAO position changing, which has effects on your harvestable SPARTA calculations.<br/>
                                        Harvesting now ensures you do not miss out on your hard earned rewards!<br/>
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter>
                                {isMember === false &&
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            toggleLock(props)
                                            deposit(props)
                                        }}>
                                            Lock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest <= 1 &&
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            toggleLock(props)
                                            deposit(props)
                                        }}>
                                            Lock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest > 1 && props.loadingHarvest === false &&
                                    <Button 
                                        color="primary" 
                                        onClick={() => props.harvest()}>
                                            Harvest SPARTA!
                                    </Button>
                                }
                                {props.loadingHarvest === true &&
                                    <Button>
                                        <i className="bx bx-spin bx-loader"/>
                                    </Button>
                                }
                                <Button color="secondary" onClick={()=>toggleLock(props)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={showUnlockModal} toggle={()=>toggleUnlock(props)}>
                            <ModalHeader toggle={()=>toggleUnlock(props)}>You are unlocking your tokens!</ModalHeader>
                            <ModalBody>
                                {isMember === false &&
                                    <>
                                        Unlocking your tokens disables them from earning yield.<br/>
                                        Doing so also decreases your weight in the DAO.<br/>
                                        Confirming will unlock all of your available {props.symbol} tokens.<br/>
                                        However, you can re-lock them any time.<br/>
                                    </>
                                }
                                {isMember === true && props.lastHarvest <= 1 &&
                                    <>
                                        Unlocking your tokens disables them from earning yield.<br/>
                                        Doing so also decreases your weight in the DAO.<br/>
                                        Confirming will unlock all of your available {props.symbol} tokens.<br/>
                                        However, you can re-lock them any time.<br/>
                                    </>
                                }
                                {isMember === true && props.lastHarvest > 1 &&
                                    <>
                                        Before you unlock your tokens, a harvest must be performed.<br/>
                                        This is due to your DAO position changing, which has effects on your harvestable SPARTA calculations.<br/>
                                        Harvesting now ensures you do not miss out on your hard earned rewards!<br/>
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter>
                                {isMember === false &&
                                    <Button 
                                    color="primary" 
                                    onClick={() => {
                                        toggleUnlock(props)
                                        withdraw(props)
                                    }}>
                                        Unlock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest <= 1 &&
                                    <Button 
                                    color="primary" 
                                    onClick={() => {
                                        toggleUnlock(props)
                                        withdraw(props)
                                    }}>
                                        Unlock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest > 1 && props.loadingHarvest === false &&
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            props.harvest()
                                        }}>
                                            Harvest SPARTA!
                                    </Button>
                                }
                                {props.loadingHarvest === true &&
                                    <Button>
                                        <i className="bx bx-spin bx-loader"/>
                                    </Button>
                                }
                                <Button color="secondary" onClick={()=>toggleUnlock(props)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(EarnTableItem));