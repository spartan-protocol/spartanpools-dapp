import React, { Component } from "react"
import ReactApexChart from "react-apexcharts"
import "./dashboard.scss"

class ApexRadial extends Component {
    constructor(props) {
        super(props)

        this.state = {
            options: {
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: "13px",
                                color: void 0,
                                offsetY: 60,
                            },
                            value: {
                                offsetY: 22,
                                fontSize: "16px",
                                color: void 0,
                                formatter: function (e) {
                                    return e + "%"
                                },
                            },
                        },
                    },
                },
                colors: ["#a80005"],
                fill: {
                    type: "fill",
                    gradient: {
                        shade: "dark",
                        shadeIntensity: 0.15,
                        inverseColors: !1,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 1, 1, 1],
                    },
                },
                stroke: {
                    dashArray: 0,
                },
                labels: [""],
            },
            series: [20.3],
        }
    }

    render() {
        return (
            <React.Fragment>
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="radialBar"
                    height="180"
                />
            </React.Fragment>
        )
    }
}

export default ApexRadial
