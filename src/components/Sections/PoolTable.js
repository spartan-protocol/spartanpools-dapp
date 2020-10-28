import React, {useContext} from "react";
import {Context} from "../../context";
import {getNextPoolsData, checkArrayComplete} from "../../client/web3";
import CardTitle from "reactstrap/es/CardTitle";
import CardSubtitle from "reactstrap/es/CardSubtitle";

import {Row, Col, Card, CardBody, Table} from "reactstrap";
import {withNamespaces} from 'react-i18next';

import PoolTableItem from "../Sections/PoolTableItem";
import { withRouter } from "react-router-dom";

const PoolTable = (props) => {

    const context = useContext(Context);

    const nextPoolsDataPage = async () => {
        var lastPage = await checkArrayComplete(context.tokenArray, context.poolsData)
        context.setContext({'poolsDataLoading': true})
        context.setContext({'poolsData': await getNextPoolsData(context.tokenArray, context.poolsData)})
        context.setContext({'poolsDataLoading': false})
        context.setContext({'poolsDataComplete': lastPage})
    }

    return (
        <>
            <Row>
                <Col sm={12} className="mr-20">
                    <Card>
                        <CardBody>
                            {context.poolsData &&
                                <>
                                    <div className="table-responsive">
                                        <CardTitle><h4>Pools</h4></CardTitle>
                                        <CardSubtitle className="mb-3">
                                            The liquidity pools are facilitated by an automated-market-maker (AMM) algorithm with liquidity-sensitive fees.
                                        </CardSubtitle>
                                        <Table className="table-centered mb-0">

                                            <thead className="center">
                                            <tr>
                                                <th scope="col">{props.t("Icon")}</th>
                                                <th scope="col">{props.t("Asset")}</th>
                                                <th className="d-none d-lg-table-cell" scope="col">{props.t("Price")}</th>
                                                <th className="d-none d-lg-table-cell" scope="col">{props.t("Depth")}</th>
                                                <th className="d-none d-lg-table-cell" scope="col">{props.t("Volume")}</th>
                                                <th className="d-none d-lg-table-cell" scope="col">{props.t("Txns")}</th>
                                                <th className="d-none d-lg-table-cell" scope="col">{props.t("Revenue")}</th>
                                                <th scope="col">{props.t("Action")}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {context.poolsData.sort((a, b) => (parseFloat(a.depth) > parseFloat(b.depth)) ? -1 : 1).map(c =>
                                                <PoolTableItem 
                                                key={c.address}
                                                scope="row"
                                                address={c.address}
                                                symbol={c.symbol}
                                                price={c.price}
                                                depth={c.depth}
                                                volume={c.volume}
                                                txCount={c.txCount}
                                                fees={c.fees}
                                                />
                                            )}
                                                <tr>
                                                    <td colSpan="8">
                                                        {!context.poolsDataLoading && !context.poolsDataComplete &&
                                                            <button color="primary"
                                                            className="btn btn-primary waves-effect waves-light m-1"
                                                            onClick={()=>nextPoolsDataPage()}
                                                            >
                                                            Load More
                                                            </button>
                                                        }
                                                        {context.poolsDataLoading &&
                                                            <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                                        }
                                                        {!context.poolsDataLoading && context.poolsDataComplete &&
                                                            <div className="text-center m-2">All Assets Loaded</div>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            }
                            {!context.poolsData &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

export default withRouter(withNamespaces()(PoolTable));