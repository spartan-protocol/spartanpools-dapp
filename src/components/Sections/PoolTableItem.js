import React, {useContext} from "react";
import {Context} from "../../context";
import { TokenIcon } from '../Common/TokenIcon'
import {convertFromWei, formatAllUSD} from "../../utils";
import Button from "antd/es/button";


import {withNamespaces} from "react-i18next";
import {Link, withRouter} from "react-router-dom";


export const PoolTableItem = (props) => {

    const context = useContext(Context);

    return (
        <>

            <tr>
                <td>

                    <TokenIcon address={props.address}/>

                </td>

                <td>
                    {props.symbol}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUSD(props.price, context.spartanPrice)}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUSD(convertFromWei(props.depth), context.spartanPrice)}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUSD(convertFromWei(props.volume), context.spartanPrice)}
                </td>
                <td className="d-none d-lg-table-cell">
                    {props.txCount.toLocaleString()}
                </td>
                <td className="d-none d-lg-table-cell">
                    {formatAllUSD(convertFromWei(props.fees), context.spartanPrice)}
                </td>
                <td>
                    <Link to={`/pool/stake?pool=${props.address}`}>
                        <Button color="primary"
                                className="btn btn-primary waves-effect waves-light m-1 w-75">
                            <i className="bx bx-log-in-circle"></i> {props.t("Join")}
                        </Button>
                    </Link>
                    <Link to={`/pool/swap?pool=${props.address}`}>
                        <button type="button"
                                className="btn btn-primary waves-effect waves-light m-1 w-75">
                            <i className="bx bx-transfer-alt"></i> {props.t("Swap")}
                        </button>
                    </Link>
                </td>

            </tr>
        </>
    )
};

export default withRouter(withNamespaces()(PoolTableItem));