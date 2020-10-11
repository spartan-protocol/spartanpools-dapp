import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Cards
import CardMaintenance from "./card-maintenance";

//Import Images
import maintenance from "../../assets/images/maintenance.png";
import logo from "../../assets/images/logo-dark.png";

class PagesMaintenance extends Component {
    render() {
        return (
            <React.Fragment>
                <section className="my-5 pt-sm-5">
                    <Container>
                        <Row>
                            <Col xs="12" className="text-center">
                                <div className="home-wrapper">
                                    <div className="mb-5">
                                        <img src={logo} alt="logo" height="24" />
                                    </div>

                                    <Row className="justify-content-center">
                                        <Col sm={4}>
                                            <div className="maintenance-img">
                                                <img src={maintenance} alt="" className="img-fluid mx-auto d-block" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <h3 className="mt-5">Site is Under Maintenance</h3>
                                    <p>Please check back in sometime.</p>

                                    <Row>
                                        <CardMaintenance>
                                            <i className="bx bx-broadcast mb-4 h1 text-primary"></i>
                                            <h5 className="font-size-15 text-uppercase">Why is the Site Down?</h5>
                                            <p className="text-muted mb-0">There are many variations of passages of
                                                Lorem Ipsum available, but the majority have suffered alteration.</p>
                                        </CardMaintenance>

                                        <CardMaintenance>
                                            <i className="bx bx-time-five mb-4 h1 text-primary"></i>
                                            <h5 className="font-size-15 text-uppercase">
                                                What is the Downtime?</h5>
                                            <p className="text-muted mb-0">Contrary to popular belief, Lorem Ipsum is not
                                                simply random text. It has roots in a piece of classNameical.</p>
                                        </CardMaintenance>

                                        <CardMaintenance>
                                            <i className="bx bx-envelope mb-4 h1 text-primary"></i>
                                            <h5 className="font-size-15 text-uppercase">
                                                Do you need Support?</h5>
                                            <p className="text-muted mb-0">If you are going to use a passage of Lorem
                                            Ipsum, you need to be sure there isn't anything embar..
                                                <Link to="mailto:no-reply@domain.com" className="text-decoration-underline">no-reply@domain.com</Link></p>
                                        </CardMaintenance>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        );
    }
}

export default PagesMaintenance;