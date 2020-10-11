import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardTitle,Container } from "reactstrap";

// import charts
import BarChart from "../AllCharts/chartist/barchart";
import StackBarChart from "../AllCharts/chartist/stackedbarchart";
import DountChart from "../AllCharts/chartist/dountchart";
import PieChart from "../AllCharts/chartist/piechart";
import SmilAnimationsChart from "../AllCharts/chartist/smilanimations";
import LineChart from "../AllCharts/chartist/linechart";
import ChartBar from "../AllCharts/chartist/chartbar";
import LineAreaChart from "../AllCharts/chartist/lineareachart";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import "chartist/dist/scss/chartist.scss";
import "../../assets/scss/chartist.scss";

class ChartistChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Charts" breadcrumbItem="Chartist charts" />
            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Overlapping bars on mobile</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">86541</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">2541</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">102030</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <BarChart />
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Stacked bar chart</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">5241</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">65411</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">51654</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <StackBarChart />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Animating a Donut with Svg.animate</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">748949</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">5181</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">101025</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <DountChart />
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Simple pie chart</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">48484</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">48652</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">85412</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <PieChart />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Advanced Smil Animations</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">45410</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">4442</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">3201</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <SmilAnimationsChart />
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Simple line chart</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">44242</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">75221</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">65212</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>

                    <LineChart />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Bar Diagram</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">5677</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">5542</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">12422</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>

                    <ChartBar />
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Line chart with area</CardTitle>
                    <Row className="justify-content-center">
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">4234</h5>
                          <p className="text-muted">Activated</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">64521</h5>
                          <p className="text-muted">Pending</p>
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="text-center">
                          <h5 className="mb-0 font-size-20">94521</h5>
                          <p className="text-muted">Deactivated</p>
                        </div>
                      </Col>
                    </Row>
                    <LineAreaChart />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default ChartistChart;
