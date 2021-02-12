import React, {useEffect, useState} from 'react'
import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    // Button
} from "reactstrap";
import {convertFromWei, formatAllUnits, bn, convertToWei} from '../../utils';
import {TokenIcon} from '../Common/TokenIcon'
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
                                <Col xs="6">
                                    <div>
                                        <p className="text-muted mb-2">SPARTA Adds</p>
                                        <h5>{formatAllUnits(spartaAdds)}</h5>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-right">
                                        <p className="text-muted mb-2">{symbol} Adds</p>
                                        <h5>{formatAllUnits(tokenAdds)}</h5>
                                    </div>
                                </Col>

                                <Col xs="6">
                                    <div>
                                        <p className="text-muted text-cross mb-2"><del>SPARTA Minted</del></p>
                                        <h5>0.00</h5>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-right">
                                        <p className="text-muted mb-2"> {symbol} Bonds</p>
                                        <h5>{formatAllUnits(tokenBondAdds)}</h5>
                                    </div>
                                </Col>

                                <Col xs="6">
                                    <div>
                                        <p className="text-muted mb-2">SPARTA
                                            Removals</p>
                                        <h5>{formatAllUnits(spartaRemoves)}</h5>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-right">
                                        <p className="text-muted mb-2">{symbol} Removals</p>
                                        <h5>{formatAllUnits(tokenRemoves)}</h5>
                                    </div>
                                </Col>

                                <Col xs="6">
                                    <div>
                                        <p className="text-muted mb-2"> Redeemable SPARTA<br/>exc. locked in Bond</p>
                                        <h5>{formatAllUnits(convertFromWei(props.userSparta))}</h5>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-right">
                                        <p className="text-muted mb-2"> Redeemable {symbol}<br/>exc. locked in Bond</p>
                                        <h5>{formatAllUnits(convertFromWei(props.userToken))}</h5>
                                    </div>
                                </Col>

                                {convertFromWei((bn(props.userBondSparta).plus(bn(props.userBondToken))).comparedTo(0)) > 0 &&
                                    <>
                                        <Col xs="6">
                                            <div>
                                                <p className="text-muted mb-2"> SPARTA Gains<br/>
                                                    exc. Locked in BOND</p>
                                                <h5>{formatAllUnits(convertFromWei(bn(props.userSparta).minus(bn(convertToWei(spartaAdds))).plus(bn(convertToWei(spartaRemoves)))))}</h5>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-right">
                                                <p className="text-muted mb-2">{symbol} Gains<br/>
                                                    exc. Locked in BOND</p>
                                                <h5>{formatAllUnits(convertFromWei(bn(props.userToken).minus(bn(convertToWei(tokenAdds))).plus(bn(convertToWei(tokenRemoves)))))}</h5>
                                            </div>
                                        </Col>

                                        <Col xs="6">
                                            <div>
                                                <p className="text-muted mb-2">SPARTA value<br/>
                                                    Locked in BOND</p>
                                                <h5>{formatAllUnits(convertFromWei(props.userBondSparta))}</h5>
                                            </div>
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-right">
                                                <p className="text-muted mb-2">{symbol} value<br/>
                                                    Locked in BOND</p>
                                                <h5>{formatAllUnits(convertFromWei(props.userBondToken))}</h5>
                                            </div>
                                        </Col>

                                    </>
                                }
                                <Col xs="6">
                                    <div>
                                        <p className="text-muted mb-2"> SPARTA Gains<br/>
                                            inc. Locked in BOND</p>
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userSparta).plus(bn(props.userBondSparta)).minus(bn(convertToWei(spartaAdds))).plus(bn(convertToWei(spartaRemoves)))))}</h5>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="text-right">
                                        <p className="text-muted mb-2">{symbol} Gains<br/>
                                            inc. Locked in BONDD</p>
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userToken).plus(props.userBondToken).minus(bn(convertToWei(tokenAdds))).plus(bn(convertToWei(tokenRemoves)))))}</h5>
                                    </div>
                                </Col>
                            
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
