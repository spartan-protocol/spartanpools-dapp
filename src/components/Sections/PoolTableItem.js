import React, {useContext} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUSD} from "../../utils";

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
                    <h6 className="d-block d-lg-none mb-0">{formatAllUSD(props.price, context.spartanPrice)}</h6>
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
                    {context.walletData &&
                        <Link to={`/pool/stake?pool=${props.address}`}>
                            <button color="primary"
                                    className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-log-in-circle"/> {props.t("Join")}
                            </button>
                        </Link>
                    }
                    {context.walletData &&
                        <Link to={`/pool/swap?pool=${props.address}`}>
                            <button color="primary"
                                    className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-transfer-alt"/> {props.t("Swap")}

                            </button>
                        </Link>
                    }
                    {!context.walletData && context.walletDataLoading !== true &&
                        <div><h6 className="m-1">Connect Wallet</h6></div>
                    }
                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(PoolTableItem));