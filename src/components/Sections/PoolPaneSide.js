import React, {useContext} from "react";
import {convertFromWei, formatAllUnits, formatAllUSD} from "../../utils";
import {SPARTA_ADDR} from "../../client/web3";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import {TokenIcon} from '../Common/TokenIcon'
import {Card, CardBody, Row, Col, FormGroup, Label, Input, InputGroup, InputGroupAddon, Button, Form, Table, CardTitle, CardSubtitle} from "reactstrap";
import { Context } from "../../context";

const PoolPaneSide = (props) => {

    const context = useContext(Context)

    return (

        <Card>
            <CardBody>
            <h4 className="card-title">Overview</h4>
                <div className="border p-3 rounded mt-4">
                    <Row>
                        <Col lg="6">
                            <div className="d-flex align-items-center mb-3">
                                <div className="avatar-xs mr-3">
                                    <div className="mb-4">
                                        {props.address !== "XXX" &&
                                            <TokenIcon address={props.address}/>
                                        }
                                        {props.address === "XXX" &&
                                            <img
                                            src={process.env.PUBLIC_URL + "/fallback.png"}
                                            style={{height:40,borderRadius:21}}
                                            alt={"Fallback Token Icon"}
                                            />
                                        }
                                    </div>
                                </div>
                                <h5 className="font-size-14 mb-0">{props.pool.symbol}</h5>
                            </div>
                            <Row>
                                <div className="col-lg-6">
                                    <div className="text-muted mt-3">
                                        <p>Price</p>
                                        <h4>{formatAllUSD(props.pool.price, props.price)}</h4>
                                    </div>
                                </div>

                                <div className="col-lg-6 align-self-end">
                                    <div className="float-right mt-3">
                                    </div>
                                </div>
                            </Row>
                        </Col>
                        <Col lg="6">
                            <div className="d-flex align-items-center mb-3">
                                <div className="avatar-xs mr-3">
                                    <div className="mb-4">
                                        <TokenIcon address={SPARTA_ADDR}/>
                                    </div>
                                </div>
                                <h5 className="font-size-14 mb-0">SPARTA</h5>
                            </div>
                            <Row>
                                <div className="col-lg-6">
                                    <div className="text-muted mt-3">
                                        <p>Price</p>
                                        <h4>{formatAllUSD(props.price, 1)}</h4>
                                    </div>
                                </div>
                                <div className="col-lg-6 align-self-end">
                                    <div className="float-right mt-3">
                                    </div>
                                </div>
                            </Row>
                            <br/>
                        </Col>
                        {!context.walletDataLoading &&
                            <div className="d-flex align-items-center mb-3">
                                <div className="table-responsive">
                                    <Table className="table-centered table-nowrap mb-0">
                                        <thead>
                                        <tr>
                                            <th>Spot Price</th>
                                            <th>Volume</th>
                                            <th>Tx Count</th>
                                            <th>Depth</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{formatAllUnits(props.pool.price)} SPARTA</td>
                                            <td>{formatAllUSD(convertFromWei(props.pool.volume), props.price)}</td>
                                            <td>{formatAllUnits(props.pool.txCount)}</td>
                                            <td>{formatAllUnits(convertFromWei(props.pool.tokenAmount))} SPARTA</td>
                                        </tr>
                                        <tr>
                                            <th scope="row"></th>
                                            <td></td>
                                            <td></td>
                                            <td>{formatAllUnits(convertFromWei(props.pool.baseAmount))} {props.pool.symbol}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        }
                        {context.walletDataLoading &&
                            <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                        }
                    </Row>
                </div>
            </CardBody>
            <CardBody>
            </CardBody>
        </Card>
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));