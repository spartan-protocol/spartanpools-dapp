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
                                            <h3 className="ml-20">{formatAllUSD(convertFromWei(props.globalData.totalPooled * 2), context.spartanPrice)}</h3>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options1} series={series1} type="area"
                                                                height={40}/>
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
                                            <h3>{formatAllUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice)}</h3>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options2} series={series2} type="area"
                                                                height={40}/>
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
                                            <h3>{formatAllUnits(+props.globalData?.addLiquidityTx + +props.globalData?.removeLiquidityTx + +props.globalData?.swapTx)}</h3>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options3} series={series3} type="area"
                                                                height={40}/>
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
                                            <h3>{formatAllUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice)}</h3>
                                        </div>
                                    </Col>
                                    <Col xs="12">
                                        <div>
                                            <div className="apex-charts">
                                                <ReactApexChart options={options4} series={series4} type="area"
                                                                height={40}/>
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