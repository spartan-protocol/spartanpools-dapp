
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../context'
import { Link } from "react-router-dom";

import { getDaoContract, getRewards, getPoolSharesData, getListedTokens } from '../client/web3'

import Notification from '../components/Common/notification'

import { TokenIcon } from '../components/common';

import {
    Row,
    Col,
    Card,
    Table,
} from "reactstrap";

import { H1, Center } from '../components/elements';

import { convertFromWei } from '../utils'

const Earn = (props) => {

    const [notifyMessage,setNotifyMessage] = useState("");
    const [notifyType,setNotifyType] = useState("dark");

    // Show Spartan Token Info
    // Show Spartan Balance
    // Input field of token, upgrade button


    const context = useContext(Context)
    // const [connecting, setConnecting] = useState(false)
    // const [connected, setConnected] = useState(false)
    // const [visible, setVisible] = useState(false);

    const [reward, setReward] = useState(false);

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {

        let rewards = await getRewards(context.walletData.address)
        console.log({rewards})
        setReward(rewards)

    }

    const harvest = async () => {
        let contract = getDaoContract()
        let tx = await contract.methods.harvest().send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const refreshData = async () => {
        let stakesData = await getPoolSharesData(context.walletData.address, await getListedTokens())
        context.setContext({ 'stakesData': stakesData })
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    return (
        <div>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <Row>
                <Col xs={24} className="cntr">
                  <h1>Earn</h1>
                  <h2>Earn yield by depositing liquidity in the SPARTAN DAO.</h2>
                </Col>
                <Col xs={24} className="cntr">

                    <Table>
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Locked</th>
                                <th>Harvest</th>
                                <th>Deposit</th>
                                <th>Withdraw</th>
                            </tr>
                        </thead>
                        <tbody>
                            {context.stakesData.map(c =>
                                <EarnItem 
                                    address={c.address}
                                    name={c.name}
                                    units={c.units}
                                    locked={c.locked}
                                />
                            )}
                        </tbody>
                    </Table>

                </Col>
            </Row>
            <br/>

            <Card>
            <Row>
                <Col xs={24}>
                    <Row>
                        <Col xs={24}>
                            <Row>
                                <Col xs={24}>
                                    <Center><h2>CLAIM REWARDS</h2></Center>
                                    <Center><H1>{convertFromWei(reward)}</H1></Center>
                                    <div className="btn primary" onClick={harvest}>HARVEST YIELD</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
          </Card>

        </div>
    )

}

const EarnItem = (props) => {

    const [notifyMessage,setNotifyMessage] = useState("");
    const [notifyType,setNotifyType] = useState("dark");

    const context = useContext(Context)

    const lock = async (record) => {
        let contract = getDaoContract()
        let tx = await contract.methods.lock(record.poolAddress, record.units).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const unlock = async (record) => {
        let contract = getDaoContract()
        let tx = await contract.methods.unlock(record.poolAddress).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const refreshData = async () => {
        let stakesData = await getPoolSharesData(context.walletData.address, await getListedTokens())
        context.setContext({ 'stakesData': stakesData })
        setNotifyMessage('Transaction Sent!');
        setNotifyType('success')
    }

    return (
        <>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <tr>
                <td>
                    <TokenIcon address={props.address}/>
                </td>
                <td>
                    <h3>{props.name}</h3>
                </td>
                <td>
                    <h3>{convertFromWei(props.units)}</h3>
                </td>
                <td>
                    <h3>{convertFromWei(props.locked)}</h3>
                </td>
                <td>
                    <h3>HARVEST YIELD</h3>
                </td>
                <td>
                    <Link to={`/pool/stake?pool=${props.address}`}>
                        <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => lock(props)}>
                            <i className="bx bx-log-in-circle font-size-16 align-middle mr-2"></i> DEPOSIT
                        </button>
                    </Link>
                </td>
                <td>
                    <Link to={`/pool/swap?pool=${props.address}`}>
                        <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => unlock(props)}>
                            <i className="bx bx-transfer-alt font-size-16 align-middle mr-2"></i> WITHDRAW
                        </button>
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default Earn
