import React, {useContext} from "react";
import {convertFromWei, formatAllUnits, formatAllUSD, bn} from "../../utils";
import {SPARTA_ADDR} from "../../client/web3";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import {TokenIconPane} from '../Common/TokenIconPane'
import {Card, CardBody, Row, Col, UncontrolledTooltip} from "reactstrap";
import { Context } from "../../context";

const PoolPaneSide = (props) => {
    const context = useContext(Context)
    let apyConfidence = (props.pool.apy / 30000) - 1
    let depthConfidence = bn('400000000000000000000000').div(bn(props.pool.depth))
    let confidence = bn(apyConfidence).plus(bn(depthConfidence)).toFixed()
    if (confidence < 1) {confidence = 'trafficYellow'}
    else if (confidence < 10) {confidence = 'trafficOrange'}
    else {confidence = 'trafficRed'}

    return (
        <Card>
            <CardBody>
                {props.pool && context.walletData &&
                    <Row>
                        <Col xs="6">
                            <div className="text-center">
                                <div className="mb-4">
                                    {props.pool.address !== "XXX" &&
                                        <TokenIconPane address={props.pool.address}/>
                                    }
                                    {props.pool.address === "XXX" &&
                                        <img src={process.env.PUBLIC_URL + "/fallback.png"} style={{height: 50, borderRadius: 26}} alt={"Fallback Token Icon"}/>
                                    }
                                </div>
                                {props.pool.address !== "XXX" &&
                                    <h4>{props.pool.symbol}</h4>
                                }
                                {props.pool.address === "XXX" &&
                                    <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                }
                                <p className='mb-2'>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.pool.price, props.price)}</h4>
                            </div>
                        </Col>
                        <Col xs="6">
                            <div className="text-center">
                                <div className="mb-4">
                                    <TokenIconPane address={SPARTA_ADDR}/>
                                </div>
                                <h4>SPARTA</h4>
                                <p className='mb-2'>{props.t("Price")}</p>
                                <h4 className="strong">{formatAllUSD(props.price, 1)}</h4>
                            </div>
                        </Col>
                        <div className="table-responsive mt-4">
                            {context.walletDataLoading !== true &&
                                <table className="table table-centered table-nowrap  mb-2">
                                    <tbody>
                                        <tr>
                                            <td className='text-center w-50'>
                                                <p className="mb-0">Spot Price</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUnits(props.pool.price)} SPARTA</h5>
                                            </td>
                                            {/*
                                            <td>
                                                <Progress value="78" color="primary" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                        <tr>
                                            <td className='text-center'>
                                                <p className="mb-0">Volume</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUSD(convertFromWei(props.pool.volume), props.price)}</h5>
                                            </td>
                                            {/* 
                                            <td>
                                                <Progress value="51" color="success" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                        <tr>
                                            <td className='text-center'>
                                                <p className="mb-0">Tx Count</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUnits(props.pool.txCount)}</h5>
                                            </td>
                                            {/*
                                            <td>
                                                <Progress value="29" color="warning" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                        <tr>
                                            <td className='text-center'>
                                                <p className="mb-0">Fees</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUSD(convertFromWei(props.pool.fees), props.price)}</h5>
                                            </td>
                                            {/*
                                            <td>
                                                <Progress value="12" color="secondary" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                        <tr>
                                            <td className='text-center'>
                                                <p className="mb-0">Depth</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUnits(convertFromWei(props.pool.tokenAmount, props.pool.decimals))} {props.pool.symbol}</h5>
                                                <h5 className="mb-0">{formatAllUnits(convertFromWei(props.pool.baseAmount))} SPARTA</h5>
                                            </td>
                                            {/*
                                            <td>
                                                <Progress value="12" color="secondary" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                        <tr>
                                            <td className='text-center'>
                                                <p className="mb-0">APY</p>
                                            </td>
                                            <td className='text-center'>
                                                <h5 className="mb-0">{formatAllUnits( ( props.pool.apy - 10000) / 100)} %</h5>
                                                <h6 className='mb-0 font-weight-light d-inline-block'>Info</h6>
                                                <div id={props.pool.symbol + 'APY'} role='button' className={'bx bx-info-circle d-inline-block ml-1'} />
                                                    <UncontrolledTooltip placement="bottom" target={props.pool.symbol + 'APY'}>
                                                        {/* {confidence === 'trafficRed' && 'Very Low Confidence!'}
                                                        {confidence === 'trafficOrange' && 'Low Confidence!'}
                                                        {confidence === 'trafficYellow' && 'Moderate Confidence!'} */}
                                                        APY is based on the entire history of the pool!<br />
                                                        <br />Past performance is NOT a guarantee of future performance!
                                                    </UncontrolledTooltip>
                                            </td>
                                            {/*
                                            <td>
                                                <Progress value="12" color="secondary" className="bg-transparent" size="sm"/>
                                            </td>
                                            */}
                                        </tr>
                                    </tbody>
                                </table>
                            }
                            {context.walletDataLoading === true &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                        </div>
                    </Row>
                }
            </CardBody>
        </Card>

        // {/* <h4>APY</h4>
        // <h3 className="strong">{formatAPY(props.pool.apy)}</h3> */}
    )
};

export default withRouter(withNamespaces()(PoolPaneSide));