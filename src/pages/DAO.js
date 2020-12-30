import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../context'

import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import { getDaoContract, getProposals } from '../client/web3'

import { ProposalItem } from '../components/Sections/ProposalItem'

import {
    Container, 
    InputGroup, InputGroupAddon, InputGroupText,
    Card, CardBody, CardTitle,
    Table, Input, Row, Col
} from "reactstrap";

import Breadcrumbs from "../components/Common/Breadcrumb";

const DAO = (props) => {

    // UI NOTES FOR DAO MANAGEMENT CARD
    // - ADD 'TABS' FOR TYPE (Action, Param, Address, List, Grant)
    // - ADD 'DROPDOWNS' FOR FORM SELECTION BASED ON SPECIFIC TYPE OF PROPOSAL
    // UI NOTES FOR PROPOSALS TABLE
    // - SHOW TOTAL PROPOSALS COUNT BASED ON FILTERS
    // - ADD DROPBOWN BOX 'FILTER' FOR: TYPE & STATUS
    // - ADD DROPDOWN BOX 'SORT' FOR: TYPE, VOTES, PROPOSED DATE, STATUS, WEIGHT

    const context = useContext(Context)

    useEffect(() => {
        getData()
        return function cleanup() {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        // (proposalArray) PROPOSALS
        context.setContext({'proposalArrayLoading': true})
        let proposalArray = await getProposals()
        context.setContext({'proposalArray': proposalArray})
        context.setContext({'proposalArrayComplete': true})
        context.setContext({'proposalArrayLoading': false})
        console.log(proposalArray)
    }

    // TYPES (REMOVE FROMN LIST AS THEY ARE ADDED TO THEIR RELEVANT SECTION):
    //'DAO' = moveDao();
    //'ROUTER' = moveRouter();
    //'UTILS' = moveUtils();
    //'INCENTIVE' = moveIncentiveAddress();
    //'CURVE' = changeCurve();
    //'DURATION' = changeDuration();
    //'START_EMISSIONS' = startEmissions();
    //'STOP_EMISSIONS' = stopEmissions();
    //'COOL_OFF' = changeCooloff();
    //'ERAS_TO_EARN' = changeEras();
    //'GRANT' = grantFunds();
    //'MINT' = _mintBond();
    //'LIST_BOND' = _listBondAsset();
    //'DELIST_BOND' = _delistBondAsset();
    //'ADD_CURATED_POOL' = _addCuratedPool();
    //'REMOVE_CURATED_POOL' = _removeCuratedPool();
    //'CHALLENGE_CURATED_POOL' = _challengLowestCuratedPool();

    // REFER HERE: https://github.com/spartan-protocol/spartanswap-contracts/blob/globalUpgrade/contracts/DaoV2.sol
    // AND UPDATE ALL THE 'AVAILABLE TYPES'
    // THEN BUILD OUT 4 UI MODULES:
    //// FOR EACH FUNCTION (WITH A DROPBOWN BOX FOR EACH 'TYPE')
    // THEN CONNECT: VOTE, CANCEL, FINALIZE EACH TO A BUTTON IN THE TABLE

    // NEXT VERSION oF DAO UI; WE CAN LOOK AT MAKING THESE FUNCTION HAVE BUTTON WITHIN RELEVANT PARTS OF THE DAPP, i.e. 'LIST_BOND' ON THE BOND PAGE

    const proposeAction = async (type) => {
        // Simple Action Call
        // function newActionProposal(string memory typeStr)
        // AVAILABLE 'TYPES' = 
        let contract = getDaoContract()
        console.log(type)
        await contract.methods.newActionProposal(type).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const proposeParam = async (param, type) => {
        // Action with uint parameter
        // function newParamProposal(uint param, string memory typeStr)
        // AVAILABLE 'TYPES' = 
        let contract = getDaoContract()
        console.log(param, type)
        await contract.methods.newParamProposal(param, type).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const proposeAddress = async (proposedAddress, type) => {
        // AVAILABLE 'TYPES' = 
        // Action with address parameter
        // function newAddressProposal(address proposedAddress, string memory typeStr)
        let contract = getDaoContract()
        console.log(proposedAddress, type)
        await contract.methods.newAddressProposal(proposedAddress, type).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const proposeGrant = async (recipient, amount) => {
        // Action with funding
        // function newGrantProposal(address recipient, uint amount) 
        let contract = getDaoContract()
        console.log(recipient, amount)
        await contract.methods.newGrantProposal(recipient, amount).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const voteProposal = async (proposalID) => {
        // Vote for a proposal
        // function voteProposal(uint proposalID)
        let contract = getDaoContract()
        console.log(proposalID)
        await contract.methods.voteProposal(proposalID).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const cancelProposal = async (oldProposalID, newProposalID) => {
        // Cancel a proposal
        // function cancelProposal(uint oldProposalID, uint newProposalID)
        let contract = getDaoContract()
        console.log(oldProposalID, newProposalID)
        await contract.methods.cancelProposal(oldProposalID, newProposalID).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const finaliseProposal = async (proposalID) => {
        // Finalise Proposal and call internal proposal ID function
        // function finaliseProposal(uint proposalID)
        let contract = getDaoContract()
        console.log(proposalID)
        await contract.methods.finaliseProposal(proposalID).send({ from: context.account })
        getData()
        //console.log(tx.transactionHash)
    }

    const [incentiveAddress, setIncentiveAddress] = useState(false);
    const changeIncentiveAddress = (e) => {
        setIncentiveAddress(e.target.value)
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
                                                        <h5 className='mt-2'>Propose Simple Action</h5>
                                                        {/* DROPDOWN BOX OF TYPES */}
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeAction('DROPDOWN VALUE - TYPE')}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Simple Action
                                                        </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose Param</h5>
                                                        {/* 
                                                        INPUT BOX FOR PARAM VALUE 
                                                        <Input placeholder={'Enter New Param Value'} className='my-1'></Input>
                                                        */}
                                                        {/* DROPDOWN BOX OF TYPES */}
                                                        <button className="btn btn-primary waves-effect waves-light my-1 mr-1" onClick={()=>{proposeParam('VALUE OF INPUT', 'DROPDOWN VALUE - TYPE')}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Param
                                                        </button>
                                                    </Col>

                                                    <Col xs='12'>
                                                        <hr/>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose New Address</h5>
                                                        {/* 
                                                        INPUT BOX FOR ADDRESS 
                                                        <Input placeholder={'Enter New Address'} className='my-1'></Input>
                                                        */}
                                                        {/* DROPDOWN BOX OF TYPES */}
                                                        <button className="btn btn-primary waves-effect waves-light my-1 mr-1" onClick={()=>{proposeAddress('VALUE OF INPUT', 'DROPDOWN VALUE - TYPE')}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose New Address
                                                        </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose New Grant</h5>
                                                        <Input placeholder={'Enter Recipient Address'} className='my-1'></Input>
                                                        <InputGroup className='my-1'>
                                                            <Input placeholder={'Enter Grant Amount'}></Input>
                                                            <InputGroupAddon addonType="append" className='d-inline-block'>
                                                                <InputGroupText>SPARTA</InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeGrant('VALUE OF ADDR INPUT', 'VALUE OF AMOUNT INPUT')}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose New Grant
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
                                            {context.sharesData && context.proposalArray &&
                                                <div className="table-responsive">
                                                    <CardTitle><h6>ADD FILTER DROPDOWN HERE | ADD SORT DROPDOWN HERE</h6></CardTitle>
                                                    <Table className="table-centered mb-0">
                                                        <thead className="center">
                                                        <tr>
                                                            <th scope="col">{props.t("Type")}</th>
                                                            <th scope="col">{props.t("Votes")}</th>
                                                            <th scope="col">{props.t("Proposed")}</th>
                                                            <th scope="col">{props.t("Status")}</th>
                                                            <th scope="col">{props.t("Weight")}</th>
                                                            <th scope="col">{props.t("Action")}</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {context.proposalArray.filter(x => x.type !== '').sort((a, b) => (parseFloat(a.votes) > parseFloat(b.votes)) ? -1 : 1).map(c =>
                                                                <ProposalItem 
                                                                    key={c.id}
                                                                    finalised={c.finalised}
                                                                    finalising={c.finalising}
                                                                    list={c.list}
                                                                    majority={c.majority}
                                                                    minority={c.minority}
                                                                    param={c.param}
                                                                    proposedAddress={c.proposedAddress}
                                                                    quorum={c.quorum}
                                                                    timeStart={c.timeStart}
                                                                    type={c.type}
                                                                    votes={c.votes}
                                                                />
                                                            )}
                                                            <tr>
                                                                <td colSpan="6">
                                                                    {context.proposalArrayLoading !== true && context.proposalArrayComplete === true &&
                                                                        <div className="text-center m-2">All proposals loaded</div>
                                                                    }
                                                                </td>
                                                            </tr>
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