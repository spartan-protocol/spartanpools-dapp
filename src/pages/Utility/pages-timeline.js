import React, { Component } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


//Import Vertical list
import LiVerticalTimeline from "./li-vertical-timeline";

class PagesTimeline extends Component {
    state = {
        events : [
            { id : 1, date : "December, 2019", title : "First event", desc : "It will be as simple as occidental in fact tu will be Cambridge" },
            { id : 2, date : "January, 2020", title : "Second event", desc : "To an English person, tu will seem like simplified English existence." },
            { id : 3, date : "February, 2020", title : "Third event", desc : "For science, music, sport, etc, Europe uses the same vocabulary." },
            { id : 4, date : "March, 2020", title : "Fourth event", desc : "New common language will be more simple than existing." },
            { id : 5, date : "April, 2020", title : "Fifth event", desc : "It will be as simple as occidental in fact tu will be Cambridge" },
            { id : 6, date : "May, 2020", title : "Sixth event", desc : "To an English person, tu will seem like simplified English existence." }
        ],
        statuses: [
            { id: 1, stausTitle: "Ordered", iconClass: "bx-copy-alt", description: "New common language will be more simple than existing." },
            { id: 2, stausTitle: "Packed", iconClass: "bx-package", description: "To an English person, tu will seem like simplified English existence." },
            { id: 3, stausTitle: "Shipped", iconClass: "bx-car", description: "It will be as simple as occidental in fact tu will be Cambridge" },
            { id: 4, stausTitle: "Delivered", iconClass: "bx-badge-check", description: "To an English person, tu will seem like simplified English existence." },
        ],
        responsive: {
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
        },

        step1 : true,
        step2 : false
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <div className="container-fluid">

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Utility" breadcrumbItem="Timeline" />

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Horizontal Timeline</CardTitle>
                                      
                                         <div className="hori-timeline">
                                            <div className="owl-carousel owl-theme  navs-carousel events" id="timeline-carousel">

                                               {this.state.step1 ?
                                               <>
                                                <div className="item event-list" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">12 September</div>
                                                            <h5 className="mb-4">First event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">It will be as simple as occidental in fact it will be Cambridge</p>
                                                        </div>
                                                    </div>
                                                </div>
                
                                                <div className="item event-list" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">06 October</div>
                                                            <h5 className="mb-4">Second event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">To an English person, it will seem like simplified English existence.</p>
                                                        </div>
                                                    </div>
                                                </div>
                
                                                <div className="item event-list active" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">25 October</div>
                                                            <h5 className="mb-4">Third event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">For science, music, sport, etc, Europe uses the same vocabulary.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                               </> : null}

                                               {this.state.step2 ?
                                               <>

                                                <div className="item event-list" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">04 November</div>
                                                            <h5 className="mb-4">Fourth event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">New common language will be more simple than existing.</p>
                                                        </div>
                                                    </div>
                                                </div>
                
                                                <div className="item event-list" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">19 November</div>
                                                            <h5 className="mb-4">Sixth event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">It will be as simple as occidental in fact it will be Cambridge</p>
                                                        </div>
                                                    </div>
                                                </div>
                
                                                <div className="item event-list" style={{ display : "inline-table"}}>
                                                    <div>
                                                        <div className="event-date">
                                                            <div className="text-primary mb-1">21 December</div>
                                                            <h5 className="mb-4">Seventh event</h5>
                                                        </div>
                                                        <div className="event-down-icon">
                                                            <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                                                        </div>
                
                                                        <div className="mt-3 px-3">
                                                            <p className="text-muted">To an English person, it will seem like simplified English existence.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                               </> : null}
                                               

                                                <div className="owl-nav" style={{ textAlign : "center" }}>
                                                   <button type="button" onClick={() => {  this.setState({ step1 : true, step2 : false }) } }  className="border-0" disabled={ this.state.step1 } ><i className="mdi mdi-chevron-left"></i></button>
                                                   <button type="button" onClick={() => {  this.setState({ step1 : false, step2 : true }) } } className="border-0" disabled={ this.state.step2 } ><i className="mdi mdi-chevron-right"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-5">Vertical Timeline</CardTitle>
                                        <div className="">
                                            <ul className="verti-timeline list-unstyled">
                                                {/* Render Horizontal Timeline Events */}
                                                {
                                                    this.state.statuses.map((status, key) =>
                                                        <LiVerticalTimeline status={status} key={"_status_" + key} />
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PagesTimeline;