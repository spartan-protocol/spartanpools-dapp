import {convertFromWei, formatUnits, formatUSD, formatUSDStatBoxes} from "../utils";
import {SPARTA_ADDR} from "../client/web3";

import {withNamespaces} from "react-i18next";
import withRouter from "react-router-dom/es/withRouter";


import React from "react";
import {TokenIcon} from "../components/common";
import {

    Card,
    CardBody,

} from "reactstrap";

const PoolPaneSide = (props) => {

    return (
        <Card>
            <CardBody>
                <h4 className="card-title mb-4">{props.t("Overview")}</h4>
                <div className="text-center">
                    <div className="mb-4">
                        <TokenIcon address={props.pool.address}/>
                    </div>
                    <h2>{props.pool.symbol}</h2>
                    <br/>
                </div>
                <div className="table-responsive mt-4">
                    <table className="table table-centered table-nowrap mb-0">
                        <tbody>
                        <tr>
                            <td style={{width: "100%"}}>
                                <p className="mb-0">{props.t("Volume")}</p>
                            </td>
                            <td style={{width: "10%"}}>
                                <h5 className="mb-0">{formatUSDStatBoxes(convertFromWei(props.pool.volume), props.price)}</h5>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0">{props.t("Tx Count")}</p>
                            </td>
                            <td>
                                <h5 className="mb-0">{props.pool.txCount}</h5>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0">{props.t("Fees")}</p>
                            </td>
                            <td>
                                <h5 className="mb-0">{formatUSDStatBoxes(convertFromWei(props.pool.fees), props.price)}</h5>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="mb-0">{props.t("Depth")}</p>
                            </td>
                            <td>
                                <br/>
                                <h5 className="mb-0">{formatUnits(convertFromWei(props.pool.tokenAmount))}</h5>
                                <p>{props.pool.symbol}</p>
                                <h5 className="mb-0">{formatUnits(convertFromWei(props.pool.baseAmount))}</h5>
                                <p>SPARTA</p>
                            </td>
                            <td>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
                <div className="text-center">
                    <div className="mb-4">
                        <i className="text-primary display-4">
                            <img
                                src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/" + SPARTA_ADDR + "/logo.png"}
                                style={{height: 50}} alt='SPARTA'/></i>
                    </div>
                    <h2>SPARTA</h2>
                    <p>{props.t("Price")}</p>
                    <h3 className="strong">{formatUSD(props.pool.price, props.price)}</h3>
                </div>

            </CardBody>
        </Card>
        //           {/* <h4>APY</h4>
        //           <h3 className="strong">{formatAPY(props.pool.apy)}</h3> */}
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));