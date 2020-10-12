import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Countdown
import Countdown from "react-countdown";

//Import Images
import logo from "../../assets/images/logo-dark.png";
import maintanence from "../../assets/images/maintenance.png";

class PagesComingsoon extends Component {
    constructor() {
        super();
        this.renderer.bind(this)
    }

    renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>You are good to go!</span>;
        } else {
            // Render a countdown
            return <>
            <div className="coming-box">{days} <span>Days</span></div> <div className="coming-box">{hours} <span>Hours</span></div> <div className="coming-box">{minutes} <span>Minutes</span></div> <div className="coming-box">{seconds} <span>Seconds</span></div>
            </>
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-white"><i className="fas fa-home h2"></i></Link>
                </div>

                <div className="my-5 pt-sm-5">
                    <Container>
                        <Row>
                            <Col lg="12">
                                <div className="text-center">
                                    <Link to="/">
                                        <img src={logo} alt="logo" height="24" />
                                    </Link>
                                    <Row className="justify-content-center mt-5">
                                        <Col sm="4">
                                            <div className="maintenance-img">
                                                <img src={maintanence} alt="" className="img-fluid mx-auto d-block" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <h4 className="mt-5">Let's get started with Skote</h4>
                                    <p className="text-muted">It will be as simple as Occidental in fact it will be Occidental.</p>

                                    <Row className="justify-content-center mt-5">
                                        <Col md="8">
                                            <div className="counter-number">
                                                <Countdown
                                                    date="2020/12/31"
                                                    renderer={this.renderer}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default PagesComingsoon;