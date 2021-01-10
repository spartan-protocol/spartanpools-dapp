import React from 'react'
import Breadcrumbs from "../components/Common/Breadcrumb";
import EarnTable from '../components/Sections/EarnTable'
import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {Container, Row, Col} from "reactstrap";

const DAOLock = (props) => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("Earn")}/>
                    <Row>
                        <Col xs="12">
                            <EarnTable/>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(DAOLock));
