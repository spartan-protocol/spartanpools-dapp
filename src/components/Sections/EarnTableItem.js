import React, {useContext, useState} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUnits} from "../../utils";
import {Progress} from 'reactstrap'

import {getDaoContract, getPoolSharesData, getListedTokens} from '../../client/web3'
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
        let tx = await contract.methods.deposit(record.address, record.units).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const withdraw = async (record) => {
        console.log(record)
        let contract = getDaoContract()
        let tx = await contract.methods.withdraw(record.address).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    // const harvest = async () => {
    //     let contract = getDaoContract()
    //     let tx = await contract.methods.harvest().send({ from: context.walletData.address })
    //     console.log(tx.transactionHash)
    //     await refreshData()
    // }

    const refreshData = async () => {
        let stakesData = await getPoolSharesData(context.walletData.address, await getListedTokens())
        context.setContext({ 'stakesData': stakesData })
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    return (
        <>
            <tr>
                <td>
                    <TokenIcon address={props.symbAddr}/>
                </td>
                <td>
                    {props.symbol}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUnits(convertFromWei(props.units))}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUnits(convertFromWei(props.locked))}
                    <Progress multi className="m-1 my-2">
                        <Progress bar color="success" value={convertFromWei(locked).toFixed(2)} max={convertFromWei(total).toFixed(2)}>{lockedPC} %</Progress>
                        <Progress bar color="danger" value={convertFromWei(units).toFixed(2)} max={convertFromWei(total).toFixed(2)}></Progress>
                    </Progress>
                </td>
                <td>
                    <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={
                        () => deposit(props) //props.lockModal()
                        }>
                        <i className="bx bx-log-in-circle font-size-16 align-middle mr-2"></i> Lock
                    </button>
                    <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={
                        () => withdraw(props) //props.unlockModal()
                        }>
                        <i className="bx bx-transfer-alt font-size-16 align-middle mr-2"></i> Unlock
                    </button>

                    <Notification
                        type={notifyType}
                        message={notifyMessage}
                    />

                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(EarnTableItem));