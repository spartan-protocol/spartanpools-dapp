import React, {useContext} from "react";
import {convertFromWei, formatAllUnits, formatAllUSD} from "../../utils";
import {SPARTA_ADDR} from "../../client/web3";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import {TokenIcon} from '../Common/TokenIcon'
import {Card, CardBody, Row, Col} from "reactstrap";
import { Context } from "../../context";

const PoolPaneSide = (props) => {

    const context = useContext(Context)

    const back = () => {
        props.history.push('/pools')
    };

    return (

        <Card className="h-100">
            <CardBody>

                <h4 className="card-title mb-4 text-center">{props.t("Overview")}</h4>
                {props.pool && context.walletData &&
                    <Row>
                        <Col xs="6">
                            <div className="text-center">
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
                                <h4>{props.pool.symbol}</h4>
                                <p>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.pool.price, props.price)}</h4>
                            </div>
                        </Col>
                        <Col xs="6">
                            <div className="text-center">
                                <div className="mb-4">
                                    <TokenIcon address={SPARTA_ADDR}/>
                                </div>
                                <h4>SPARTA</h4>
                                <p>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.price, 1)}</h4>
                            </div>
                        </Col>

                        <div className="table-responsive mt-4">
                            {!context.walletDataLoading &&
                                <table className="table table-centered table-nowrap mb-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p className="mb-0 text-left">{props.t("Spot Price")}</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0 text-right">{formatAllUnits(props.pool.price)} SPARTA</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{width: "50%"}}>
                                                <p className="mb-0 text-left">{props.t("Volume")}</p>
                                            </td>
                                            <td style={{width: "50%"}}>
                                                <h5 className="mb-0 text-right">{formatAllUSD(convertFromWei(props.pool.volume), props.price)}</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0 text-left">{props.t("Tx Count")}</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0 text-right">{formatAllUnits(props.pool.txCount)}</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0 text-left">{props.t("Fees")}</p>
                                            </td>
                                            <td>
                                                <h5 className="mb-0 text-right">{formatAllUSD(convertFromWei(props.pool.fees), props.price)}</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0 text-left">{props.t("Depth")}</p>
                                            </td>
                                            <td>
                                                <br/>
                                                <h5 className="mb-0 text-right">{formatAllUnits(convertFromWei(props.pool.tokenAmount))}</h5>
                                                <p className="mb-0 text-right">{props.pool.symbol}</p>
                                                <h5 className="mb-0 text-right">{formatAllUnits(convertFromWei(props.pool.baseAmount))}</h5>
                                                <p className="mb-0 text-right">SPARTA</p>
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
                            <button onClick={back} type="button"
                                    className="btn btn-outline-secondary btn-md btn-block waves-effect waves-light">
                                <i className="bx bx-arrow-back font-size-12 align-middle"></i> {props.t("Back")}
                            </button>
                        </Col>
                    </Row>
                }
            </CardBody>
        </Card>
        //           {/* <h4>APY</h4>
        //           <h3 className="strong">{formatAPY(props.pool.apy)}</h3> */}
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));