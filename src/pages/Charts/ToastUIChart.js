import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardTitle,Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// import all charts
import BarChartToast from "../AllCharts/toastui/BarChartToast";
import ColumnChartToast from "../AllCharts/toastui/ColumnChartToast";
import LineChartToast from "../AllCharts/toastui/LineChartToast";
import AreaChartToast from "../AllCharts/toastui/AreaChartToast";
import BubbleChartToast from "../AllCharts/toastui/BubbleChartToast";
import ScatterChartToast from "../AllCharts/toastui/ScatterChartToast";
import PieChartToast from "../AllCharts/toastui/PieChartToast";
import DonutChartToast from "../AllCharts/toastui/DonutChartToast";
import HeatmapChartToast from "../AllCharts/toastui/HeatmapChartToast";
import TreeMapChart from "../AllCharts/toastui/TreeMapChart";
import MapChart from "../AllCharts/toastui/TreeMapChart";
import BoxPlotChart from "../AllCharts/toastui/BoxPlotChart";
import BulletChart from "../AllCharts/toastui/BulletChart";
import RadialChart from "../AllCharts/toastui/RadialChart";


class ToastUIChart extends Component {

	render() {
		const chartWidth = (window.innerWidth > 991) ? parseInt((window.innerWidth - 420) / 2) : parseInt(window.innerWidth - 100);
		return (
			<React.Fragment>
				<div className="page-content">
					<Container fluid={true}>

						<Breadcrumbs title="Charts" breadcrumbItem="Toast Ui charts" />
						<Row>
							<Col lg="6">
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Bar Chart</CardTitle>
										<BarChartToast chartWidth={chartWidth} />
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Column charts</CardTitle>
										<div className="text-center"><ColumnChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Line charts</CardTitle>
										<div className="text-center"><LineChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Area Chart</CardTitle>
										<div className="text-center"><AreaChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Bubble charts</CardTitle>
										<div className="text-center"><BubbleChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Scatter charts</CardTitle>
										<div className="text-center"><ScatterChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Pie Chart</CardTitle>
										<div className="text-center"><PieChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>
							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Donut Chart</CardTitle>
										<div className="text-center"><DonutChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Heatmap Chart</CardTitle>
										<div className="text-center"><HeatmapChartToast chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Treemap charts</CardTitle>
										<div className="text-center"><TreeMapChart chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Map charts</CardTitle>
										<div className="text-center"><MapChart chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Boxplot charts</CardTitle>
										<div className="text-center"><BoxPlotChart chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Bullet charts</CardTitle>
										<div className="text-center"><BulletChart chartWidth={chartWidth} /></div>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} md={6}>
								<Card>
									<CardBody>
										<CardTitle className="mb-4">Radial charts</CardTitle>
										<div className="text-center"><RadialChart chartWidth={chartWidth} /></div>
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

export default ToastUIChart;
