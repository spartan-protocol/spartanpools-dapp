import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../context'

import { withRouter } from "react-router-dom";
import {withNamespaces} from "react-i18next";

import { BONDv3_ADDR, getSpartaContract, getDaoContract, getProposals, isAddressValid, explorerURL, getAssets, getBondv3Contract, BNB_ADDR } from '../client/web3'
import { formatAllUnits, convertFromWei, convertToWei, bn, getAddressShort } from '../utils'

import { ProposalItem } from '../components/Sections/ProposalItem'

import {
    Container, Table, Input, Row, Col,
    InputGroup, InputGroupAddon, InputGroupText,
    Card, CardBody, CardTitle, CardSubtitle, CardFooter,
    Modal, ModalHeader, ModalBody, ModalFooter,
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

    const [bondBurnRate, setBondBurnRate] = useState('XXX')
    const [wholeDAOWeight, setWholeDAOWeight] = useState('XXX')
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
        console.log(proposalArray)
        // get BOND token burn rate
        let contract = getSpartaContract()
        contract = contract.methods
        let data = await Promise.all([contract.getAdjustedClaimRate(BONDv3_ADDR).call(), contract.emitting().call(), contract.balanceOf(BONDv3_ADDR).call(), contract.emissionCurve().call()])
        setBondBurnRate(data[0])
        setSimpleActionArray({
            emitting: data[1],
            bondRemaining: data[2],
        })
        let temp = data[3]
        contract = getDaoContract()
        contract = contract.methods
        data = await Promise.all([contract.secondsPerEra().call(), contract.coolOffPeriod().call(), contract.erasToEarn().call(), contract.totalWeight().call()])
        setParamArray({
            emissionCurve: temp,
            eraDuration: data[0],
            coolOff: data[1],
            erasToEarn: data[2],
        })
        setWholeDAOWeight(data[3])
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
            "type": "Mint SPARTA for Bond",
            "formatted": "MINT",
        },
    ]
    const [actionType, setActionType] = useState(actionTypes[0].type)
    const getActionIndex = () => {
        let index = actionTypes.findIndex(i => i.type === actionType)
        return actionTypes[index].formatted
    }
    const proposeAction = async (directType) => {
        let typeFormatted = ''
        if (directType === undefined) {
            typeFormatted = getActionIndex()
        }
        else {typeFormatted = directType}
        let contract = getDaoContract()
        console.log(typeFormatted)
        await contract.methods.newActionProposal(typeFormatted).send({ from: context.account })
        await getData()
        checkActionExisting(typeFormatted)
    }
    const [actionExisting, setActionExisting] = useState(false)
    const checkActionExisting = (directType) => {
        let existing = context.proposalArray.filter(i => i.type === directType && i.finalised === false)
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        setActionExisting(existing)
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
    const getAddressIndex = () => {
        let index = addressTypes.findIndex(i => i.type === addressType)
        return addressTypes[index].formatted
    }
    const proposeAddress = async (directType, address) => {
        if (address === undefined) {address = propAddress}
        let typeFormatted = ''
        if (directType === undefined) {
            typeFormatted = getAddressIndex()
        }
        else {typeFormatted = directType}
        let contract = getDaoContract()
        console.log(address, typeFormatted)
        await contract.methods.newAddressProposal(address, typeFormatted).send({ from: context.account })
        getData()
    }
    const [addressExisting, setAddressExisting] = useState(false)
    const checkListBondExisting = async (directType) => {
        let existing = []
        let allListed = await getAssets()
        let contract = getBondv3Contract()
        let allBond = await contract.methods.allListedAssets().call()
        let listBondProposals = context.proposalArray.filter(i => i.type === directType && i.finalised === false)
        for (let i = 0; i < allListed.length + 1; i++) {
            let address = allListed[i]
            if (address) {
                let proposal = listBondProposals.filter(i => i.proposedAddress === address)
                if (allBond.includes(address) === false) {
                    existing.push({
                        'id': proposal[0] ? proposal[0].id : 'N/A',
                        'address': address,
                        'votes': proposal[0] ? proposal[0].votes : '0',
                        'finalising': proposal[0] ? proposal[0].finalising : false,
                        'quorum': proposal[0] ? proposal[0].quorum : false,
                    })
                }
            }
        }
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        console.log(existing)
        setAddressExisting(existing)
    }
    const checkDelistBondExisting = (directType) => {
        let existing = context.proposalArray.filter(i => i.type === directType && i.finalised === false)
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        setAddressExisting(existing)
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

    {/*
    const cancelProposal = async (oldProposalID, newProposalID) => {
        // Cancel a proposal
        // function cancelProposal(uint oldProposalID, uint newProposalID)
        let contract = getDaoContract()
        console.log(oldProposalID, newProposalID)
        await contract.methods.cancelProposal(oldProposalID, newProposalID).send({ from: context.account })
        getData()
    }
    */}

    const finaliseProposal = async (proposalID) => {
        // Finalise Proposal and call internal proposal ID function
        // function finaliseProposal(uint proposalID)
        let contract = getDaoContract()
        console.log(proposalID)
        await contract.methods.finaliseProposal(proposalID).send({ from: context.account })
        getData()
    }

    const [showMINTModal, setShowMINTModal] = useState(false)
    const toggleMINTModal = () => setShowMINTModal(!showMINTModal)
    const [showLISTBONDModal, setShowLISTBONDModal] = useState(false)
    const toggleLISTBONDModal = () => setShowLISTBONDModal(!showLISTBONDModal)

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("DAO")}/>

                    <Row className='text-center'>
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>MANAGE BOND</CardTitle>
                                <CardSubtitle>Increase Allocation<br/>List/Delist Assets</CardSubtitle>
                                <CardBody>
                                    {simpleActionArray.bondRemaining !== 'XXX' ? formatAllUnits(convertFromWei(simpleActionArray.bondRemaining)) + ' SPARTA Remaining' : loader} <br/>
                                </CardBody>
                                <CardFooter>
                                    <button className="btn btn-primary mx-1" onClick={() => {
                                        checkListBondExisting('LIST_BOND')
                                        toggleLISTBONDModal()
                                    }}>
                                        <i className="bx bx-list-plus bx-xs align-middle"/>
                                    </button>

                                    <button className="btn btn-primary mx-1" onClick={() => {
                                    }}>
                                        <i className="bx bx-list-minus bx-xs align-middle"/>
                                    </button>

                                    <button className="btn btn-primary mx-1" onClick={() => {
                                        checkActionExisting('MINT')
                                        toggleMINTModal()
                                    }}>
                                        <i className="bx bx-layer-plus bx-xs align-middle"/>
                                    </button>
                                </CardFooter>
                            </Card>

                            {/* BOND - INCREASE ALLOCATION */}
                            <Modal isOpen={showMINTModal} toggle={toggleMINTModal}>
                                <ModalHeader toggle={toggleMINTModal}>Increase BOND Allocation</ModalHeader>
                                <ModalBody>
                                    Voting through this proposal will increase the SPARTA available through BOND+MINT by {bondBurnRate === 'XXX' ? loader : formatAllUnits(convertFromWei(bondBurnRate))}
                                    {actionExisting &&
                                        <>
                                            <table className='w-100 text-center mt-2'>
                                                <thead className='border-bottom'>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Type</th>
                                                        <th>Votes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {actionExisting.map(i => 
                                                        <tr key={i.id}>
                                                            <td>{i.id}</td>
                                                            <td>{i.type}</td>
                                                            <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </>
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    {actionExisting.length > 0 &&
                                        <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{voteProposal(actionExisting[0].id)}}>
                                            <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Vote To Increase 
                                        </button>
                                    }
                                    {actionExisting.length <= 0 &&
                                        <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{proposeAction('MINT')}}>
                                            <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Propose Increase
                                        </button>
                                    }
                                    <button className="btn btn-danger mt-2 mx-auto" onClick={toggleMINTModal}>
                                        <i className="bx bx-cross font-size-16 align-middle"/> Close 
                                    </button>
                                </ModalFooter>
                            </Modal>

                            {/* BOND - LIST ASSET */}
                            <Modal isOpen={showLISTBONDModal} toggle={toggleLISTBONDModal}>
                                <ModalHeader toggle={toggleLISTBONDModal}>List a New BOND Asset</ModalHeader>
                                <ModalBody>
                                    Voting through proposals here will list new assets for BOND+MINT
                                    {addressExisting &&
                                        <>
                                            <table className='w-100 text-center'>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Address</th>
                                                        <th>Votes</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {addressExisting.map(i => 
                                                        <tr key={i.address}>
                                                            <td>{i.id}</td>
                                                            <td><a href={explorerURL + 'address/' + i.address} target='blank'>{getAddressShort(i.address)}</a></td>
                                                            <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                            <td>
                                                                {i.id !== 'N/A' && i.quorum !== true &&
                                                                    <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{voteProposal(i.id)}}>
                                                                        <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Vote 
                                                                    </button>
                                                                }
                                                                {i.id !== 'N/A' && i.quorum === true &&
                                                                    <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{finaliseProposal(i.id)}}>
                                                                        <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Finalise 
                                                                    </button>
                                                                }
                                                                {i.id === 'N/A' &&
                                                                    <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{proposeAddress('LIST_BOND', i.address)}}>
                                                                        <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Propose 
                                                                    </button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </>
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    {addressExisting.length <= 0 &&
                                        <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{proposeAddress('LIST_BOND')}}>
                                            <i className="bx bxs-add-to-queue font-size-16 align-middle"/> Propose Asset
                                        </button>
                                    }
                                    <button className="btn btn-danger mt-2 mx-auto" onClick={toggleLISTBONDModal}>
                                        <i className="bx bx-cross font-size-16 align-middle"/> Close 
                                    </button>
                                </ModalFooter>
                            </Modal>
                        </Col>

                        {/* CURATED POOLS */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>MANAGE CURATED</CardTitle>
                                <CardSubtitle>List / Delist Pool<br/>Challenge Pool</CardSubtitle>
                                <CardBody>
                                    X Curated Pools
                                </CardBody>
                                <CardFooter>
                                    <button className="btn btn-primary mx-1" onClick={() => {

                                    }}>
                                        <i className="bx bx-list-plus bx-xs align-middle"/>
                                    </button>

                                    <button className="btn btn-primary mx-1" onClick={() => {

                                    }}>
                                        <i className="bx bx-list-minus bx-xs align-middle"/>
                                    </button>

                                    <button className="btn btn-primary mx-1" onClick={() => {
                                    }}>
                                        <i className="bx bx-medal bx-xs align-middle"/>
                                    </button>
                                </CardFooter>
                            </Card>
                        </Col>

                        {/* EMISSIONS - TURN ON / OFF */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>EMISSIONS</CardTitle>
                                <CardSubtitle>Turn On / Off</CardSubtitle>
                                <CardBody>
                                    {simpleActionArray.emitting === true && <>Yes<i className='bx bxs-circle bx-sm align-middle text-success bx-flashing ml-1' /></>}
                                    {simpleActionArray.emitting === false && <>No<i className='bx bxs-circle bx-sm align-middle text-danger bx-flashing ml-1' /></>}
                                    {simpleActionArray.emitting === '' && loader}
                                </CardBody>
                            </Card>
                        </Col>

                        {/* EMISSIONS - ADJUST CURVE */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>EMISSIONS</CardTitle>
                                <CardSubtitle>Adjust Curve</CardSubtitle>
                                <CardBody>
                                    {paramArray.emissionCurve !== 'XXX' ? paramArray.emissionCurve : loader} (unit?)
                                </CardBody>
                            </Card>
                        </Col>

                        {/* EMISSIONS - ERA DURATION */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>EMISSIONS</CardTitle>
                                <CardSubtitle>Era Duration</CardSubtitle>
                                <CardBody>
                                    {paramArray.eraDuration !== 'XXX' ? paramArray.eraDuration : loader} (unit?)
                                </CardBody>
                            </Card>
                        </Col>

                        {/* EMISSIONS - ERAS TO EARN */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>EMISSIONS</CardTitle>
                                <CardSubtitle>Eras to Earn</CardSubtitle>
                                <CardBody>
                                    {paramArray.erasToEarn !== 'XXX' ? paramArray.erasToEarn : loader} eras
                                </CardBody>
                            </Card>
                        </Col>

                        {/* COOLOFF PERIOD */}
                        <Col xs='6' md='4' className='d-flex align-items-stretch px-1 px-md-2'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3'>Cool-Off Period</CardTitle>
                                <CardBody>
                                    {paramArray.coolOff !== 'XXX' ? paramArray.coolOff : loader} (era?)
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>

                    <Row className='text-center'>

                        <Col xs="12" md='6' className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose Simple Action</h5></CardTitle>
                                <CardBody>
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

                        <Col xs="12" md='6' className='d-flex align-items-stretch'>
                            <Card className='w-100'>
                                <CardTitle className='mt-3 mb-0'><h5>Propose Parameter Change</h5></CardTitle>
                                <CardBody>
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

                        <Col xs="12" md='6' className='d-flex align-items-stretch'>
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

                        <Col xs="12" md='6' className='d-flex align-items-stretch'>
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
                                                            voteFor={voteProposal}
                                                            wholeDAOWeight={wholeDAOWeight}
                                                            finaliseProposal={finaliseProposal}
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