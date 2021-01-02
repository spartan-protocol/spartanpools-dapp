import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../context'

import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import { BONDv3_ADDR, getSpartaContract, getDaoContract, getProposals, isAddressValid, getBaseAllocation } from '../client/web3'
import { formatAllUnits, convertFromWei, convertToWei } from '../utils'

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

    const loader = <i className='bx bx-loader bx-sm align-middle text-warning bx-spin ml-1' />

    const [bondBurnRate, setBondBurnRate] = useState('2500000000000000000000000')
    const [simpleActionArray, setSimpleActionArray] = useState({
        emitting: '',
        bondRemaining: 'XXX',
    })
    const [paramArray, setParamArray] = useState({
        emissionCurve: 'XXX',
        eraDuration: 'XXX',
        coolOff: 'XXX',
        erasToEarn: 'XXX',
    })
    const getData = async () => {
        // (proposalArray) PROPOSALS
        context.setContext({'proposalArrayLoading': true})
        let proposalArray = await getProposals()
        context.setContext({'proposalArray': proposalArray})
        context.setContext({'proposalArrayComplete': true})
        context.setContext({'proposalArrayLoading': false})
        // get BOND token burn rate
        let contract = getSpartaContract()
        contract = contract.methods
        let data = await Promise.all([contract.getAdjustedClaimRate(BONDv3_ADDR), contract.emitting().call(), contract.balanceOf(BONDv3_ADDR).call()], contract.emissionCurve().call())
        setBondBurnRate(data[0])
        setSimpleActionArray({
            emitting: data[1],
            bondRemaining: data[2],
        })
        let temp = data[3]
        contract = getDaoContract()
        contract = contract.methods
        data = await Promise.all([contract.secondsPerEra().call(), contract.coolOffPeriod().call(), contract.erasToEarn().call()])
        setParamArray({
            emissionCurve: temp,
            eraDuration: data[0],
            coolOff: data[1],
            erasToEarn: data[2],
        })
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
    const getActionIndex = () => {
        let index = actionTypes.findIndex(i => i.type === actionType)
        return actionTypes[index].formatted
    }
    const proposeAction = async () => {
        let typeFormatted = getActionIndex()
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
    const [validAddress, setValidAddress] = useState(false)

    const updatePropAddress = async (address) => {
        setPropAddress(address)
        setValidAddress(await isAddressValid(address))
    }
    
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
    const [grantAmount, setGrantAmount] = useState('')
    const [grantRecipient, setGrantRecipient] = useState('')
    const [validRecipient, setValidRecipient] = useState(false)

    const updateGrantRecipient = async (address) => {
        setGrantRecipient(address)
        setValidRecipient(await isAddressValid(address))
    }

    const proposeGrant = async () => {
        let contract = getDaoContract()
        console.log(grantRecipient, convertToWei(grantAmount).toFixed(0))
        await contract.methods.newGrantProposal(grantRecipient, convertToWei(grantAmount).toFixed(0)).send({ from: context.account })
        getData()
    }

    const voteProposal = async (proposalID) => {
        // Vote for a proposal
        // function voteProposal(uint proposalID)
        let contract = getDaoContract()
        console.log(proposalID)
        await contract.methods.voteProposal(proposalID).send({ from: context.account })
        getData()
    }

    const cancelProposal = async (oldProposalID, newProposalID) => {
        // Cancel a proposal
        // function cancelProposal(uint oldProposalID, uint newProposalID)
        let contract = getDaoContract()
        console.log(oldProposalID, newProposalID)
        await contract.methods.cancelProposal(oldProposalID, newProposalID).send({ from: context.account })
        getData()
    }

    const finaliseProposal = async (proposalID) => {
        // Finalise Proposal and call internal proposal ID function
        // function finaliseProposal(uint proposalID)
        let contract = getDaoContract()
        console.log(proposalID)
        await contract.methods.finaliseProposal(proposalID).send({ from: context.account })
        getData()
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("DAO")}/>
                    <Row className='text-center'>

                        <Col xs="6" className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose Simple Action</h5></CardTitle>
                                <CardBody>
                                    <Row>
                                        <Col xs='12' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>Emitting SPARTA</CardTitle>
                                                <CardBody>
                                                    {simpleActionArray.emitting === true && <>Yes<i className='bx bxs-circle bx-sm align-middle text-success bx-flashing ml-1' /></>} 
                                                    {simpleActionArray.emitting === false && <>No<i className='bx bxs-circle bx-sm align-middle text-danger bx-flashing ml-1' /></>}
                                                    {simpleActionArray.emitting === '' && loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs='12' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>BOND Allocation</CardTitle>
                                                <CardBody>
                                                    {simpleActionArray.bondRemaining !== 'XXX' ? formatAllUnits(convertFromWei(simpleActionArray.bondRemaining)) + ' SPARTA Remaining' : loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Col xs='12'>
                                        <InputGroup className='mb-3'>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>Select Action</InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="select" onChange={event => setActionType(event.target.value)}>
                                                {actionTypes.map(t => <option key={t.type}>{t.type}</option>)}
                                            </Input>
                                        </InputGroup>
                                        {simpleActionArray.emitting === true && getActionIndex() === 'START_EMISSIONS' &&
                                            <button className="btn btn-danger my-1 mx-auto">
                                                <i className="bx bx-x-circle bx-xs"/> Already Emitting!
                                            </button>
                                        }
                                        {simpleActionArray.emitting === false && getActionIndex() === 'STOP_EMISSIONS' &&
                                            <button className="btn btn-danger my-1 mx-auto">
                                                <i className="bx bx-x-circle bx-xs"/> Emissions Already Stopped!
                                            </button>
                                        }
                                        {simpleActionArray.emitting === true && getActionIndex() !== 'START_EMISSIONS' &&
                                            <button className="btn btn-primary waves-effect waves-light my-1 mx-auto" onClick={()=>{proposeAction()}}>
                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Simple Action
                                            </button>  
                                        }
                                        {simpleActionArray.emitting === false && getActionIndex() !== 'STOP_EMISSIONS' &&
                                            <button className="btn btn-primary waves-effect waves-light my-1 mx-auto" onClick={()=>{proposeAction()}}>
                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Simple Action
                                            </button>  
                                        }
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="6" className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose Parameter Change</h5></CardTitle>
                                <CardBody>
                                    <Row>
                                        <Col xs='6' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>Emmissions Curve</CardTitle>
                                                <CardBody>
                                                    {paramArray.emissionCurve !== 'XXX' ? paramArray.emissionCurve : loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs='6' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>Era Duration</CardTitle>
                                                <CardBody>
                                                    {paramArray.eraDuration !== 'XXX' ? paramArray.eraDuration : loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs='6' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>Cool-Off Period</CardTitle>
                                                <CardBody>
                                                    {paramArray.coolOff !== 'XXX' ? paramArray.coolOff : loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs='6' className='d-flex align-items-stretch'>
                                            <Card className='border w-100'>
                                                <CardTitle className='mt-3'>Eras to Earn</CardTitle>
                                                <CardBody>
                                                    {paramArray.erasToEarn !== 'XXX' ? paramArray.erasToEarn : loader}
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Col xs='12'>
                                        <InputGroup>
                                            <Input type="select" onChange={event => setParamType(event.target.value)}>
                                                {paramTypes.map(t => <option key={t.type}>{t.type}</option>)}
                                            </Input>
                                        </InputGroup>
                                        <InputGroup className='my-1'><Input placeholder={'Enter New Param Value'} onChange={event => setParam(event.target.value)} /></InputGroup>
                                    <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeParam()}}>
                                        <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose Parameter Change
                                    </button>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="6" className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose New Address</h5></CardTitle>
                                <CardBody>
                                    <Col xs='12'>
                                        <InputGroup>
                                            <Input type="select" onChange={event => setAddressType(event.target.value)}>
                                                {addressTypes.map(t => <option key={t.type}>{t.type}</option>)}
                                            </Input>
                                        </InputGroup>
                                        <InputGroup className='my-1'>
                                            <Input placeholder={'Enter New Address'} onChange={(event) => {updatePropAddress(event.target.value)}} />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>{validAddress === true && <i className='bx bx-check-circle bx-xs text-success' />}{validAddress === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {validAddress === true &&
                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeAddress()}}>
                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose New Address
                                            </button>
                                        }
                                        {validAddress === false &&
                                            <button className="btn btn-danger my-1" onClick={()=>{proposeAddress()}}>
                                                <i className="bx bx-x-circle bx-xs"/> Enter Valid Address
                                            </button>
                                        }
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="6" className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose New Grant</h5></CardTitle>
                                <CardBody>
                                    <Col xs='12'>
                                        <InputGroup className='my-1'>
                                            <Input placeholder={'Enter Recipient Address'} onChange={(event) => {updateGrantRecipient(event.target.value)}} />
                                            <InputGroupAddon addonType="append">
                                                <InputGroupText>{validRecipient === true && <i className='bx bx-check-circle bx-xs text-success' />}{validRecipient === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <InputGroup className='my-1'>
                                            <Input placeholder={'Enter Grant Amount'} onChange={event => setGrantAmount(event.target.value)} />
                                            <InputGroupAddon addonType="append" className='d-inline-block'>
                                                <InputGroupText>SPARTA</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {grantAmount <= 0 &&
                                            <button className="btn btn-danger my-1" onClick={()=>{proposeAddress()}}>
                                                <i className="bx bx-x-circle bx-xs"/> Enter Valid Amount
                                            </button>
                                        }
                                        {grantAmount > 0 &&
                                            <button className="btn btn-primary waves-effect waves-light my-1" onClick={()=>{proposeGrant()}}>
                                                <i className="bx bx-log-in-circle font-size-16 align-middle"/> Propose New Grant
                                            </button>
                                        }
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>

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
                                                            id={c.id}
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
                                                            bondBurnRate={bondBurnRate}
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
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(DAO));