import React from 'react'
import Breadcrumbs from "../components/Common/Breadcrumb";
import LockComponent from '../components/Sections/LockComponent'
import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {Container, Row, Col} from "reactstrap";

const Earn = (props) => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("Deposit & Mint")}/>
                    <Row>
                        <Col xs="12">
                            <LockComponent/> 
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(Earn));