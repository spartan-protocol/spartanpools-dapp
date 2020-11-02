import React, {useContext} from "react";
import {convertFromWei, formatAllUnits, formatAllUSD} from "../../utils";
import {SPARTA_ADDR} from "../../client/web3";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import {TokenIconPane} from '../Common/TokenIconPane'
import {Card, CardBody, Row, Col, Progress} from "reactstrap";
import { Context } from "../../context";

const PoolPaneSide = (props) => {
    const context = useContext(Context)

    return (
        <Card>
            <CardBody>
                <h4 className="card-title mb-4 text-center">{props.t("Overview")}</h4>
                {props.pool && context.walletData &&
                    <Row>
                        <Col xs="6">
                            <div className="text-center">
                                <div className="mb-4">
                                    {props.address !== "XXX" &&
                                        <TokenIconPane address={props.pool.address}/>
                                    }
                                    {props.address === "XXX" &&
                                        <img src={process.env.PUBLIC_URL + "/fallback.png"} style={{height: 40, borderRadius: 21}} alt={"Fallback Token Icon"}/>
                                    }
                                </div>
                                <h4>{props.pool.symbol}</h4>
                                <p>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.pool.price, props.price)}</h4>
                            </div>
                        </Col>
                        <Col xs="6">
                            <div className="text-center">
                                <div className="mb-4">
                                    <TokenIconPane address={SPARTA_ADDR}/>
                                </div>
                                <h4>SPARTA</h4>
                                <p>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.price, 1)}</h4>
                            </div>
                        </Col>
                        <div className="table-responsive mt-4">
                            {!context.walletDataLoading &&
                                <table className="table table-centered table-nowrap  mb-2">
                                    <tbody>
                                        <tr>
                                            <td style={{width: "30%"}}>
                                                <p className="mb-0">Spot Price</p>
                                            </td>
                                            <td style={{width: "25%"}}>
                                                <h5 className="mb-0">{formatAllUnits(props.pool.price)} SPARTA</h5></td>
                                            <td>
                                                <Progress value="78" color="primary" className="bg-transparent" size="sm"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Volume</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0">{formatAllUSD(convertFromWei(props.pool.volume), props.price)}</h5>
                                            </td>
                                            <td>
                                                <Progress value="51" color="success" className="bg-transparent" size="sm"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Tx Count</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0">{formatAllUnits(props.pool.txCount)}</h5>
                                            </td>
                                            <td>
                                                <Progress value="29" color="warning" className="bg-transparent" size="sm"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Fees</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0">{formatAllUSD(convertFromWei(props.pool.fees), props.price)}</h5>
                                            </td>
                                            <td>
                                                <Progress value="12" color="secondary" className="bg-transparent" size="sm"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Depth</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0">{formatAllUnits(convertFromWei(props.pool.tokenAmount))} {props.pool.symbol}</h5>
                                                <h5 className="mb-0">{formatAllUnits(convertFromWei(props.pool.baseAmount))} SPARTA</h5>
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                            {context.walletDataLoading &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                        </div>
                        <Col>
                            <br/>
                            <br/>
                            <br/>
                        </Col>
                    </Row>
                }
            </CardBody>
        </Card>

        // {/* <h4>APY</h4>
        // <h3 className="strong">{formatAPY(props.pool.apy)}</h3> */}
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));