import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardTitle,Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// Charts
import Gauge from "../AllCharts/echart/gaugechart";
import Line from "../AllCharts/echart/linechart";
import LineBar from "../AllCharts/echart/linebarchart";
import Doughnut from "../AllCharts/echart/doughnutchart";
import Pie from "../AllCharts/echart/piechart";
import Scatter from "../AllCharts/echart/scatterchart";
import Bubble from "../AllCharts/echart/bubblechart";
import Candlestick from "../AllCharts/echart/candlestickchart";

class EChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

            {/* Render Breadcrumb */}
            <Breadcrumbs title="Charts" breadcrumbItem="E-Charts" />
            <Row>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Line Chart</CardTitle>
                    <div id="line-chart" className="e-chart">
                      <Line />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Mix Line-Bar</CardTitle>
                    <div id="mix-line-bar" className="e-chart">
                      <LineBar />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <Card>
                  <CardBody>
                  <CardTitle>Doughnut Chart</CardTitle>
                    <div id="doughnut-chart" className="e-chart">
                      <Doughnut />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Pie Chart</CardTitle>
                    <div id="pie-chart" className="e-chart">
                      <Pie />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Scatter Chart</CardTitle>
                    <div id="scatter-chart" className="e-chart">
                      <Scatter />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Bubble Chart</CardTitle>
                    <div id="bubble-chart" className="e-chart">
                      <Bubble />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Candlestick Chart</CardTitle>
                    <div id="candlestick-chart" className="e-chart">
                      <Candlestick />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Gauge Chart</CardTitle>
                    <div id="gauge-chart" className="e-chart">
                      <Gauge />
                    </div>
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

export default EChart;
