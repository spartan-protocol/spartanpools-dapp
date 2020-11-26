import React from 'react'
import Breadcrumbs from "../components/Common/Breadcrumb";
import BondComponent from '../components/Sections/BondComponent'
import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {Container, Row, Col} from "reactstrap";

const Earn = (props) => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("Bond & Mint")}/>
                    <Row>
                        <Col xs="12">
                            <BondComponent name='bond' /> 
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(Earn));