import React, { Component } from 'react';
import { Col, Card, CardBody } from "reactstrap";

class CardMaintenance extends Component {

    render() {
        return (
            <React.Fragment>
                <Col md="4">
                    <Card className="mt-4 maintenance-box">
                        <CardBody>
                            {this.props.children}
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        );
    }
}

export default CardMaintenance;