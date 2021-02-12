import React, {useContext} from "react";
import {Context} from "../../context";
import CardTitle from "reactstrap/es/CardTitle";
import CardSubtitle from "reactstrap/es/CardSubtitle";

import {Row, Col, Card, CardBody, Table, UncontrolledTooltip} from "reactstrap";
import {withNamespaces} from 'react-i18next';

import PoolTableItem from "../Sections/PoolTableItem";
import { withRouter } from "react-router-dom";

const PoolTable = (props) => {

    const context = useContext(Context);

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
                                            The liquidity pools are facilitated by an automated-market-maker (AMM) algorithm with liquidity-sensitive fees.<br />
                                            The following pools are 'curated' which means they receive bonus dividends: BNB, USDT, BTCB, BUSD & ETH
                                        </CardSubtitle>
                                        <Table className="table-centered mb-0">

                                            <thead className="center">
                                            <tr>
                                                <th scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("Price")}</h5>
                                                    <i className="bx bx-info-circle ml-1 align-middle body" id='priceHeader' role='button'/>
                                                    <UncontrolledTooltip placement="bottom" target="priceHeader">Price of asset vs SPARTA in the pool</UncontrolledTooltip>
                                                </th>
                                                <th className="d-none d-lg-table-cell" scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("APY")}</h5>
                                                    <i className="bx bx-info-circle ml-1 align-middle body" id='apyHeader' role='button'/>
                                                    <UncontrolledTooltip placement="bottom" target="apyHeader">APY of pool based on complete history<br />Past performance is NOT a guarantee of future performance!</UncontrolledTooltip>
                                                </th>
                                                <th className="d-none d-lg-table-cell" scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("Depth")}</h5>
                                                    <i className="bx bx-info-circle ml-1 align-middle" id='depthHeader' role='button'/>
                                                    <UncontrolledTooltip placement="bottom" target="depthHeader">Total USD value of assets in the pool.<br/> (SPARTA held in pool * 2 * PRICE)</UncontrolledTooltip>
                                                </th>
                                                <th className="d-none d-lg-table-cell" scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("Volume")}</h5>
                                                    <i className="bx bx-info-circle ml-1 align-middle body" id='volumeHeader' role='button'/>
                                                    <UncontrolledTooltip placement="bottom" target="volumeHeader">Total value of all assets swapped in the pool.</UncontrolledTooltip>
                                                </th>
                                                <th className="d-none d-lg-table-cell" scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("Txns")}</h5>
                                                    <i className="bx bx-info-circle ml-1 align-middle body" id='txnsHeader' role='button'/>
                                                    <UncontrolledTooltip placement="bottom" target="txnsHeader">
                                                        Total count of add, remove & swap transactions.<br/>
                                                    </UncontrolledTooltip>
                                                </th>
                                                {/* <th className="d-none d-lg-table-cell" scope="col">
                                                    <h5 className='d-inline-block mb-0'>{props.t("Revenue")}</h5>
                                                </th> */}
                                                {context.web3Wallet &&
                                                    <>
                                                        <th className="d-none d-lg-table-cell" scope="col">
                                                            <h5 className='d-inline-block mb-0'>{props.t("Bond")}</h5>
                                                        </th>
                                                        <th scope="col">{props.t("Trade")}</th>
                                                    </>
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {context.poolsData.sort((a, b) => (parseFloat(a.depth) > parseFloat(b.depth)) ? -1 : 1).map(c =>
                                                <PoolTableItem 
                                                key={c.address}
                                                scope="row"
                                                address={c.address}
                                                symbol={c.symbol}
                                                decimals={c.decimals}
                                                price={c.price}
                                                depth={c.depth}
                                                volume={c.volume}
                                                txCount={c.txCount}
                                                fees={c.fees}
                                                listed={c.bondListed}
                                                apy={c.apy}
                                                />
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            }
                            {context.poolsDataLoading === true &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                            {context.poolsDataLoading !== true && context.poolsDataComplete === true &&
                                <div className="text-center m-2">All Assets Loaded</div>
                            }
                            {!context.poolsData && context.web3Wallet &&
                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                            }
                            {!context.web3Wallet &&
                                <div className="text-center m-2">Please connect your wallet to proceed</div>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

export default withRouter(withNamespaces()(PoolTable));