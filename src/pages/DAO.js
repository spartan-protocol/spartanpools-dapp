import React, { useState, useContext } from 'react'
import { Context } from '../context'

import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import { getSpartaContract, getDaoContract } from '../client/web3'

import {
    Container,
    Card, CardBody, CardTitle,
    Table, Input, Row, Col
} from "reactstrap";

import Breadcrumbs from "../components/Common/Breadcrumb";

var utils = require('ethers').utils;

const DAO = (props) => {

    // UI NOTES FOR DAO MANAGEMENT CARD
    // - ADD 'TABS' FOR TYPE (Action, Param, Address, List, Grant)
    // - ADD 'DROPDOWNS' FOR FORM SELECTION BASED ON SPECIFIC TYPE OF PROPOSAL
    // UI NOTES FOR PROPOSALS TABLE
    // - SHOW TOTAL PROPOSALS COUNT BASED ON FILTERS
    // - ADD DROPBOWN BOX 'FILTER' FOR: TYPE & STATUS
    // - ADD DROPDOWN BOX 'SORT' FOR: TYPE, VOTES, PROPOSED DATE, STATUS, WEIGHT

    const context = useContext(Context)

    const [asset, setAsset] = useState(false);
    const [claimRate, setClaimRate] = useState(false);
    const [maxClaim, setMaxClaim] = useState(false);
    const changeAsset = (e) => {
        setAsset(e.target.value)
    }
    const changeClaimRate = (e) => {
        let wei = utils.parseEther(e.target.value)
        setClaimRate(wei.toString())
    }
    const changeMaxClaim = (e) => {
        let wei = utils.parseEther(e.target.value)
        setMaxClaim(wei.toString())
    }
    const listAsset = async () => {
        let contract = getSpartaContract()
        console.log(asset, claimRate, maxClaim, context.account)
        await contract.methods.listAsset(asset, claimRate, maxClaim).send({ from: context.account })
        //console.log(tx.transactionHash)
    }

    const [daoAddress, setDAOAddress] = useState(false);
    const changeDAOAddress = (e) => {
        setDAOAddress(e.target.value)
    }
    const listDAO = async () => {
        let contract = getSpartaContract()
        contract.methods.changeDAO(daoAddress).send({ from: context.account })
        //console.log(tx.transactionHash)
    }

    const [routerAddress, setRouterAddress] = useState(false);
    const [utilsAddress, setUtilsAddress] = useState(false);
    const changeRouterAddress = (e) => {
        setRouterAddress(e.target.value)
    }
    const changeUtilsAddress = (e) => {
        setUtilsAddress(e.target.value)
    }
    const listRouter = async () => {
        let contract = getDaoContract()
        await contract.methods.setGenesisAddresses(routerAddress, utilsAddress).send({ from: context.account })
        //console.log(tx.transactionHash)
    }

    const [incentiveAddress, setIncentiveAddress] = useState(false);
    const changeIncentiveAddress = (e) => {
        setIncentiveAddress(e.target.value)
    }
    const changeIncentiveAddr= async () => {
        let contract = getSpartaContract()
        await contract.methods.changeIncentiveAddress(incentiveAddress).send({ from: context.account })
        //console.log(tx.transactionHash)
    }

    const startEmissions = async () => {
        let contract = getSpartaContract()
        await contract.methods.startEmissions().send({ from: context.account })
        //console.log(tx.transactionHash)
    }
    const stopEmissions = async () => {
        let contract = getSpartaContract()
        await contract.methods.stopEmissions().send({ from: context.account })
        //console.log(tx.transactionHash)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("DAO")}/>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <Row>
                                    <Col sm={12}>
                                        <Card>
                                            <CardBody>
                                                <CardTitle><h4>The Spartan DAO can govern the contract.</h4></CardTitle>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>List Asset for Earn</h5>
                                                        <Input onChange={changeAsset}
                                                            placeholder={'Enter BEP2E Asset Address'}
                                                            allowClear={true}
                                                            className='my-1'></Input>
                                                        <Input onChange={changeMaxClaim}
                                                            placeholder={'Enter Max Claim'}
                                                            allowClear={true}
                                                            className='my-1'></Input>
                                                        <Input onChange={changeClaimRate}
                                                            placeholder={'Enter Claim Rate'}
                                                            allowClear={true}
                                                            className='my-1'></Input>
                                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={listAsset}>
                                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> List Asset
                                                            </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Change DAO Address</h5>
                                                        <Input onChange={changeDAOAddress}
                                                            placeholder={'Enter BEP2E Asset Address'}
                                                            allowClear={true}
                                                            className='my-1'></Input>
                                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={listDAO}>
                                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Change DAO
                                                            </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Change Router & Utils Address</h5>
                                                        <Input onChange={changeRouterAddress}
                                                            placeholder={'Enter New Router Address'}
                                                            allowClear={true}
                                                            className='my-1'>
                                                        </Input>
                                                        <Input onChange={changeUtilsAddress}
                                                            placeholder={'Enter New Utils Address'}
                                                            allowClear={true}
                                                            className='my-1'>
                                                        </Input>
                                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={listRouter}>
                                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Change Router & Utils
                                                            </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Change Incentive Address</h5>
                                                        <Input onChange={changeIncentiveAddress}
                                                            placeholder={'Enter BEP2E Asset Address'}
                                                            allowClear={true}
                                                            className='my-1'></Input>
                                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={changeIncentiveAddr}>
                                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Change Incentive Address
                                                            </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Manage Emissions</h5>
                                                        <button className="btn btn-primary waves-effect waves-light my-1 mr-1" onClick={startEmissions}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Start Emissions
                                                        </button>
                                                        <button className="btn btn-primary waves-effect waves-light my-1 ml-1" onClick={stopEmissions}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Stop Emissions
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                            <Row>
                                <Col sm={12} className="mr-20">
                                    <Card>
                                        <CardBody>
                                            {context.sharesData &&
                                                <div className="table-responsive">
                                                    <CardTitle><h6>ADD FILTER DROPDOWN HERE | ADD SORT DROPDOWN HERE</h6></CardTitle>
                                                    <Table className="table-centered mb-0">
                                                        <thead className="center">
                                                        <tr>
                                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Proposal")}</th>
                                                            <th scope="col">{props.t("Type")}</th>
                                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Votes")}</th>
                                                            <th className="d-none d-lg-table-cell" scope="col">{props.t("Proposed")}</th>
                                                            <th scope="col">{props.t("Status")}</th>
                                                            <th scope="col">{props.t("Weight")}</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* EXAMPLE DATA */}
                                                            <tr>
                                                                <td>List RAVEN for bond</td>
                                                                <td>Bond listing</td>
                                                                <td>67</td>
                                                                <td>3 days ago</td>
                                                                <td>Finalized</td>
                                                                <td>(53%) Majority</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Grant for marketing</td>
                                                                <td>Grant</td>
                                                                <td>50</td>
                                                                <td>1 hour ago</td>
                                                                <td>Finalizing</td>
                                                                <td>(27%) Quorum</td>
                                                            </tr>

                                                            {/*
                                                            {context.sharesData.filter(x => x.units + x.locked > 0).sort((a, b) => (parseFloat(a.units + a.locked) > parseFloat(b.units + b.locked)) ? -1 : 1).map(c =>
                                                                <EarnTableItem 
                                                                    key={c.address}
                                                                    symbAddr={c.address}
                                                                    address={c.poolAddress}
                                                                    symbol={c.symbol}
                                                                    units={c.units}
                                                                    locked={c.locked}
                                                                    member={member}
                                                                    harvest={harvest}
                                                                    loadingHarvest={loadingHarvest}
                                                                    lastHarvest={lastHarvest}
                                                                />
                                                            )}
                                                            <tr>
                                                                <td colSpan="5">
                                                                    {context.sharesDataLoading !== true && context.sharesDataComplete === true && context.sharesData.filter(x => x.units + x.locked > 0).length > 0 &&
                                                                        <div className="text-center m-2">All LP tokens loaded</div>
                                                                    }
                                                                    {context.sharesDataLoading !== true && context.sharesDataComplete === true && context.sharesData.filter(x => x.units + x.locked > 0).length <= 0 &&
                                                                        <div className="text-center m-2">You have no LP tokens, <Link to="/pools">visit the pools</Link> to add liquidity</div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            */}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            }
                                            {context.sharesDataLoading === true &&
                                                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                            }
                                            {context.sharesDataLoading !== true && !context.walletData &&
                                                <div className="text-center m-2">Please connect your wallet to proceed</div>
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(DAO));