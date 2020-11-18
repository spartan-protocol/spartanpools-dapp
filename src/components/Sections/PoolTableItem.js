import React, {useContext, useState, useEffect} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUSD} from "../../utils";
import {withNamespaces} from "react-i18next";
import {Link, withRouter} from "react-router-dom";

export const PoolTableItem = (props) => {

    const context = useContext(Context);
    const [listed, setListed] = useState(false)

    useEffect(() => {
        isListedAsset()
        // eslint-disable-next-line
      }, [context.walletData]); 

    const isListedAsset = async () => {
        if(props.listed == true){
            setListed(true)
        }
           

    }

    return (
        <>
            <tr>
                <td className="d-none d-lg-table-cell">
                    <TokenIcon address={props.address}/>
                </td>
                <td>
                    <div className="d-block d-lg-none mb-1"><TokenIcon address={props.address}/></div>
                    <h6 className='mb-1 font-weight-light'>{props.symbol}</h6>
                    <h6 className="d-block d-lg-none mb-0">{formatAllUSD(props.price, context.spartanPrice)}</h6>
                </td>
                <td className="d-none d-lg-table-cell">
                    <h6 className='mb-0 font-weight-light'>{formatAllUSD(props.price, context.spartanPrice)}</h6>
                </td>
                <td className="d-none d-lg-table-cell">
                    <h6 className='mb-0 font-weight-light'>{formatAllUSD(convertFromWei(props.depth), context.spartanPrice)}</h6>
                </td>
                <td className="d-none d-lg-table-cell">
                    <h6 className='mb-0 font-weight-light'>{formatAllUSD(convertFromWei(props.volume), context.spartanPrice)}</h6>
                </td>
                <td className="d-none d-lg-table-cell">
                    <h6 className='mb-0 font-weight-light'>{props.txCount.toLocaleString()}</h6>
                </td>
                <td className="d-none d-lg-table-cell">
                    <h6 className='mb-0 font-weight-light'>{formatAllUSD(convertFromWei(props.fees), context.spartanPrice)}</h6>
                </td>
                <td className='d-none d-lg-table-cell'>
                    {context.walletData && props.listed &&
                        <Link to={`/bond?pool=${props.address}`}>
                            <button color="primary" className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-lock"/> {props.t("Bond")}
                            </button>
                        </Link>
                    }
                </td>
               
               
                    <td>
                    {context.walletData &&
                        <Link to={`/pool/stake?pool=${props.address}`}>
                            <button color="primary" className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-log-in-circle"/> {props.t("Join")}
                            </button>
                        </Link>
                    }
                    
                    {context.walletData &&
                        <Link to={`/pool/swap?pool=${props.address}`}>
                            <button color="primary" className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-transfer-alt"/> {props.t("Swap")}
                            </button>
                        </Link>
                    }

                    {context.walletData && props.listed &&
                        <Link to={`/bond?pool=${props.address}`} className='d-block d-lg-none'>
                            <button color="primary" className="btn btn-primary waves-effect waves-light m-1 w-75">
                                <i className="bx bx-lock"/> {props.t("Bond")}
                            </button>
                        </Link>
                    }
                </td>
                    
                {!context.walletData && context.walletDataLoading !== true &&
                    <div><h6 className="m-1">Connect Wallet</h6></div>
                }
               
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(PoolTableItem));