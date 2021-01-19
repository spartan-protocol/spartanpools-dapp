import React, {useContext, useState} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUnits, bn} from "../../utils";
import {
    Progress, Button,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'

import {getDaoContract, updateSharesData, updateWalletData, BNB_ADDR, getGasPrice, getBNBBalance} from '../../client/web3'
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
        setNotifyMessage('...')
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contract = getDaoContract()
        console.log('Estimating gas', '1', estGasPrice)
        await contract.methods.deposit(record.address, '1').estimateGas({
            from: context.account,
            gasPrice: estGasPrice
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
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
        }
        else if (enoughBNB === true) {
            console.log('Locking', record.units, estGasPrice, gasLimit, gasFee)
            await contract.methods.deposit(record.address, record.units).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('Lock Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('Lock Complete!')
                setNotifyType('success')
            }
        }
        await refreshData(record.symbAddr)
    }

    const withdraw = async (record) => {
        setNotifyMessage('...')
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contract = getDaoContract()
        console.log('Estimating gas', estGasPrice)
        await contract.methods.withdraw(record.address).estimateGas({
            from: context.account,
            gasPrice: estGasPrice
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
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
        }
        else if (enoughBNB === true) {
            console.log('UnLocking', estGasPrice, gasLimit, gasFee)
            await contract.methods.withdraw(record.address).send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('UnLock Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('UnLock Complete!')
                setNotifyType('success')
            }
        }
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
        // Notification to show txn complete
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    const [isMember, setIsMember] = useState(false)
    const getIsMember = () => {
        if (props.member.weight > 0) {setIsMember(true)}
        if (props.member.weight === 0) {setIsMember(false)}
    }

    const [showLockModal, setShowLockModal] = useState(false)
    const [showUnlockModal, setShowUnlockModal] = useState(false)

    const toggleLock = () => {
        getIsMember()
        setShowLockModal(!showLockModal)
    }

    const toggleUnlock = () => {
        getIsMember()
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
                        <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={()=>toggleLock()}>
                            <i className="bx bx-lock font-size-16 align-middle"/> Lock
                        </button>
                    }
                    {props.locked > 0 &&
                        <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={()=>toggleUnlock()}>
                            <i className="bx bx-lock-open font-size-16 align-middle"/> Unlock
                        </button>
                    }
                    <Notification type={notifyType} message={notifyMessage}/>

                    <Modal isOpen={showLockModal} toggle={()=>toggleLock()}>
                        <ModalHeader toggle={()=>toggleLock()}>
                            {isMember === false &&
                                <>
                                    You are locking your tokens!
                                </>
                            }
                            {isMember === true && props.lastHarvest <= 6 &&
                                <>
                                    You are locking your tokens!
                                </>
                            }
                            {isMember === true && props.lastHarvest > 6 &&
                                <>
                                    *** YOU MUST HARVEST FIRST ***
                                </>
                            }
                        </ModalHeader>
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
                            {isMember === true && props.lastHarvest <= 6 &&
                                <>
                                    Locking your tokens enables them to earn yield.<br/>
                                    Doing so increases your weight in the DAO.<br/>
                                    This leads to higher SPARTA harvestable rewards.<br/>
                                    Confirming will lock all of your available {props.symbol} tokens.<br/>
                                    However, you can unlock them at any time.<br/>
                                    Check in daily to harvest your rewards!<br/>
                                </>
                            }
                            {isMember === true && props.lastHarvest > 6 &&
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
                                            toggleLock()
                                            deposit(props)
                                        }}>
                                            Lock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest <= 6 &&
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            toggleLock()
                                            deposit(props)
                                        }}>
                                            Lock Tokens!
                                    </Button>
                                }
                                {isMember === true && props.lastHarvest > 6 &&
                                    <Button color="primary" onClick={() => {props.harvest()}}>
                                            Harvest SPARTA!
                                            {props.loadingHarvest === true &&
                                                <i className="bx bx-spin bx-loader ml-1" />
                                            }
                                    </Button>
                                }
                                <Button color="secondary" onClick={()=>toggleLock()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={showUnlockModal} toggle={()=>toggleUnlock()}>
                        <ModalHeader toggle={()=>toggleUnlock()}>
                            {isMember === false &&
                                <>
                                    You are unlocking your tokens!
                                </>
                            }
                            {isMember === true && props.lastHarvest <= 6 &&
                                <>
                                    You are unlocking your tokens!
                                </>
                            }
                            {isMember === true && props.lastHarvest > 6 &&
                                <>
                                    *** YOU MUST HARVEST FIRST ***
                                </>
                            }
                        </ModalHeader>
                        <ModalBody>
                            {isMember === false &&
                                <>
                                    Unlocking your tokens disables them from earning yield.<br/>
                                    Doing so also decreases your weight in the DAO.<br/>
                                    Confirming will unlock all of your available {props.symbol} tokens.<br/>
                                    However, you can re-lock them any time.<br/>
                                </>
                            }
                            {isMember === true && props.lastHarvest <= 6 &&
                                <>
                                    Unlocking your tokens disables them from earning yield.<br/>
                                    Doing so also decreases your weight in the DAO.<br/>
                                    Confirming will unlock all of your available {props.symbol} tokens.<br/>
                                    However, you can re-lock them any time.<br/>
                                </>
                            }
                            {isMember === true && props.lastHarvest > 6 &&
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
                                    toggleUnlock()
                                    withdraw(props)
                                }}>
                                    Unlock Tokens!
                                </Button>
                            }
                            {isMember === true && props.lastHarvest <= 6 &&
                                <Button 
                                color="primary" 
                                onClick={() => {
                                    toggleUnlock()
                                    withdraw(props)
                                }}>
                                    Unlock Tokens!
                                </Button>
                            }
                            {isMember === true && props.lastHarvest > 6 &&
                                <Button color="primary" onClick={() => {props.harvest()}}>
                                    Harvest SPARTA!
                                    {props.loadingHarvest === true &&
                                        <i className="bx bx-spin bx-loader ml-1" />
                                    }
                                </Button>
                            }
                            <Button color="secondary" onClick={()=>toggleUnlock()}>Cancel</Button>

                        </ModalFooter>
                    </Modal>
                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(EarnTableItem));