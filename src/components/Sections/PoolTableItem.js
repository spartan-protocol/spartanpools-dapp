import React, {useContext} from "react";
import {Context} from "../../context";
import {TokenIcon} from '../Common/TokenIcon'
import {convertFromWei, formatAllUSD, formatAllUnits} from "../../utils";
import {UncontrolledTooltip} from "reactstrap"
import {withNamespaces} from "react-i18next";
import {Link, withRouter} from "react-router-dom";
import {bn} from "../../utils";

export const PoolTableItem = (props) => {
    const context = useContext(Context)
    const blacklist = ['0xdD1755e883a39C0D4643733E02003044a3B2D7A7']
    let apyConfidence = (props.apy / 30000) - 1
    let depthConfidence = bn('400000000000000000000000').div(bn(props.depth))
    let confidence = bn(apyConfidence).plus(bn(depthConfidence)).toFixed()
    if (confidence < 1) {confidence = 'trafficYellow'}
    else if (confidence < 10) {confidence = 'trafficOrange'}
    else {confidence = 'trafficRed'}

    return (
        <>
            {blacklist.includes(props.address) !== true &&
                <tr>
                    <td>
                        <div className="d-block mb-0"><TokenIcon address={props.address}/></div>
                        <h5 className="d-block my-2">{formatAllUSD(props.price, context.spartanPrice)}</h5>
                        <h5 className='mb-0 font-weight-light'>{props.symbol}</h5>
                        <div className='d-inline-block d-sm-none pt-2' style={{fontSize:'0.85rem'}}>APY:</div>
                        <div id={props.symbol + 'APYmobile'} role='button' className={'bx bx-info-circle d-inline-block d-sm-none ml-1'} />
                        <UncontrolledTooltip placement="bottom" target={props.symbol + 'APYmobile'}>
                            {/* {confidence === 'trafficRed' && 'Very Low Confidence!'}
                            {confidence === 'trafficOrange' && 'Low Confidence!'}
                            {confidence === 'trafficYellow' && 'Moderate Confidence!'} */}
                            APY is based on the entire history of the pool!<br />
                            <br />Past performance is NOT a guarantee of future performance!
                        </UncontrolledTooltip>
                        <h5 className='d-block d-sm-none'>{((props.apy - 10000 ) / 100).toFixed(0)} %</h5>
                    </td>
                    <td className="d-none d-lg-table-cell">
                        <h5>{formatAllUnits((props.apy - 10000 )/ 100)} %</h5>
                        <h6 className='mb-0 font-weight-light d-inline-block'>Info</h6>
                        <div id={props.symbol + 'APY'} role='button' className={'bx bx-info-circle d-inline-block ml-1'} />
                        <UncontrolledTooltip placement="bottom" target={props.symbol + 'APY'}>
                            {/* {confidence === 'trafficRed' && 'Very Low Confidence!'}
                            {confidence === 'trafficOrange' && 'Low Confidence!'}
                            {confidence === 'trafficYellow' && 'Moderate Confidence!'} */}
                            APY is based on the entire history of the pool!<br />
                            <br />Past performance is NOT a guarantee of future performance!
                        </UncontrolledTooltip>
                    </td>
                    <td className="d-none d-lg-table-cell">
                        <h5>{formatAllUSD(convertFromWei(props.depth), context.spartanPrice)}</h5>
                        <h6 className='mb-0 font-weight-light'>USD</h6>
                    </td>
                    <td className="d-none d-lg-table-cell">
                        <h5 className='mb-1'>{formatAllUnits(convertFromWei(props.volume))}</h5>
                        <h6 className='mb-0 font-weight-light d-inline-block ml-2'>SPARTA</h6>
                        <i className="bx bx-dollar-circle ml-1 align-middle body" id={props.symbol + 'Volume'} role='button'/>
                        <UncontrolledTooltip placement="bottom" target={props.symbol + 'Volume'}>Currently worth:<br/>~{formatAllUSD(convertFromWei(props.volume), context.spartanPrice)} USD</UncontrolledTooltip>
                    </td> 
                    <td className="d-none d-lg-table-cell">
                        <h5>{parseFloat(props.txCount).toLocaleString('en')}</h5>
                        <h6 className='mb-0 font-weight-light'>TXNS</h6>
                    </td>
                    {/* <td className="d-none d-lg-table-cell">
                        <h5 className='mb-1'>{formatAllUnits(convertFromWei(props.fees))}</h5>
                        <h6 className='mb-0 font-weight-light d-inline-block ml-2'>SPARTA</h6>
                        <i className="bx bx-dollar-circle ml-1 align-middle body" id={props.symbol + 'Fees'} role='button'/>
                        <UncontrolledTooltip placement="bottom" target={props.symbol + 'Fees'}>Currently worth:<br/>~{formatAllUSD(convertFromWei(props.fees), context.spartanPrice)} USD</UncontrolledTooltip>
                    </td> */}
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
                        {!context.web3Wallet &&
                        <div className='d-block d-lg-none'>
                            <h6 className='mb-1 font-weight-light'>DEPTH</h6>
                            <h6 className='mb-2'>{formatAllUSD(convertFromWei(props.depth), context.spartanPrice)}</h6>
                            <h6 className='mb-1 font-weight-light'>VOLUME</h6>
                            <h6 className='mb-0'>{formatAllUSD(convertFromWei(props.volume), context.spartanPrice)}</h6>
                        </div>
                        }
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
                </tr>
            }
        </>
)
};

export default withRouter(withNamespaces()(PoolTableItem));