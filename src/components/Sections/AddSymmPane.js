import {InputPaneSwap} from "./InputPaneSwap";

import {convertFromWei} from "../../utils";
import React from "react";

import {withNamespaces} from "react-i18next";

import {Col} from "reactstrap";
import {withRouter} from "react-router-dom";


export const AddSymmPane = (props) => {

    return (
        <>
            <InputPaneJoin
                paneData={props.userData}
                onInputChange={props.onAddChange}
                changeAmount={props.changeAmount}
            />
            <br/>
            <i className="bx bx-plus"/>
            <br/>
            <br/>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated Units</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{formatAllUnits(convertFromWei(props.estLiquidityUnits))}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0">Estimated Share</p>
                        </td>
                        <td>
                            <h5 className="mb-0">{`${props.getEstShare()}%`}</h5>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0">Paired Amount (SPARTA)</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h2 className="mb-0">{formatAllUnits(convertFromWei(props.liquidityData.baseAmount))}</h2>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <Col xs={12}>
                {!props.approvalToken &&
                <button color="success" type="button"
                        className="btn btn-success btn-lg btn-block waves-effect waves-light"
                        onClick={props.unlockToken}>
                    <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"/> Unlock {props.pool.symbol}
                </button>
                }
            </Col>
            <Col xs={12}>
                <br/>
                {!props.approvalBase &&
                <button color="success" type="button"
                        className="btn btn-success btn-lg btn-block waves-effect waves-light"
                        onClick={props.unlockSparta}>
                    <i className="bx bx-log-in-circle font-size-20 align-middle mr-2"/> Unlock SPARTA</button>
                }
            </Col>


            <Col xs={8}>
                {props.approvalBase && props.approvalToken && props.startTx && !props.endTx &&
                <div className="btn primary" onClick={props.addLiquidity}><i className="bx bx-spin bx-loader"/> ADD TO
                    POOL</div>
                }
                {props.approvalBase && props.approvalToken && !props.startTx &&
                <div className="btn primary" onClick={props.addLiquidity}>ADD TO POOL</div>
                }
            </Col>


        </>
    )
}


export default withRouter(withNamespaces()(AddSymmPane));