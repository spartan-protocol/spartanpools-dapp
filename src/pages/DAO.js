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

    // SIMPLE ACTION PROPOSAL
    // function newActionProposal(string memory typeStr)
    let actionTypes = [
        {
            "type": "Start Emissions",
            "formatted": "START_EMISSIONS",
        },
        {
            "type": "Stop Emissions",
            "formatted": "STOP_EMISSIONS",
        },
        {
            "type": "Mint 2.5M SPARTA for Bond",
            "formatted": "MINT",
        },
    ]
    const [actionType, setActionType] = useState(actionTypes[0].type)
    const proposeAction = async () => {
        let index = actionTypes.findIndex(i => i.type === actionType)
        let typeFormatted = actionTypes[index].formatted
        let contract = getDaoContract()
        console.log(typeFormatted)
        await contract.methods.newActionProposal(typeFormatted).send({ from: context.account })
        getData()
    }

    // CHANGE PARAMETER PROPOSAL
    // function newParamProposal(uint param, string memory typeStr)
    let paramTypes = [
        {
            "type": "Change Emissions Curve",
            "formatted": "CURVE",
        },
        {
            "type": "Change Era Duration",
            "formatted": "DURATION",
        },
        {
            "type": "Change Cool-Off Period",
            "formatted": "COOL_OFF",
        },
        {
            "type": "Change Eras to Earn",
            "formatted": "ERAS_TO_EARN",
        },
    ]
    const [paramType, setParamType] = useState(paramTypes[0].type)
    const [param, setParam] = useState('')
    const proposeParam = async () => {
        let index = paramTypes.findIndex(i => i.type === paramType)
        let typeFormatted = paramTypes[index].formatted
        let contract = getDaoContract()
        console.log(param, typeFormatted)
        await contract.methods.newParamProposal(param, typeFormatted).send({ from: context.account })
        getData()
    }

    // CHANGE ADDRESS PROPOSAL
    // function newAddressProposal(address proposedAddress, string memory typeStr)
    let addressTypes = [
        {
            "type": "Change DAO Address",
            "formatted": "DAO",
        },
        {
            "type": "Change ROUTER Address",
            "formatted": "ROUTER",
        },
        {
            "type": "Change UTILS Address",
            "formatted": "UTILS",
        },
        {
            "type": "Change INCENTIVE Address",
            "formatted": "INCENTIVE",
        },
        {
            "type": "List a BOND Asset",
            "formatted": "LIST_BOND",
        },
        {
            "type": "De-list a BOND Asset",
            "formatted": "DELIST_BOND",
        },
        {
            "type": "Add Curated Pool",
            "formatted": "ADD_CURATED_POOL",
        },
        {
            "type": "Remove Curated Pool",
            "formatted": "REMOVE_CURATED_POOL",
        },
        {
            "type": "Challenge Curated Pool",
            "formatted": "CHALLENGE_CURATED_POOL",
        },
    ]
    const [addressType, setAddressType] = useState(addressTypes[0].type)
    const [propAddress, setPropAddress] = useState('')
    const proposeAddress = async () => {
        let index = addressTypes.findIndex(i => i.type === addressType)
        let typeFormatted = addressTypes[index].formatted
        let contract = getDaoContract()
        console.log(propAddress, typeFormatted)
        await contract.methods.newAddressProposal(propAddress, typeFormatted).send({ from: context.account })
        getData()
    }

    // GRANT PROPOSAL
    // function newGrantProposal(address recipient, uint amount) 
    const [grantRecipient, setGrantRecipient] = useState('')
    const [grantAmount, setGrantAmount] = useState('')
    const proposeGrant = async () => {
        let contract = getDaoContract()
        console.log(grantRecipient, grantAmount)
        await contract.methods.newGrantProposal(grantRecipient, grantAmount).send({ from: context.account })
        getData()
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
                                                        <InputGroup>
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>Select Action</InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input type="select" onChange={event => setActionType(event.target.value)}>
                                                                {actionTypes.map(t => <option>{t.type}</option>)}
                                                            </Input>
                                                        </InputGroup>
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeAction()}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Simple Action
                                                        </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose Parameter Change</h5>
                                                            <InputGroup>
                                                                <Input type="select" onChange={event => setParamType(event.target.value)}>
                                                                    {paramTypes.map(t => <option>{t.type}</option>)}
                                                                </Input>
                                                            </InputGroup>
                                                            <InputGroup className='my-1'><Input placeholder={'Enter New Param Value'} onChange={event => setParam(event.target.value)} /></InputGroup>
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeParam()}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Parameter Change
                                                        </button>
                                                    </Col>

                                                    <Col xs='12'>
                                                        <hr/>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose New Address</h5>
                                                            <InputGroup>
                                                                <Input type="select" onChange={event => setAddressType(event.target.value)}>
                                                                    {addressTypes.map(t => <option>{t.type}</option>)}
                                                                </Input>
                                                            </InputGroup>
                                                            <InputGroup className='my-1'><Input placeholder={'Enter New Address'} onChange={event => setPropAddress(event.target.value)} /></InputGroup>
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeAddress()}}>
                                                            <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose New Address
                                                        </button>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <h5 className='mt-2'>Propose New Grant</h5>
                                                        <Input placeholder={'Enter Recipient Address'} className='my-1' onChange={event => setGrantRecipient(event.target.value)} />
                                                        <InputGroup className='my-1'>
                                                            <Input placeholder={'Enter Grant Amount'} onChange={event => setGrantAmount(event.target.value)} />
                                                            <InputGroupAddon addonType="append" className='d-inline-block'>
                                                                <InputGroupText>SPARTA</InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeGrant()}}>
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