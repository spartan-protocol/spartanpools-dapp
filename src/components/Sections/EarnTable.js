import React, {useContext, useEffect, useState} from "react"
import {Context} from "../../context"

import {getRewards, getDaoContract, 
    updateWalletData, BNB_ADDR, SPARTA_ADDR,
    getMemberDetail, getTotalWeight, getGasPrice, getBNBBalance,
} from "../../client/web3"

import Notification from '../../components/Common/notification'

import {convertFromWei, formatAllUnits, formatGranularUnits, daysSince, hoursSince, bn} from '../../utils'

import {Row, Col, Table, Card, CardTitle, CardSubtitle, CardBody, Spinner} from "reactstrap"
import {withNamespaces} from 'react-i18next'

import EarnTableItem from "./EarnTableItem"
import { Link, withRouter } from "react-router-dom"

const EarnTable = (props) => {

    const context = useContext(Context)
    const [reward, setReward] = useState(0)
    const [member, setMember] = useState([])
    const [totalWeight, setTotalWeight] = useState(0)
    const [notifyMessage, setNotifyMessage] = useState("")
    const [notifyType, setNotifyType] = useState("dark")
    const [loadingHarvest, setLoadingHarvest] = useState(false)
    const [lastHarvest,setlastHarvest] = useState('100')

    useEffect(() => {
        const interval = setInterval(() => {
            if (context.account && context.walletData) {
                getData()
            }
        }, 3000);
        return () => clearInterval(interval)
        // eslint-disable-next-line
    }, [context.walletData, context.account])

    const getData = async () => {
        let data = await Promise.all([getRewards(context.account), getMemberDetail(context.account), getTotalWeight()])
        let rewards = data[0]
        let memberDetails = data[1]
        let weight = data[2]
        setReward(rewards)
        setMember(memberDetails)
        setTotalWeight(weight)
        setlastHarvest(hoursSince(memberDetails.lastBlock))
    }

    const harvest = async () => {
        setNotifyMessage('...')
        setLoadingHarvest(true)
        let gasFee = 0
        let gasLimit = 0
        let contTxn = false
        const estGasPrice = await getGasPrice()
        let contract = getDaoContract()
        console.log('Estimating gas', estGasPrice)
        await contract.methods.harvest().estimateGas({
            from: context.account,
            gasPrice: estGasPrice,
        }, function(error, gasAmount) {
            if (error) {
                console.log(error)
                setNotifyMessage('Transaction error, do you have enough BNB for gas fee?')
                setNotifyType('warning')
                setLoadingHarvest(false)
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
            setLoadingHarvest(false)
        }
        else if (enoughBNB === true) {
            console.log('Harvesting SPARTA', estGasPrice, gasLimit, gasFee)
            await contract.methods.harvest().send({
                from: context.account,
                gasPrice: estGasPrice,
                gas: gasLimit,
            }, function(error, transactionHash) {
                if (error) {
                    console.log(error)
                    setNotifyMessage('Transaction cancelled')
                    setNotifyType('warning')
                    setLoadingHarvest(false)
                }
                else {
                    console.log('txn:', transactionHash)
                    setNotifyMessage('Harvest Pending...')
                    setNotifyType('success')
                    contTxn = true
                }
            })
            if (contTxn === true) {
                setNotifyMessage('Harvested SPARTA!')
                setNotifyType('success')
                setLoadingHarvest(false)
            }
        }
        await refreshData()
    }

    const refreshData = async () => {
        if (context.walletDataLoading !== true) {
            // Refresh BNB & SPARTA balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            walletData = await updateWalletData(context.account, walletData, SPARTA_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
        // Notification to show txn complete
        setNotifyMessage('Transaction Sent!')
        setNotifyType('success')
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
                                <CardTitle><h4>Claim Rewards</h4></CardTitle>
                                <CardSubtitle className="mb-3">
                                    Witness the power of BSC's fast block-times by watching your harvest accumulate in real-time!<br/>
                                </CardSubtitle>
                                {context.walletData &&
                                    <>
                                        <Row>
                                            <Col xs='12' sm='3' className='text-center p-2'>
                                                <h5><Spinner type="grow" color="primary" className='m-2' style={{height:'15px', width:'15px'}} />{formatGranularUnits(convertFromWei(reward))} SPARTA</h5>
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={harvest}>
                                                    <i className="bx bx-log-in-circle font-size-16 align-middle"/> Harvest
                                                    {loadingHarvest === true &&
                                                        <i className="bx bx-spin bx-loader ml-1" />
                                                    }
                                                </button>
                                            </Col>
                                            <Col xs='12' sm='8' className='p-2'>
                                                <p>
                                                    <strong>{member.weight > 0 && formatAllUnits((member.weight / totalWeight)*100)}{member.weight <= 0 && 0}%</strong> of the total DAO weight represented by your wallet.<br/>
                                                    <strong>SPARTA</strong> rewards await your next visit, come back often to harvest!<br/>
                                                    <strong>{member.lastBlock > 0 && daysSince(member.lastBlock)}{member.lastBlock <= 0 && '0 minutes'}</strong> passed since your last harvest
                                                </p>
                                            </Col>
                                        </Row>
                                    </>
                                }
                                {!context.walletData && context.web3Wallet &&
                                    <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
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
                            {context.sharesData &&
                                <div className="table-responsive">
                                    <CardTitle><h4>Earn</h4></CardTitle>
                                    <CardSubtitle className="mb-3">
                                        By adding liquidity to the pools you receive Spartan Protocol LP Tokens.<br/>
                                        Earn extra SPARTA by locking these LP tokens in the DAO.
                                    </CardSubtitle>
                                    <Table className="table-centered mb-0">

                                        <thead className="center">
                                        <tr>
                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Icon")}</th>
                                            <th scope="col">{props.t("Symbol")}</th>
                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Unlocked")}</th>
                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Locked")}</th>
                                            <th scope="col">{props.t("Action")}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {context.sharesData.filter(x => x.units + x.locked > 0).sort((a, b) => (parseFloat(a.units + a.locked) > parseFloat(b.units + b.locked)) ? -1 : 1).map(c =>
                                                <EarnTableItem 
                                                    key={c.address}
                                                    symbAddr={c.address}
                                                    address={c.poolAddress}
                                                    symbol={c.symbol}
                                                    units={c.units}
                                                    locked={c.locked}
                                                    member={member}
                                                    harvest={harvest}
                                                    loadingHarvest={loadingHarvest}
                                                    lastHarvest={lastHarvest}
                                                />
                                            )}
                                            <tr>
                                                <td colSpan="5">
                                                    {context.sharesDataLoading !== true && context.sharesDataComplete === true && context.sharesData.filter(x => x.units + x.locked > 0).length > 0 &&
                                                        <div className="text-center m-2">All LP tokens loaded</div>
                                                    }
                                                    {context.sharesDataLoading !== true && context.sharesDataComplete === true && context.sharesData.filter(x => x.units + x.locked > 0).length <= 0 &&
                                                        <div className="text-center m-2">You have no LP tokens, <Link to="/pools">visit the pools</Link> to add liquidity</div>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            }
                            {context.sharesDataLoading === true &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
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

export default withRouter(withNamespaces()(EarnTable));