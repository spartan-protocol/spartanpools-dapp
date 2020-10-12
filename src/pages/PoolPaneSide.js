import {convertFromWei, formatUnits, formatUSD, formatUSDStatBoxes} from "../utils";
import {SPARTA_ADDR} from "../client/web3";

import {withNamespaces} from "react-i18next";
import withRouter from "react-router-dom/es/withRouter";


import React from "react";
import {TokenIcon} from "../components/common";
import {
    Card,
    CardBody,
    Row,
    Col,
} from "reactstrap";

const PoolPaneSide = (props) => {

    return (
        <Card>
            <CardBody>
                <h4 className="card-title mb-4 text-center">{props.t("Overview")}</h4>

                <Row>
                    <Col xs="6">
                        <div className="text-center">
                            <div className="mb-4">
                                <TokenIcon address={props.pool.address}/>
                            </div>
                            <h4>{props.pool.symbol}</h4>
                            <p>{props.t("Price")}</p>
                            <h4 className="strong">{formatUSD(props.pool.price, props.price)}</h4>
                        </div>
                    </Col>
                    <Col xs="6">
                        <div className="text-center">
                            <div className="mb-4">
                                <TokenIcon address={SPARTA_ADDR}/>
                            </div>
                            <h4>SPARTA</h4>
                            <p>{props.t("Price")}</p>
                            <h4 className="strong">{formatUSD(props.price, 1)}</h4>
                        </div>
                    </Col>
                </Row>

                <div className="table-responsive mt-4">
                    <table className="table table-centered table-nowrap mb-0">
                        <tbody>
                        <tr>
                            <td style={{width: "50%"}}>
                                <p className="mb-0 text-left">{props.t("Volume")}</p>
                            </td>
                            <td style={{width: "50%"}}>
                                <h5 className="mb-0 text-right">{formatUSDStatBoxes(convertFromWei(props.pool.volume), props.price)}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0 text-left">{props.t("Tx Count")}</p>
                            </td>
                            <td>
                                <h5 className="mb-0 text-right">{props.pool.txCount}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0 text-left">{props.t("Fees")}</p>
                            </td>
                            <td>
                                <h5 className="mb-0 text-right">{formatUSDStatBoxes(convertFromWei(props.pool.fees), props.price)}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0 text-left">{props.t("Depth")}</p>
                            </td>
                            <td>
                                <br/>
                                <h5 className="mb-0 text-right">{formatUnits(convertFromWei(props.pool.tokenAmount))}</h5>
                                <p className="mb-0 text-right">{props.pool.symbol}</p>
                                <h5 className="mb-0 text-right">{formatUnits(convertFromWei(props.pool.baseAmount))}</h5>
                                <p className="mb-0 text-right">SPARTA</p>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
        //           {/* <h4>APY</h4>
        //           <h3 className="strong">{formatAPY(props.pool.apy)}</h3> */}
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));