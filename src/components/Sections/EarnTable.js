import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../context";
import {getListedTokens, getRewards, getDaoContract, getPoolSharesData} from "../../client/web3";
import {LoadingOutlined} from "@ant-design/icons";
import CardTitle from "reactstrap/es/CardTitle";
import CardSubtitle from "reactstrap/es/CardSubtitle";
import Notification from '../../components/Common/notification'

import {convertFromWei} from '../../utils'

import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
} from "reactstrap";
import {withNamespaces} from 'react-i18next';

import EarnTableItem from "./EarnTableItem";
import { withRouter } from "react-router-dom";

const EarnTable = (props) => {

    const context = useContext(Context);
    const [reward, setReward] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    useEffect(() => {
        if (context.stakesData) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.stakesData])

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

    const getData = async () => {

        let rewards = await getRewards(context.walletData.address)
        console.log({rewards})
        setReward(rewards)

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
                                <h2>CLAIM REWARDS</h2>
                                {!context.stakesData &&
                                    <div style={{textAlign: "center"}}><LoadingOutlined/></div>
                                }
                                {context.stakesData &&
                                <>
                                    <h3>{convertFromWei(reward)} SPARTA</h3>
                                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={harvest}>
                                        <i className="bx bx-log-in-circle font-size-16 align-middle mr-2"></i> Harvest Yield
                                    </button>
                                    </>
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

                            {!context.stakesData &&
                            <div style={{textAlign: "center"}}><LoadingOutlined/></div>
                            }
                            {context.stakesData &&
                            <div className="table-responsive">
                                <CardTitle><h4>Earn</h4></CardTitle>
                                <CardSubtitle className="mb-3">
                                    Earn yield by depositing liquidity in the Spartan Protocol DAO.
                                </CardSubtitle>
                                <Table className="table-centered mb-0">

                                    <thead className="center">
                                    <tr>
                                        <th scope="col">{props.t("Icon")}</th>
                                        <th scope="col">{props.t("Symbol")}</th>
                                        <th className="d-none d-lg-table-cell" scope="col">{props.t("Balance")}</th>
                                        <th className="d-none d-lg-table-cell" scope="col">{props.t("Locked")}</th>
                                        <th className="d-none d-lg-table-cell" scope="col">{props.t("Harvest")}</th>
                                        <th className="d-none d-lg-table-cell" scope="col">{props.t("Lock")}</th>
                                        <th className="d-none d-lg-table-cell" scope="col">{props.t("Unlock")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {console.log(context.stakesData)}
                                    {context.stakesData.map(c =>
                                        <EarnTableItem 
                                            key={c.address}
                                            address={c.poolAddress}
                                            symbol={c.symbol}
                                            units={c.units}
                                            locked={c.locked}
                                        />
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </>
    )
};

export default withRouter(withNamespaces()(EarnTable));