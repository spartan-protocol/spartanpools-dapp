import React, { Component } from 'react';
import { Row, Col, Card } from "reactstrap";

//Import Image
import features from "../../assets/images/crypto/features-img/img-1.png"
import {withNamespaces} from 'react-i18next';
import { withRouter } from "react-router-dom";

class CardWelcome extends Component {
    render() {
        return (
            <React.Fragment>
                <Card>
                    <div>
                        <Row>
                            <Col lg="9" sm="8">
                                <div  className="p-4">
                                    <h3 className="text-primary">Welcome to Spartan Protocol!</h3>
                                    <h5>A protocol for incentivized liquidity on Binance Smart Chain</h5>

                                    <div className="text-muted">
                                        <p className="mb-1"><i className="mdi mdi-circle-medium align-middle text-primary mr-1"></i> Add Liquidity</p>
                                        <p className="mb-1"><i className="mdi mdi-circle-medium align-middle text-primary mr-1"></i> Swap Tokens</p>
                                        <p className="mb-0"><i className="mdi mdi-circle-medium align-middle text-primary mr-1"></i> Earn from Fees</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg="3" sm="4" className="align-self-center">
                                <div>
                                    <img src={features} alt="" className="img-fluid d-block"/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </React.Fragment>
        );
    }
}
export default withRouter(withNamespaces()(CardWelcome));
