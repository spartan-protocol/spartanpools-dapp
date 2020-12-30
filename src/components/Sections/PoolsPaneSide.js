import React, {useContext} from "react";
import {Context} from "../../context";
import {convertFromWei, formatAllUnits, formatAllUSD} from "../../utils";
// import CardWelcome from "../../pages/Utility/card-welcome";
import ReactApexChart from "react-apexcharts";
import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

import {
    Row,
    Col,
    Card,
    CardBody,
    UncontrolledTooltip,
} from "reactstrap"

export const PoolsPaneSide = (props) => {

        const context = useContext(Context);

        const series1 = [{
            name: "Pooled",
            data: [0, formatAllUSD(convertFromWei(props.globalData.totalPooled * 2), context.spartanPrice).slice(1)]
        }];
        const options1 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#f1b44c"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: .45,
                    opacityTo: .05,
                    stops: [25, 100, 100, 100]
                }
            },
            tooltip: {enabled: false, fixed: {enabled: !1}, x: {show: !1}, marker: {show: !1}}
        };


        const series2 = [{
            name: "Volume",
            data: [0, formatAllUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice).slice(1)]
        }];
        const options2 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#3452e1"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: .45,
                    opacityTo: .05,
                    stops: [25, 100, 100, 100]
                }
            },
            tooltip: {enabled: false, fixed: {enabled: !1}, x: {show: !1}, marker: {show: !1}}
        };

        const series3 = [{
            name: "TXN",
            data: [0, +props.globalData?.addLiquidityTx + +props.globalData?.removeLiquidityTx + +props.globalData?.swapTx]
        }];
        const options3 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#50a5f1"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: .45,
                    opacityTo: .05,
                    stops: [25, 100, 100, 100]
                }
            },
            tooltip: {enabled: false, fixed: {enabled: !1}, x: {show: !1}, marker: {show: !1}}
        };


        const series4 = [{
            name: "Earnings",
            data: [0, formatAllUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice).slice(1)]
        }];
        const options4 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#46fc96"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: .45,
                    opacityTo: .05,
                    stops: [25, 100, 100, 100]
                }
            },
            tooltip: {enabled: false, fixed: {enabled: !1}, x: {show: !1}, marker: {show: !1}}
        };


        return (
            <React.Fragment>
                {/*
                <Row>
                    <Col sm={12} md={12}>
                        <CardWelcome/>
                    </Col>
                </Row>
                */}
                <Row>
                    <Col xs="12" md="6" lg="6" xl="3">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4">
                                    <i className={"bx bx-coin h1 text-warning align-middle mb-0 mr-3"}/>{props.t("Total Pooled")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className="d-inline-block">{formatAllUSD(convertFromWei(props.globalData.totalPooled * 2), context.spartanPrice)}</h3>
                                            <h5 className='d-inline-block ml-2'>USD</h5>
                                            <i className="bx bx-info-circle ml-1" id="globalDataTotalPooled" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTotalPooled">
                                                Total USD value of all assets locked in SpartanPools.<br/>
                                                (SPARTA * PRICE * 2)<br/>
                                                {formatAllUnits(convertFromWei(props.globalData.totalPooled))} * {formatAllUnits(context.spartanPrice)} * 2<br/>
                                            </UncontrolledTooltip>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options1} series={series1} type="area" height={40} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" md="6" lg="6" xl="3">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-coin-stack h1 text-primary align-middle mb-0 mr-3"}/>{props.t("Total Volume")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className='d-inline-block'>{formatAllUnits(convertFromWei(props.globalData.totalVolume))}</h3>
                                            <h5 className='d-inline-block ml-2'>SPARTA</h5>
                                            <i className="bx bx-dollar-circle ml-1" id="globalDataTotalVol" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTotalVol">
                                                Total value of all assets swapped in SpartanPools.<br/>
                                                Currently worth:<br/>~{formatAllUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice)} USD
                                            </UncontrolledTooltip>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options2} series={series2} type="area" height={40} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6" lg="6" xl="3" className="d-none d-md-block">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-rotate-right h1 text-secondary align-middle mb-0 mr-3"}/>{props.t("Txn Count")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className='d-inline-block'>{formatAllUnits(+props.globalData?.addLiquidityTx + +props.globalData?.removeLiquidityTx + +props.globalData?.swapTx)}</h3>
                                            <h5 className='d-inline-block ml-2'>Transactions</h5>
                                            <i className="bx bx-info-circle ml-1" id="globalDataTxns" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTxns">
                                                Total count of all transactions.<br/>
                                                Add liq - {formatAllUnits(+props.globalData?.addLiquidityTx)}<br/>
                                                Remove liq - {formatAllUnits(+props.globalData?.removeLiquidityTx)}<br/>
                                                Swaps - {formatAllUnits(+props.globalData?.swapTx)}
                                            </UncontrolledTooltip>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options3} series={series3} type="area" height={40} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6" lg="6" xl="3" className="d-none d-md-block">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-trending-up h1 text-success align-middle mb-0 mr-3"}/>{props.t("Total Earnings")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className='d-inline-block'>{formatAllUnits(convertFromWei(props.globalData.totalFees))}</h3>
                                            <h5 className='d-inline-block ml-2'>SPARTA</h5>
                                            <i className="bx bx-dollar-circle ml-1" id="globalDataTotalEarnings" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTotalEarnings">
                                                Total value of all swap fees absorbed into SpartanPools.<br/>
                                                Currently worth<br/>~{formatAllUSD(convertFromWei(props.globalData.totalFees), context.spartanPrice)} USD
                                            </UncontrolledTooltip>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options4} series={series4} type="area" height={40} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

;

export default withRouter(withNamespaces()(PoolsPaneSide));