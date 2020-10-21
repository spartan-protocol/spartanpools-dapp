import React, {useContext} from "react";
import {Context} from "../../context";
import {convertFromWei, formatAllUnits, formatAllUSD} from "../../utils";
// import CardWelcome from "../../pages/Utility/card-welcome";
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
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6" lg="6" xl="3" className="d-none d-md-block">
                        <Card>
                            <CardBody>
                                <h5 className="text-muted mb-4"><i
                                    className={"bx bx-rotate-right h1 text-secondary align-middle mb-0 mr-3"}></i>{props.t("Txn Count")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3>{formatAllUnits(+props.globalData?.addLiquidityTx + +props.globalData?.removeLiquidityTx + +props.globalData?.swapTx)}</h3>
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
                                    className={"bx bx-trending-up h1 text-success align-middle mb-0 mr-3"}></i>{props.t("Total Earnings")}
                                </h5>
                                <Row>
                                    <Col xs="12">
                                        <div>
                                            <h3>{formatAllUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice)}</h3>
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