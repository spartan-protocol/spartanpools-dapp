import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col sm='6' className='d-none d-sm-block'>
                            A Spartan Community Project
                        </Col>
                        <Col xs='12' sm='6'>
                            <div className="text-center text-sm-right">
                                <a href='https://github.com/spartan-protocol' target='_blank' rel="noopener noreferrer"><i className='bx bxl-github bx-sm mx-1' /></a>
                                <a href='https://medium.com/spartanprotocol' target='_blank' rel="noopener noreferrer"><i className='bx bxl-medium bx-sm mx-1' /></a>
                                <a href='https://twitter.com/SpartanProtocol' target='_blank' rel="noopener noreferrer"><i className='bx bxl-twitter bx-sm mx-1' /></a>
                                <a href='https://t.me/SpartanProtocolOrg' target='_blank' rel="noopener noreferrer"><i className='bx bxl-telegram bx-sm mx-1' /></a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
