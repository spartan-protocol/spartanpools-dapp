import React from "react";

import InputPane from "./InputPane";

import {convertFromWei} from "../utils";
import {LoadingOutlined, UnlockOutlined} from "@ant-design/icons";


import {
    Button,
} from "reactstrap"

import {withNamespaces} from "react-i18next";
import withRouter from "react-router-dom/es/withRouter";



export const TradePane = (props) => {

    return (
        <>
            <InputPane
                pool={props.pool}
                paneData={props.tradeData}
                onInputChange={props.onTradeChange}
                changeAmount={props.changeTradeAmount}
            />
            <br/>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">{props.t("Slip")}</p>
                        </td>
                        <td>
                            <h5 className="mb-0 text-right">{`${((props.tradeData.slip) * 100).toFixed(0)}%`}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0 text-left">{props.t("Output")}</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h3 className="mb-0 text-right"> {convertFromWei(props.tradeData.output)} {props.tradeData.outputSymbol}</h3>
                        </td>
                    </tr>


                    </tbody>
                </table>
            </div>
            <br/><br/>
            <div className="text-left">
                {!props.approval &&
                <Button size="lg" color="success" onClick={props.unlock}><UnlockOutlined/>{props.t("Unlock")}</Button>
                }

                {props.approval && props.startTx && !props.endTx &&
                <Button size="lg" color="success" onClick={props.trade}>
                    <LoadingOutlined/>{`${props.type} ${props.pool.symbol}`}</Button>
                }

                {props.approval && !props.startTx && (props.tradeData.balance > 0) &&
                <Button
                    size="lg" color="success" onClick={props.trade}>{`${props.type} ${props.pool.symbol}`}</Button>
                }
            </div>
        </>
    )
};


export default withRouter(withNamespaces()(TradePane));