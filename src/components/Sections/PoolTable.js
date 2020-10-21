import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../context";
import {getListedPools, getListedTokens, getPoolsData, getNextPoolsData} from "../../client/web3";
import {LoadingOutlined} from "@ant-design/icons";
import CardTitle from "reactstrap/es/CardTitle";
import CardSubtitle from "reactstrap/es/CardSubtitle";

import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
} from "reactstrap";
import {withNamespaces} from 'react-i18next';

import PoolTableItem from "../Sections/PoolTableItem";
import { withRouter } from "react-router-dom";

const PoolTable = (props) => {

    const context = useContext(Context);
    const [page,setPage] = useState(2)
    const [loading,setLoading] = useState(false)
    const [completeArray,setCompleteArray] = useState(false)

    const handleNextPage = () => {
        setPage(page + 1)
        getNextPoolsData(context.tokenArray, context.poolsData, page, isLoading, isNotLoading, isCompleteArray)
        console.log(page)
      }
    
      const isLoading = () => {
        setLoading(true)
        console.log('loading more pools')
      }
      
      const isNotLoading = () => {
        setLoading(false)
        console.log('more pools loaded')
      }
    
      const isCompleteArray = () => {
        setCompleteArray(true)
        console.log('all pools loaded')
      }

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log(context.poolsData)
        // eslint-disable-next-line
    }, [loading]);

    const getData = async () => {
        let tokenArray = await getListedTokens();
        context.setContext({'poolsData': await getPoolsData(tokenArray)})
        context.setContext({'tokenArray': tokenArray});
        let poolArray = await getListedPools();
        context.setContext({'poolArray': poolArray});
    };

    return (
        <>
            <Row>
                <Col sm={12} className="mr-20">
                    <Card>
                        <CardBody>
                            {context.poolsData ? (
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
                                            {context.poolsData.map(c =>
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
                                                    {!loading && !completeArray &&
                                                        <button color="primary"
                                                        className="btn btn-primary waves-effect waves-light m-1"
                                                        onClick={handleNextPage}>
                                                        Load More
                                                        </button>
                                                    }
                                                    {loading &&
                                                        <div className="text-center m-2"><LoadingOutlined/></div>
                                                    }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div style={{textAlign: "center"}}><LoadingOutlined/></div>
                            )
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

export default withRouter(withNamespaces()(PoolTable));