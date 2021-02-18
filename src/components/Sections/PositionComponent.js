import React, {useEffect, useState} from 'react'
import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    UncontrolledCollapse,
    Button
} from "reactstrap";
import { convertFromWei, formatUnitsLong, formatAllUnits, bn, convertToWei } from '../../utils';
import { getPriceByID, getSpartaPrice } from '../../client/web3'
import { TokenIcon } from '../Common/TokenIcon'
import ReactApexChart from "react-apexcharts";

const PositionComponent = (props) => {
    useEffect(() => {
        getData()
        
        // return function cleanup() {
        //     setLoading(false)
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [symbol, setSymbol] = useState('')
    const [spartaAdds, setSpartaAdds] = useState(0)
    const [tokenAdds, setTokenAdds] = useState(0)
    const [spartaRemoves, setSpartaRemoves] = useState(0)
    const [tokenRemoves, setTokenRemoves] = useState(0)
    const [tokenBondAdds, setTokenBondAdds] = useState(0)
    const [tokenPrice, setTokenPrice] = useState(0)
    const [spartaPrice, setSpartaPrice] = useState(0)

    let options = {
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: "13px",
                        color: void 0,
                        offsetY: 60,
                    },
                    value: {
                        offsetY: 22,
                        fontSize: "16px",
                        color: void 0,
                        formatter: function (e) {
                            return e + "%"
                        },
                    },
                },
            },
        },
        colors: ["#a80005", "#f0b90b"],
        fill: {
            type: "fill",
            gradient: {
                shade: "dark",
                shadeIntensity: 0.15,
                inverseColors: !1,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 1, 1, 1],
            },
        },
        stroke: {
            dashArray: 0,
        },
        labels: ["Redeemable Pool Ownership", "Pool Ownership inc. Bond-locked"],
    }

    const getData = async () => {
        // GET TOKEN SYMBOL
        let temp = props.poolSymbol.split('-')[1]
        if (temp === 'WBNB') {
            temp = 'BNB'
        }
        setSymbol(temp)
        // get TOKEN PRICE
        let tokenIDArray = {
            'BNB': {'tokenID': 'binancecoin'},
            'USDT': {'tokenID': 'tether'},
            'BTCB': {'tokenID': 'bitcoin-bep2'},
            'BUSD': {'tokenID': 'binance-usd'},
            'RAVEN': {'tokenID': 'raven-protocol'},
            'ETH': {'tokenID': 'binance-eth'},
            'DOT': {'tokenID': 'polkadot'},
            'CREAM': {'tokenID': 'cream-2'},
            'BIFI': {'tokenID': 'beefy-finance'},
            'PROM': {'tokenID': 'prometeus'},
            'ADA': {'tokenID': 'cardano'},
            'LINK': {'tokenID': 'chainlink'},
            'BURGER': {'tokenID': 'burger-swap'},
            'XRP': {'tokenID': 'ripple'},
            'GIV': {'tokenID': 'givly-coin'}
        }
        let tokenIDReady = tokenIDArray[temp].tokenID
        let tknPrice = await getPriceByID(tokenIDReady)
        setTokenPrice(tknPrice)
        let tempPrice = await getSpartaPrice()
        setSpartaPrice(tempPrice)
        // Get sum of all token adds
        let tempArray = []
        let tempAdd = []
        for (let i = 0; i < props.adds.length; i++) {
            tempAdd = props.adds[i].filter(x => x.currency.symbol === temp)
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenAdds(tempArray)
        tempArray = []
        // Get sum of all sparta adds
        for (let i = 0; i < props.adds.length; i++) {
            tempAdd = props.adds[i].filter(x => x.currency.symbol === 'SPARTA')
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setSpartaAdds(tempArray)
        tempArray = []
        // Get sum of all token removes
        for (let i = 0; i < props.removes.length; i++) {
            tempAdd = props.removes[i].filter(x => x.currency.symbol === temp)
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenRemoves(tempArray)
        tempArray = []
        // Get sum of all sparta removes
        for (let i = 0; i < props.removes.length; i++) {
            tempAdd = props.removes[i].filter(x => x.currency.symbol === 'SPARTA')
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setSpartaRemoves(tempArray)
        tempArray = []
        // Get sum of all token bond-adds
        tempArray = props.bondAdds
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenBondAdds(tempArray)
        tempArray = []
    }

    return (
        <>
            <Col xs='12' md='6' lg='4' key={props.key}>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col xs='4 px-1 text-center my-auto'>
                                <h5>SPARTA</h5>
                            </Col>
                            <Col xs='4 px-1 text-center'>
                                <img src={"./logo192.png"} alt='SPARTA' style={{height: '40px', marginRight: '-15px'}}/>
                                <TokenIcon address={props.address}/>
                            </Col>
                            <Col xs='4 px-1 text-center my-auto'>
                                <h5>{symbol}</h5>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Row>
                                {/* TOTAL LP HOLDINGS POSITION SECTION */}
                                <Col xs='12'><h5 className="text-center">Your LP Token Value (inc Bond)</h5></Col>
                                <UncontrolledCollapse toggler="#toggler">
                                    <Row>
                                        <Col xs='12' className='text-center'><p className="text-muted mb-2">Bond-Locked LP Tokens Value</p></Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>{formatAllUnits(convertFromWei(props.userBondSparta))}</h5>
                                                <p className="text-muted mb-0">+</p>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>{symbol === 'BTCB' ? formatUnitsLong(convertFromWei(props.userBondToken)) : formatAllUnits(convertFromWei(props.userBondToken))}</h5>
                                                <p className="text-muted mb-0">+</p>
                                            </div>
                                        </Col>

                                        <Col xs='12' className='text-center'><p className="text-muted mb-2">Held LP Tokens Value</p></Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>{formatAllUnits(convertFromWei(props.userSparta))}</h5>
                                                <p className="text-muted mb-0">=</p>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-center"> 
                                                <h5>{symbol === 'BTCB' ? formatUnitsLong(convertFromWei(props.userToken)) : formatAllUnits(convertFromWei(props.userToken))}</h5>
                                                <p className="text-muted mb-0">=</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </UncontrolledCollapse>
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userBondSparta).plus(bn(props.userSparta))))}</h5>
                                        <p className="text-muted mb-0">SPARTA</p>
                                        <h5 className='pt-2'>{'$' + formatAllUnits(convertFromWei(bn(props.userBondSparta).plus(bn(props.userSparta))).toFixed(2) * spartaPrice)}</h5>
                                        <p className="text-muted mb-0">USD (Current)</p>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{symbol === 'BTCB' ? formatUnitsLong(convertFromWei(bn(props.userBondToken).plus(bn(props.userToken)))) : formatAllUnits(convertFromWei(bn(props.userBondToken).plus(bn(props.userToken))))}</h5>
                                        <p className="text-muted mb-0">{symbol}</p>
                                        <h5 className='pt-2'>{'$' + formatAllUnits(convertFromWei(bn(props.userBondToken).plus(bn(props.userToken))).toFixed(2) * tokenPrice)}</h5>
                                        <p className="text-muted mb-0">USD (Current)</p>
                                    </div>
                                </Col>

                                <Col xs='12' className="text-center"><h2>-</h2></Col>

                                {/* NET ADD REMOVE + BOND LIQ POSITION SECTION */}
                                <Col xs='12'><h5 className="text-center">NET Adds (inc Bond) & Removes</h5></Col>
                                <UncontrolledCollapse toggler="#toggler">
                                    <Row>
                                        <Col xs='12' className='text-center'><p className="text-muted mb-2">Add Liquidity to Bond+Mint (Total)</p></Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>0.00</h5>
                                                <p className="text-muted mb-0">+</p>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-center"> 
                                                <h5>{symbol === 'BTCB' ? formatUnitsLong(tokenBondAdds) : formatAllUnits(tokenBondAdds)}</h5>
                                                <p className="text-muted mb-0">+</p>
                                            </div>
                                        </Col>

                                        <Col xs='12' className='text-center'><p className="text-muted mb-2">Add / Remove Liquidity (NET)</p></Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>{formatAllUnits(bn(spartaAdds).minus(bn(spartaRemoves)))}</h5>
                                                <p className="text-muted mb-0">=</p>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-center">
                                                <h5>{symbol === 'BTCB' ? formatUnitsLong(bn(tokenAdds).minus(bn(tokenRemoves))) : formatAllUnits(bn(tokenAdds).minus(bn(tokenRemoves)))}</h5>
                                                <p className="text-muted mb-0">=</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </UncontrolledCollapse>
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{formatAllUnits(bn(spartaAdds).minus(bn(spartaRemoves)))}</h5>
                                        <p className="text-muted mb-0">SPARTA</p>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{symbol === 'BTCB' ? formatUnitsLong(bn(tokenAdds).minus(bn(tokenRemoves)).plus(bn(tokenBondAdds))) : formatAllUnits(bn(tokenAdds).minus(bn(tokenRemoves)).plus(bn(tokenBondAdds)))}</h5>
                                        <p className="text-muted mb-0">{symbol}</p>
                                    </div>
                                </Col>

                                <Col xs='12' className="text-center"><h2>=</h2></Col>
                                
                                {/* GAINS SECTION */}
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userBondSparta).plus(bn(props.userSparta)).minus(convertToWei((bn(spartaAdds).minus(bn(spartaRemoves)))))))}</h5>
                                        <p className="text-muted mb-0">SPARTA Gains</p>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-center border rounded p-2">
                                        <h5>{symbol === 'BTCB' ? formatUnitsLong(convertFromWei(bn(props.userBondToken).plus(bn(props.userToken)).minus(convertToWei((bn(tokenAdds).minus(bn(tokenRemoves)).plus(bn(tokenBondAdds))))))) : formatAllUnits(convertFromWei(bn(props.userBondToken).plus(bn(props.userToken)).minus(convertToWei((bn(tokenAdds).minus(bn(tokenRemoves)).plus(bn(tokenBondAdds)))))))}</h5>
                                        <p className="text-muted mb-0">{symbol} Gains</p>
                                    </div>
                                </Col>
                                <Col xs="12" className='mt-2'>
                                    <div className="text-center border rounded p-2">
                                        <h4>
                                            {'$' + formatAllUnits(((convertFromWei(bn(props.userBondSparta).plus(bn(props.userSparta)).minus(convertToWei((bn(spartaAdds).minus(bn(spartaRemoves))))))).toFixed(2) * spartaPrice)
                                            + 
                                            ((convertFromWei(bn(props.userBondToken).plus(bn(props.userToken)).minus(convertToWei((bn(tokenAdds).minus(bn(tokenRemoves)).plus(bn(tokenBondAdds))))))).toFixed(2) * tokenPrice))}
                                        </h4>
                                        <p className="text-muted mb-0">Gains (Current USD Value)</p>
                                    </div>
                                </Col>

                                <Button color="primary" id="toggler" className='mx-auto mt-2' style={{ marginBottom: '1rem' }}>
                                    Toggle Details
                                </Button>
                            
                                {/* <Col xs="12">
                                    <br/>
                                    <br/>
                                    <div className="text-center">
                                        <p className="text-muted mb-2">Since adds</p>
                                        <h5>
                                            + 215.53 SPARTA{" "}
                                            <span className="badge badge-success ml-1 align-bottom">
                                                + 48.5 %
                                            </span>
                                        </h5>
                                        <br/>
                                        <Button color="primary">
                                            Redeem SPARTA!
                                        </Button>
                                        <Button className='ml-2' color="primary">
                                            Redeem {symbol}
                                        </Button>
                                    </div>
                                </Col> */}
                            </Row>
                        </div>
                        <div className="mt-4 mt-sm-0">
                            <ReactApexChart
                                options={options}
                                series={[formatAllUnits(props.userPC * 100), formatAllUnits((bn(props.userPC).plus(bn(props.userBondPC))) * 100)]}
                                type="radialBar"
                                height="180"
                            />
                        </div>
                        <Col xs='12 text-center'>
                            {convertFromWei((bn(props.userBondSparta).plus(bn(props.userBondToken))).comparedTo(0)) > 0 &&
                                <>
                                    Pool ownership inc.
                                    Bond-locked: <h5>{formatAllUnits((bn(props.userPC).plus(bn(props.userBondPC))) * 100)} %</h5>
                                </>
                            }
                            Current redeemable ownership: <h5>{formatAllUnits(props.userPC * 100)} %</h5>
                        </Col>
                    </CardBody>
                </Card>
            </Col>

        </>
    )
};

export default withRouter(withNamespaces()(PositionComponent));
