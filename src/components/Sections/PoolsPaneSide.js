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

        //console.log(props.totalVolume)

        const series1 = [{
            name: "Pooled",
            data: [0, formatAllUSD(convertFromWei(props.globalData * 2), context.spartanPrice).slice(1)]
        }];
        const options1 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#bfbfbf"],
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
            data: [0, formatAllUSD(convertFromWei(props.totalVolume), context.spartanPrice).slice(1)]
        }];
        const options2 = {
            chart: {sparkline: {enabled: !0}},
            stroke: {curve: "smooth", width: 2},
            colors: ["#bfbfbf"],
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

        // const series4 = [{
        //     name: "Earnings",
        //     data: [0, formatAllUSD(convertFromWei(props.globalData[0]), context.spartanPrice).slice(1)]
        // }];
        // const options4 = {
        //     chart: {sparkline: {enabled: !0}},
        //     stroke: {curve: "smooth", width: 2},
        //     colors: ["#46fc96"],
        //     fill: {
        //         type: "gradient",
        //         gradient: {
        //             shadeIntensity: 1,
        //             inverseColors: !1,
        //             opacityFrom: .45,
        //             opacityTo: .05,
        //             stops: [25, 100, 100, 100]
        //         }
        //     },
        //     tooltip: {enabled: false, fixed: {enabled: !1}, x: {show: !1}, marker: {show: !1}}
        // };


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
                    <Col xs="12" md="6" lg="6">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4">
                                    <i className={"bx bx-coin h1 text-primary align-middle mb-0 mr-3"}/>{props.t("Total Pooled")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className="d-inline-block">{formatAllUSD(convertFromWei(props.globalData * 2), context.spartanPrice)}</h3>
                                            <h5 className='d-inline-block ml-2'>USD</h5>
                                            <i className="bx bx-info-circle ml-1" id="globalDataTotalPooled" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTotalPooled">
                                                Total USD value of all assets locked in SpartanPools.<br/>
                                                (SPARTA * PRICE * 2)<br/>
                                                {formatAllUnits(convertFromWei(props.globalData))} * {formatAllUnits(context.spartanPrice)} * 2<br/>
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
                    <Col xs="12" md="6" lg="6">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-coin-stack h1 text-primary align-middle mb-0 mr-3"}/>{props.t("Total Volume")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className='d-inline-block'>{formatAllUnits(convertFromWei(props.totalVolume))}</h3>
                                            <h5 className='d-inline-block ml-2'>SPARTA</h5>
                                            <i className="bx bx-dollar-circle ml-1" id="globalDataTotalVol" role='button'/>
                                            <UncontrolledTooltip placement="bottom" target="globalDataTotalVol">
                                                Total value of all assets swapped in SpartanPools.<br/>
                                                Currently worth:<br/>~{formatAllUSD(convertFromWei(props.totalVolume), context.spartanPrice)} USD
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
{/*                     
                    <Col md="6" lg="6" xl="3" className="d-none d-md-block">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-trending-up h1 text-primary align-middle mb-0 mr-3"}/>{props.t("Total Earnings")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3 className='d-inline-block'>{formatAllUnits(convertFromWei(props.globalData[0]))}</h3>
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
                    </Col> */}
                </Row>
            </React.Fragment>
        )
    }

;

export default withRouter(withNamespaces()(PoolsPaneSide));