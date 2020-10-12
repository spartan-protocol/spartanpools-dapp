import React, { Component } from 'react';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class PagesStarter extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Info" breadcrumbItem="Starter Page" />

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default PagesStarter;