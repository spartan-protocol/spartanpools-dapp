import React, {useState, useContext, useEffect} from 'react'
import {Context} from '../context'

import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {
    BONDv2_ADDR, BONDv3_ADDR, getSpartaContract, getDaoContract, explorerURL, 
    getBondv3Contract, getBondProposals, SPARTA_ADDR, getPoolsData, 
    checkArrayComplete, getNextPoolsData, getListedTokens, BNB_ADDR, WBNB_ADDR,
    updateWalletData, getTokenContract,
} from '../client/web3'

import {formatAllUnits, convertFromWei, bn, getAddressShort, convertToWei} from '../utils'

import {ProposalItem} from '../components/Sections/ProposalItem'

import {
    Container, Row, Col,
    Card, CardBody, CardTitle, CardSubtitle, CardFooter,
    Modal, ModalHeader, ModalBody, ModalFooter,
} from "reactstrap";

import Breadcrumbs from "../components/Common/Breadcrumb";

const DAOProposals = (props) => {
    const context = useContext(Context)

    useEffect(() => {
        if (context.account && context.account > 0) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.account])

    const loader = <i className='bx bx-loader bx-sm align-middle text-warning bx-spin ml-1' />

    const [bondBurnRate, setBondBurnRate] = useState('XXX')
    const [bondBalance, setBondBalance] = useState('0')
    const [enoughSpartaAlloc, setEnoughSpartaAlloc] = useState('')
    const [wholeDAOWeight, setWholeDAOWeight] = useState('XXX')
    const [coolOff, setCoolOff] = useState('')
    const [simpleActionArray, setSimpleActionArray] = useState({
        emitting: '',
        bondRemaining: 'XXX',
    })
    const [proposalArray, setProposalArray] = useState('')
    const [proposalArrayLoading, setProposalArrayLoading] = useState('')
    const [proposalArrayComplete, setProposalArrayComplete] = useState(false)
    const [spartaApproved, setSpartaApproved] = useState(false)
    //const [paramArray, setParamArray] = useState({
    //    emissionCurve: 'XXX',
    //    eraDuration: 'XXX',
    //    coolOff: 'XXX',
    //    erasToEarn: 'XXX',
    //})
    const getData = async () => {
        setProposalArray(await getProposalArray())
        // get current param values from contracts
        let spartaContract = getSpartaContract()
        spartaContract = spartaContract.methods
        let daoContract = getDaoContract()
        daoContract = daoContract.methods
        let bondContract = getBondv3Contract()
        bondContract= bondContract.methods
        let data = await Promise.all([
            spartaContract.getAdjustedClaimRate(BONDv3_ADDR).call(), spartaContract.emitting().call(),
            spartaContract.balanceOf(BONDv3_ADDR).call(), 
            //spartaContract.emissionCurve().call(), daoContract.secondsPerEra().call(), daoContract.coolOffPeriod().call(), daoContract.erasToEarn().call(), 
            daoContract.totalWeight().call(), bondContract.balanceOf(BONDv3_ADDR).call(), bondContract.coolOffPeriod().call()
        ])
        setBondBurnRate(data[0])
        setSimpleActionArray({
            emitting: data[1],
            bondRemaining: data[2],
        })
        //setParamArray({
        //    emissionCurve: data[3],
        //    eraDuration: data[4],
        //    coolOff: data[5],
        //    erasToEarn: data[6],
        //})
        setWholeDAOWeight(data[3])
        setBondBalance(data[4])
        setCoolOff(data[5])
        setSpartaApproved(await checkApproval(SPARTA_ADDR))
        if (bn(data[2]).comparedTo(bn(convertToWei(10))) === -1) {setEnoughSpartaAlloc(false)}
        else {setEnoughSpartaAlloc(true)}
    }

    const refreshPoolsData = async () => {
        // (poolsData) POOLS DATA | USED: POOLS TABLE + ADD LIQ + CREATE POOL + SWAP
        if (context.poolsDataLoading !== true) {
            context.setContext({'poolsDataLoading': true})
            const getPools = await getPoolsData(context.tokenArray)
            context.setContext({'poolsData': getPools})
            context.setContext({'poolsDataLoading': false})
            //console.log(getPools)
            var lastPage = await checkArrayComplete(context.tokenArray, getPools)
            if (context.poolsDataLoading !== true) {
                context.setContext({'poolsDataLoading': true})
                context.setContext({'poolsData': await getNextPoolsData(context.tokenArray, getPools)})
                context.setContext({'poolsDataLoading': false})
                context.setContext({'poolsDataComplete': lastPage})
            }
        }
    }

    const getProposalArray = async () => {
        // (proposalArray) PROPOSALS
        setProposalArrayComplete(false)
        setProposalArrayLoading(true)
        let data = await getBondProposals()
        setProposalArrayLoading(false)
        setProposalArrayComplete(true)
        console.log(data)
        return data
    }

    const getStatus = (item) => {
        let status = 'Pending'
        if (item.finalised === true) {status = 'Finalised'}
        else if (item.finalising === true) {status = 'Finalising'}
        return status
    }

    const getWeight = (item) => {
        let weight = 'Needs more support'
        if (item.majority === true) {weight = 'Majority support'}
        else if (item.quorum === true) {weight = 'Quorum support'}
        else if (item.minority === true) {weight = 'Minority support'}
        return weight
    }

    const getDate = (item) => {
        let interval = ''
        let date = ''
        let now = new Date().getTime() / 1000
        now = now.toFixed(0)
        if (+item.timeStart !== 0) {
            interval = ' seconds'
            date = +item.timeStart + +coolOff
            if (+now < date) {
                date = date - +now
                if (date > 360) {
                    date = (date / 60).toFixed(0)
                    interval = ' minutes'
                }
                if (date > 360) {
                    date = (date / 60).toFixed(0)
                    interval = ' hours'
                }
            }
            else {
                date = 'Now'
                interval = ''
            }
        }
        else date = '-'
        return [date, interval]
    }

    // SIMPLE ACTION PROPOSAL
    // function newActionProposal(string memory typeStr)
    // eslint-disable-next-line
    {/*
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
    */}
    //const [actionType, setActionType] = useState(actionTypes[0].type)
    //const getActionIndex = () => {
    //    let index = actionTypes.findIndex(i => i.type === actionType)
    //    return actionTypes[index].formatted
    //}
    const proposeAction = async (directType) => {
        let typeFormatted = ''
        if (directType === undefined) {
        //    typeFormatted = getActionIndex()
        }
        else {typeFormatted = directType}
        let contract = getBondv3Contract()
        console.log(typeFormatted)
        await contract.methods.newActionProposal(typeFormatted).send({ from: context.account })
        await getData()
        checkActionExisting(typeFormatted)
    }
    const [actionExisting, setActionExisting] = useState(false)
    const checkActionExisting = (directType) => {
        let existing = proposalArray.filter(i => i.type === directType && i.finalised === false)
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        setActionExisting(existing)
    }

    const burnBond = async () => {
        let contract = getBondv3Contract()
        await contract.methods.burnBond().send({from: context.account})
        getData()
    }

    // CHANGE PARAMETER PROPOSAL
    // function newParamProposal(uint param, string memory typeStr)
    // eslint-disable-next-line
    {/*
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
    const getParamIndex = () => {
        let index = paramTypes.findIndex(i => i.type === paramType)
        return paramTypes[index].formatted
    }
    const proposeParam = async (directType) => {
        let typeFormatted = ''
        if (directType === undefined) {
            typeFormatted = getParamIndex()
        }
        else {typeFormatted = directType}
        let contract = getDaoContract()
        console.log(param, typeFormatted)
        await contract.methods.newParamProposal(param, typeFormatted).send({ from: context.account })
        await getData()
        checkParamExisting(typeFormatted)
    }
    const [paramExisting, setParamExisting] = useState(false)
    const checkParamExisting = (directType) => {
        let existing = context.proposalArray.filter(i => i.type === directType && i.finalised === false)
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        setParamExisting(existing)
    }
    */}

    // CHANGE ADDRESS PROPOSAL
    // function newAddressProposal(address proposedAddress, string memory typeStr)
    // eslint-disable-next-line
    {/*
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
    */}
    //const [addressType, setAddressType] = useState(addressTypes[0].type)
    //const [propAddress, setPropAddress] = useState('')
    //const [validAddress, setValidAddress] = useState(false)
    //const updatePropAddress = async (address) => {
    //    setPropAddress(address)
    //    setValidAddress(await isAddressValid(address))
    //}
    //const getAddressIndex = () => {
    //    let index = addressTypes.findIndex(i => i.type === addressType)
    //    return addressTypes[index].formatted
    //}
    const [addrListLoading, setAddrListLoading] = useState(false)
    const proposeAddress = async (directType, address) => {
        if (address === undefined) {
        //    address = propAddress
        }
        let typeFormatted = ''
        if (directType === undefined) {
        //    typeFormatted = getAddressIndex()
        }
        else {typeFormatted = directType}
        let contract = getBondv3Contract()
        console.log(address, typeFormatted)
        await contract.methods.newAddressProposal(address, typeFormatted).send({ from: context.account })
        await getData()
        if (typeFormatted === 'LIST') {checkListBondExisting(typeFormatted)}
        if (typeFormatted === 'DELIST') {checkDelistBondExisting(typeFormatted)}
    }
    //const [addressExisting, setAddressExisting] = useState(false)
    const [bondAddressExisting, setBondAddressExisting] = useState(false)
    //const checkAddressExisting = (directType) => {
    //    let existing = context.proposalArray.filter(i => i.type === directType && i.finalised === false)
    //    existing = existing.sort((a, b) => +b.votes - +a.votes)
    //    setAddressExisting(existing)
    //}
    const checkListBondExisting = async (directType) => {
        setAddrListLoading(true)
        let existing = []
        let contract = getBondv3Contract()
        let blacklist = ['0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da', '0x0a5FECAbbDB1908b5f58a26e528A21663C824137', '0xE49b84771470A87F4D9544685ea0F0517933B2B4', BONDv2_ADDR, BONDv3_ADDR, SPARTA_ADDR, WBNB_ADDR, BNB_ADDR]
        let data = await Promise.all([getListedTokens(), getProposalArray()])
        let allListed = data[0]
        let propArray = data[1]
        let bondListed = ''
        let symbol = ''
        let listBondProposals = propArray.filter(i => i.type === directType && i.finalised === false)
        for (let i = 0; i < allListed.length + 1; i++) {
            let address = allListed[i]
            if (address) {
                if (blacklist.includes(address) === false) {
                    bondListed = await contract.methods.isListed(address).call()
                    symbol = context.poolsData.filter(i => i.address === address)
                    if (bondListed === false) {
                        let proposal = listBondProposals.filter(i => i.proposedAddress === address)
                        if (existing.some(i => i.address === address) === false) {
                            existing.push({
                                'symbol': symbol[0] ? symbol[0].symbol : '-',
                                'id': proposal[0] ? proposal[0].id : '-',
                                'address': address,
                                'votes': proposal[0] ? proposal[0].votes : '0',
                                'finalising': proposal[0] ? proposal[0].finalising : false,
                                'majority': proposal[0] ? proposal[0].majority : false,
                            })
                        }
                    }
                }
            }
        }
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        console.log(existing)
        setBondAddressExisting(existing)
        setAddrListLoading(false)
    }
    const checkDelistBondExisting = async (directType) => {
        setAddrListLoading(true)
        let existing = []
        let contract = getBondv3Contract()
        let blacklist = [WBNB_ADDR, BNB_ADDR]
        let data = await Promise.all([contract.methods.allListedAssets().call(), getProposalArray()])
        let allBond = data[0]
        let propArray = data[1]
        let bondListed = ''
        let symbol = ''
        let delistBondProposals = propArray.filter(i => i.type === directType && i.finalised === false)
        for (let i = 0; i < allBond.length + 1; i++) {
            let address = allBond[i]
            if (address) {
                if (blacklist.includes(address) === false) {
                    bondListed = await contract.methods.isListed(address).call()
                    symbol = context.poolsData.filter(i => i.address === address)
                    if (bondListed === true) {
                        let proposal = delistBondProposals.filter(i => i.proposedAddress === address)
                        existing.push({
                            'symbol': symbol[0] ? symbol[0].symbol : '-',
                            'id': proposal[0] ? proposal[0].id : '-',
                            'address': address,
                            'votes': proposal[0] ? proposal[0].votes : '0',
                            'finalising': proposal[0] ? proposal[0].finalising : false,
                            'majority': proposal[0] ? proposal[0].majority : false,
                        })
                    }
                }
            }
        }
        existing = existing.sort((a, b) => +b.votes - +a.votes)
        console.log(existing)
        setBondAddressExisting(existing)
        setAddrListLoading(false)
    }

    // GRANT PROPOSAL
    // function newGrantProposal(address recipient, uint amount) 
    //const [grantAmount, setGrantAmount] = useState('')
    //const [grantRecipient, setGrantRecipient] = useState('')
    //const [validRecipient, setValidRecipient] = useState(false)
    //const [grantExisting, setGrantExisting] = useState('')
    //const updateGrantRecipient = async (address) => {
    //    setGrantRecipient(address)
    //    setValidRecipient(await isAddressValid(address))
    //}
    //const proposeGrant = async () => {
    //    let contract = getDaoContract()
    //    console.log(grantRecipient, convertToWei(grantAmount).toFixed(0))
    //    await contract.methods.newGrantProposal(grantRecipient, convertToWei(grantAmount).toFixed(0)).send({ from: context.account })
    //    getData()
    //}
    //const checkGrantExisting = () => {
    //    let existing = context.proposalArray.filter(i => i.type === 'GRANT' && i.finalised === false)
    //    existing = existing.sort((a, b) => +b.votes - +a.votes)
    //    setGrantExisting(existing)
    //    console.log(existing)
    //}

    // PROPOSAL MANAGEMENT FUNCTIONS
    const voteProposal = async (proposalID) => {
        // Vote for a proposal
        // function voteProposal(uint proposalID)
        let contract = getBondv3Contract()
        console.log('vote for', proposalID)
        await contract.methods.voteProposal(proposalID).send({ from: context.account })
        getData()
    }
    // eslint-disable-next-line
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
        let contract = getBondv3Contract()
        console.log('finalise proposal', proposalID)
        await contract.methods.finaliseProposal(proposalID).send({ from: context.account })
        getData()
        refreshPoolsData()
    }

    const approve = async () => {
        const contract = getSpartaContract()
        const supply = await contract.methods.totalSupply().call()
        console.log('Approving SPARTA', BONDv3_ADDR, supply)
        await contract.methods.approve(BONDv3_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
    
        let data = await checkApproval(SPARTA_ADDR)
        setSpartaApproved(data)

        if (context.walletDataLoading !== true) {
            // Refresh BNB balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
    }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.account, BONDv3_ADDR).call()
        if (+approval > 0) {
            return true
        } else {
            return false
        }
    }

    const [showFeeModal, setShowFeeModal] = useState(false)
    const toggleFeeModal = () => setShowFeeModal(!showFeeModal)
    const [feeModalLoading, setFeeModalLoading] = useState(false)
    const [proposalAction, setProposalAction] = useState('')
    const [proposalAddress, setProposalAddress] = useState('')

    const runFeeModal = async () => {
        setFeeModalLoading(true)
        if (proposalAction === 'MINT') {await proposeAction('MINT')}
        else if (proposalAction === 'LIST') {await proposeAddress('LIST', proposalAddress)}
        else if (proposalAction === 'DELIST') {await proposeAddress('DELIST', proposalAddress)}
        setFeeModalLoading(false)
        setShowFeeModal(false)
    }

    const [showMINTModal, setShowMINTModal] = useState(false)
    const toggleMINTModal = () => setShowMINTModal(!showMINTModal)
    const [showLISTBONDModal, setShowLISTBONDModal] = useState(false)
    const toggleLISTBONDModal = () => setShowLISTBONDModal(!showLISTBONDModal)
    const [showDELISTBONDModal, setShowDELISTBONDModal] = useState(false)
    const toggleDELISTBONDModal = () => setShowDELISTBONDModal(!showDELISTBONDModal)

    //const [showSWITCHEMISSIONSModal, setShowSWITCHEMISSIONSModal] = useState(false)
    //const toggleSWITCHEMISSIONSModal = () => setShowSWITCHEMISSIONSModal(!showSWITCHEMISSIONSModal)
    //const [showADJUSTCURVEModal, setShowADJUSTCURVEModal] = useState(false)
    //const toggleADJUSTCURVEModal = () => setShowADJUSTCURVEModal(!showADJUSTCURVEModal)
    //const [showAdjustEraDurationModal, setShowAdjustEraDurationModal] = useState(false)
    //const toggleAdjustEraDurationModal = () => setShowAdjustEraDurationModal(!showAdjustEraDurationModal)
    //const [showErasToEarnModal, setShowErasToEarnModal] = useState(false)
    //const toggleErasToEarnModal = () => setShowErasToEarnModal(!showErasToEarnModal)

    //const [showCoolOffModal, setShowCoolOffModal] = useState(false)
    //const toggleCoolOffModal = () => setShowCoolOffModal(!showCoolOffModal)

    //const [showGrantModal, setShowGrantModal] = useState(false)
    //const toggleGrantModal = () => setShowGrantModal(!showGrantModal)

    //const [showDaoModal, setShowDaoModal] = useState(false)
    //const toggleDaoModal = () => setShowDaoModal(!showDaoModal)
    //const [showRouterModal, setShowRouterModal] = useState(false)
    //const toggleRouterModal = () => setShowRouterModal(!showRouterModal)
    //const [showUtilsModal, setShowUtilsModal] = useState(false)
    //const toggleUtilsModal = () => setShowUtilsModal(!showUtilsModal)
    //const [showIncentiveModal, setShowIncentiveModal] = useState(false)
    //const toggleIncentiveModal = () => setShowIncentiveModal(!showIncentiveModal)

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("DAO")}/>

                    <Modal isOpen={showFeeModal} toggle={toggleFeeModal} className='text-center'>
                        <ModalHeader toggle={toggleFeeModal}>100 SPARTA Fee for new proposals!</ModalHeader>
                        <ModalBody>
                            There will be a 100 SPARTA fee for this proposal.<br/>
                            All proposal fees are sent to the DAO address which allows for more 'grant' & 'harvest' funds!
                        </ModalBody>
                        <ModalFooter>
                            {spartaApproved !== true &&
                                <button className="btn btn-warning mt-2 mx-auto" onClick={approve}>
                                    <i className="bx bx-send align-middle"/> Approve SPARTA 
                                </button>
                            }
                            {spartaApproved === true &&
                                <button className="btn btn-success mt-2 mx-auto" onClick={runFeeModal}>
                                    <i className="bx bx-layer-plus align-middle"/> Continue {feeModalLoading === true && loader}
                                </button>
                            }
                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleFeeModal}>
                                <i className="bx bx-window-close align-middle"/> Close 
                            </button>
                        </ModalFooter>
                    </Modal>

                    {proposalArray &&
                        <>
                            <Row className='text-center'>

                                {/* BOND MANAGEMENT */}
                                <Col xs='12' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>BOND</CardTitle>
                                        <CardSubtitle>
                                            List Asssets<br/>Delist Assets<br/>Increase Allocation<br/>
                                            {bondBalance > 0 &&
                                                <button className="btn btn-success mt-2 mx-auto" onClick={()=>{burnBond()}}>
                                                    <i className="bx bxs-zap align-middle"/> Increase BOND Allocation!
                                                </button>
                                            }
                                        </CardSubtitle>
                                        <CardBody>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>
                                                <strong>{enoughSpartaAlloc === false ? 'No' : formatAllUnits(convertFromWei(simpleActionArray.bondRemaining))}</strong> Remaining Sparta Allocation
                                                {simpleActionArray.bondRemaining === 'XXX' ? loader : ''}
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            {context.poolsDataComplete === true &&
                                                <button className="btn btn-primary m-1" onClick={() => {
                                                    checkListBondExisting('LIST')
                                                    toggleLISTBONDModal()
                                                }}>
                                                    <i className="bx bx-list-plus bx-xs align-middle"/> List
                                                </button>
                                            }

                                            {context.poolsDataComplete === true &&
                                                <button className="btn btn-primary m-1" onClick={() => {
                                                    checkDelistBondExisting('DELIST')
                                                    toggleDELISTBONDModal()
                                                }}>
                                                    <i className="bx bx-list-minus bx-xs align-middle"/> Delist
                                                </button>
                                            }

                                            {context.poolsDataComplete !== true &&
                                                loader
                                            }

                                            <button className="btn btn-primary m-1" onClick={() => {
                                                checkActionExisting('MINT')
                                                toggleMINTModal()
                                            }}>
                                                <i className="bx bx-layer-plus bx-xs align-middle"/> Alloc+
                                            </button>
                                        </CardFooter>
                                    </Card>

                                    {/* BOND - LIST ASSET MODAL */}
                                    <Modal isOpen={showLISTBONDModal} toggle={toggleLISTBONDModal} className='text-center'>
                                        <ModalHeader toggle={toggleLISTBONDModal}>List a New BOND Asset</ModalHeader>
                                        <ModalBody>
                                            List new assets for BOND+MINT<br/>
                                            All new proposals will charge a 100 SPARTA fee!<br/>
                                            The fee will go to the DAO address for 'harvest' & 'grants' 
                                            {addrListLoading === false && bondAddressExisting && addrListLoading === false &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Symbol</th>
                                                                <th className='d-none d-sm-table-cell'>Address</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bondAddressExisting.map(i => 
                                                                <tr key={i.address}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.symbol}</td>
                                                                    <td className='d-none d-sm-table-cell'><a href={explorerURL + 'address/' + i.address} target='blank'>{getAddressShort(i.address)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== '-' && i.majority !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={async () => {
                                                                                await voteProposal(i.id)
                                                                                checkListBondExisting('LIST')
                                                                            }}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== '-' && i.majority === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={async () => {
                                                                                await finaliseProposal(i.id)
                                                                                checkListBondExisting('LIST')
                                                                            }}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                        {i.id === '-' &&
                                                                            <button style={{width:'100px'}} className="btn btn-danger mt-2 mx-auto p-1" onClick={() => {
                                                                                toggleFeeModal()
                                                                                setProposalAction('LIST')
                                                                                setProposalAddress(i.address)
                                                                            }}>
                                                                                <i className="bx bx-pin align-middle"/> Propose 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                            {addrListLoading === true &&
                                                <div xs='12' className='m-1'>{loader}</div>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleLISTBONDModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>

                                    {/* BOND - DE-LIST ASSET MODAL */}
                                    <Modal isOpen={showDELISTBONDModal} toggle={toggleDELISTBONDModal} className='text-center'>
                                        <ModalHeader toggle={toggleDELISTBONDModal}>De-list a BOND Asset</ModalHeader>
                                        <ModalBody>
                                            Delist assets from BOND+MINT<br/>
                                            All new proposals will charge a 100 SPARTA fee!<br/>
                                            The fee will go to the DAO address for 'harvest' & 'grants' 
                                            {bondAddressExisting && addrListLoading === false &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Symbol</th>
                                                                <th className='d-none d-sm-table-cell'>Address</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bondAddressExisting.map(i => 
                                                                <tr key={i.address}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.symbol}</td>
                                                                    <td className='d-none d-sm-table-cell'><a href={explorerURL + 'address/' + i.address} target='blank'>{getAddressShort(i.address)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== '-' && i.majority !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={async () => {
                                                                                await voteProposal(i.id)
                                                                                checkDelistBondExisting('DELIST')
                                                                            }}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== '-' && i.majority === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={async () => {
                                                                                await finaliseProposal(i.id)
                                                                                checkDelistBondExisting('DELIST')
                                                                            }}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                        {i.id === '-' &&
                                                                            <button style={{width:'100px'}} className="btn btn-danger mt-2 mx-auto p-1" onClick={()=>{
                                                                                toggleFeeModal()
                                                                                setProposalAction('DELIST')
                                                                                setProposalAddress(i.address)
                                                                            }}>
                                                                                <i className="bx bx-pin align-middle"/> Propose 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                            {addrListLoading === true &&
                                                <div xs='12' className='m-1'>{loader}</div>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleDELISTBONDModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>

                                    {/* BOND - INCREASE ALLOCATION MODAL */}
                                    <Modal isOpen={showMINTModal} toggle={toggleMINTModal} className='text-center'>
                                        <ModalHeader toggle={toggleMINTModal}>Increase BOND Allocation</ModalHeader>
                                        <ModalBody>
                                            {bondBalance <= 0 &&
                                                <>
                                                    Increase the SPARTA available through BOND+MINT by {bondBurnRate === 'XXX' ? loader : formatAllUnits(convertFromWei(bondBurnRate))}<br/>
                                                    All new proposals will charge a 100 SPARTA fee!<br/>
                                                    The fee will go to the DAO address for 'harvest' & 'grants'<br/>
                                                    There is NO fee for voting (except gas)
                                                    {actionExisting.length > 0 &&
                                                        <>
                                                            <Row className='text-center mt-2'>
                                                                <Col xs='12'>
                                                                    <h5>Existing Proposal [ID {actionExisting[0].id}]:</h5>
                                                                </Col>
                                                                <Col xs='6'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>Votes: {formatAllUnits(bn(actionExisting[0].votes).div(bn(wholeDAOWeight)).times(100))} %</div>
                                                                </Col>
                                                                <Col xs='6'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>Finalise In: {getDate(actionExisting[0])}</div>
                                                                </Col>
                                                                <Col xs='6'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>Status: {getStatus(actionExisting[0])}</div>
                                                                </Col>
                                                                <Col xs='6'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>Weight: {getWeight(actionExisting[0])}</div>
                                                                </Col>
                                                                <Col xs='12'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>Increase BOND allocation by {formatAllUnits(convertFromWei(bondBurnRate))} SPARTA</div>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    }
                                                    {actionExisting.length <= 0 &&
                                                        <>
                                                            <Row className='text-center mt-2'>
                                                                <Col xs='12'>
                                                                    <div className='w-100 m-1 p-1 bg-light rounded'>There are no active proposals to increase BOND allocation</div>
                                                                    {enoughSpartaAlloc === true ? 
                                                                        <div className='w-100 m-1 p-1 bg-light rounded'>However, there is still a SPARTA allocation remaining in BOND. We cannot make a new 'alloc+' proposal until the remainder is claimed!</div>
                                                                        : ''
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    }
                                                </>
                                            }
                                            {bondBalance > 0 &&
                                                <>
                                                    There is a BOND token available to be burnt!<br/>
                                                    Click below button to finalise the process and increase the SPARTA available in BOND+Mint by {formatAllUnits(convertFromWei(bondBurnRate))}
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            {actionExisting.length > 0 && bondBalance <= 0 &&
                                                <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{voteProposal(actionExisting[0].id)}}>
                                                    <i className="bx bx-like align-middle"/> Vote 
                                                </button>
                                            }
                                            {actionExisting.length <= 0 && bondBalance <= 0 && enoughSpartaAlloc === false &&
                                                <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{
                                                    toggleFeeModal()
                                                    setProposalAction('MINT')
                                                    setProposalAddress('')
                                                }}>
                                                    <i className="bx bx-pin align-middle"/> Propose
                                                </button>
                                            }
                                            {actionExisting.length > 0 && actionExisting[0].finalised === false && bondBalance <= 0 && actionExisting[0].majority === true && getDate(actionExisting[0])[0] === 'Now' &&
                                                <button className="btn btn-success mt-2 mx-auto" onClick={()=>{finaliseProposal(actionExisting[0].id)}}>
                                                    <i className="bx bxs-zap bx-xs align-middle"/> Finalise
                                                </button>
                                            }
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleMINTModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>

                                </Col>

                                {/* DIVIDENDS - ADD WITH DAO V2 / GLOBALUPGRADE */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>DIVIDENDS</CardTitle>
                                        <CardSubtitle>Change Array Fee Size<br/>Change Max Trades<br/>Change Era Length</CardSubtitle>
                                        <CardBody>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>Array Fee Size:</div>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>Max Trades:</div>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>Era length:</div>
                                        </CardBody>
                                        <CardFooter>
                                            <button className="btn btn-primary m-1 disabled" onClick={() => {

                                            }}>
                                                <i className="bx bx-list-plus bx-xs align-middle"/>
                                            </button>

                                            <button className="btn btn-primary m-1 disabled" onClick={() => {

                                            }}>
                                                <i className="bx bx-list-minus bx-xs align-middle"/>
                                            </button>

                                            <button className="btn btn-primary m-1 disabled" onClick={() => {
                                            }}>
                                                <i className="bx bx-medal bx-xs align-middle"/>
                                            </button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                                */}

                                {/* CURATED POOLS - ADD WITH DAO V2 / GLOBALUPGRADE */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>CURATED</CardTitle>
                                        <CardSubtitle>List / Delist / Challenge Pool<br/>Coming Soon (DAO v2)</CardSubtitle>
                                        <CardBody>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>## Curated Pools</div>
                                        </CardBody>
                                        <CardFooter>
                                            <button className="btn btn-primary m-1 disabled" onClick={() => {

                                            }}>
                                                <i className="bx bx-list-plus bx-xs align-middle"/>
                                            </button>

                                            <button className="btn btn-primary m-1 disabled" onClick={() => {

                                            }}>
                                                <i className="bx bx-list-minus bx-xs align-middle"/>
                                            </button>

                                            <button className="btn btn-primary m-1 disabled" onClick={() => {
                                            }}>
                                                <i className="bx bx-medal bx-xs align-middle"/>
                                            </button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                                */}

                                {/* MANAGE EMISSIONS */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>EMISSIONS</CardTitle>
                                        <CardSubtitle>Adjust Emissions</CardSubtitle>
                                        <CardBody>
                                            <Row>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>
                                                        Emissions
                                                        {simpleActionArray.emitting === true && <> On<i className='bx bxs-circle bx-sm align-middle text-success bx-flashing ml-1' /></>}
                                                        {simpleActionArray.emitting === false && <> Off<i className='bx bxs-circle bx-sm align-middle text-danger bx-flashing ml-1' /></>}
                                                        {simpleActionArray.emitting === '' && loader}
                                                    </div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light align-middle rounded'>
                                                        Curve: {paramArray.emissionCurve !== 'XXX' ? paramArray.emissionCurve : loader}
                                                    </div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>
                                                        Era Duration: {paramArray.eraDuration !== 'XXX' ? paramArray.eraDuration : loader}
                                                    </div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>
                                                        Eras to Earn: {paramArray.erasToEarn !== 'XXX' ? paramArray.erasToEarn : loader}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter>
                                            {simpleActionArray.emitting === false && 
                                                <button className="btn btn-primary m-1" onClick={() => {
                                                    checkActionExisting('START_EMISSIONS')
                                                    toggleSWITCHEMISSIONSModal()
                                                }}>
                                                    <i className="bx bx-power-off bx-xs align-middle"/> On
                                                </button>
                                            }

                                            {simpleActionArray.emitting === true &&
                                                <button className="btn btn-primary m-1" onClick={() => {
                                                    checkActionExisting('STOP_EMISSIONS')
                                                    toggleSWITCHEMISSIONSModal()
                                                }}>
                                                    <i className="bx bx-power-off bx-xs align-middle"/> Off
                                                </button>
                                            }

                                            <button className="btn btn-primary m-1" onClick={() => {
                                                setParam('')
                                                checkParamExisting('CURVE')
                                                toggleADJUSTCURVEModal()
                                            }}>
                                                <i className="bx bx-cog bx-xs align-middle"/> Curve
                                            </button>

                                            <button className="btn btn-primary m-1" onClick={() => {
                                                setParam('')
                                                checkParamExisting('DURATION')
                                                toggleAdjustEraDurationModal()
                                            }}>
                                                <i className="bx bx-time bx-xs align-middle"/> Era
                                            </button>
                                            
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                setParam('')
                                                checkParamExisting('ERAS_TO_EARN')
                                                toggleErasToEarnModal()
                                            }}>
                                                <i className="bx bx-timer bx-xs align-middle"/> EraToEarn
                                            </button>
                                        </CardFooter>
                                    </Card>
                                    */}

                                    {/* EMISSIONS - TURN ON / OFF MODAL */}
                                    {/*
                                    <Modal isOpen={showSWITCHEMISSIONSModal} toggle={toggleSWITCHEMISSIONSModal} className='text-center'>
                                        <ModalHeader toggle={toggleSWITCHEMISSIONSModal}>Switch SPARTA Emissions {simpleActionArray.emitting === true ? 'Off' : 'On'}</ModalHeader>
                                        <ModalBody>
                                            Voting through this proposal will switch SPARTA emissions {simpleActionArray.emitting === true ? 'off' : 'on'}
                                            {actionExisting.length > 0 &&
                                                <>
                                                    <Row className='text-center mt-2'>
                                                        <Col xs='6'>
                                                            <div className='w-100 m-1 p-1 bg-light rounded'>Proposal ID: {actionExisting[0].id}</div>
                                                        </Col>
                                                        <Col xs='6'>
                                                            <div className='w-100 m-1 p-1 bg-light rounded'>Votes: {formatAllUnits(bn(actionExisting[0].votes).div(bn(wholeDAOWeight)).times(100))} %</div>
                                                        </Col>
                                                        <Col xs='12'>
                                                            <div className='w-100 m-1 p-1 bg-light rounded'>Switch {simpleActionArray.emitting === true ? 'Off' : 'On'} the SPARTA emissions</div>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                            {actionExisting.length <= 0 &&
                                                <>
                                                    <Row className='text-center mt-2'>
                                                        <Col xs='12'>
                                                            <div className='w-100 m-1 p-1 bg-light rounded'>There are no active proposals to toggle SPARTA emissions</div>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            {actionExisting.length > 0 &&
                                                <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{voteProposal(actionExisting[0].id)}}>
                                                    <i className="bx bx-like align-middle"/> Vote for Proposal 
                                                </button>
                                            }
                                            {actionExisting.length <= 0 &&
                                                <button className="btn btn-primary mt-2 mx-auto" onClick={()=>{proposeAction(actionExisting[0].type)}}>
                                                    <i className="bx bx-pin align-middle"/> Propose Turn {simpleActionArray.emitting === true ? 'Off' : 'On'}
                                                </button>
                                            }
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleSWITCHEMISSIONSModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}

                                    {/* EMISSIONS - ADJUST CURVE MODAL */}
                                    {/*
                                    <Modal isOpen={showADJUSTCURVEModal} toggle={toggleADJUSTCURVEModal} className='text-center'>
                                        <ModalHeader toggle={toggleADJUSTCURVEModal}>Adjust Emissions Curve</ModalHeader>
                                        <ModalBody>
                                            Propose a new emissions curve value:
                                            <InputGroup className='my-3'>
                                                <InputGroupAddon addonType="prepend">
                                                    {param > 0 &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeParam('CURVE')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {param <= 0 &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Curve Value'} onChange={event => setParam(event.target.value)} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{param > 0 && <i className='bx bx-check-circle bx-xs text-success' />}{param <= 0 && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            Or vote for / finalize existing proposals:
                                            {paramExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Curve</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paramExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.param}</td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleADJUSTCURVEModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}

                                    {/* EMISSIONS - ERA DURATION MODAL */}
                                    {/*
                                    <Modal isOpen={showAdjustEraDurationModal} toggle={toggleAdjustEraDurationModal} className='text-center'>
                                        <ModalHeader toggle={toggleAdjustEraDurationModal}>Adjust Era Duration</ModalHeader>
                                        <ModalBody>
                                            Propose a new era duration:
                                            <InputGroup className='my-3'>
                                                <InputGroupAddon addonType="prepend">
                                                    {param > 0 &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeParam('DURATION')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {param <= 0 &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Era Duration Value'} onChange={event => setParam(event.target.value)} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{param > 0 && <i className='bx bx-check-circle bx-xs text-success' />}{param <= 0 && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            Or vote for / finalize existing proposals:
                                            {paramExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Duration</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paramExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.param}</td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleAdjustEraDurationModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}

                                    {/* EMISSIONS - ERAS TO EARN */}
                                    {/*
                                    <Modal isOpen={showErasToEarnModal} toggle={toggleErasToEarnModal} className='text-center'>
                                        <ModalHeader toggle={toggleErasToEarnModal}>Adjust Era To Earn</ModalHeader>
                                        <ModalBody>
                                            Propose a new 'eras to earn' value:
                                            <InputGroup className='my-3'>
                                                <InputGroupAddon addonType="prepend">
                                                    {param > 0 &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeParam('ERAS_TO_EARN')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {param <= 0 &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New ErasToEarn Value'} onChange={event => setParam(event.target.value)} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{param > 0 && <i className='bx bx-check-circle bx-xs text-success' />}{param <= 0 && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            Or vote for / finalize existing proposals:
                                            {paramExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New ErasToEarn</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paramExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.param}</td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleErasToEarnModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>

                                </Col>
                                */}

                                
                                {/* MANAGE DAO */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>MANAGE DAO</CardTitle>
                                        <CardSubtitle>Change Proposal Cool-Off Period</CardSubtitle>
                                        <CardBody>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>Cool-Off: {paramArray.coolOff !== 'XXX' ? formatAllUnits(paramArray.coolOff) : loader} seconds</div>
                                        </CardBody>
                                        <CardFooter>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                setParam('')
                                                checkParamExisting('COOL_OFF')
                                                toggleCoolOffModal()
                                            }}>
                                                <i className="bx bx-time bx-xs align-middle"/> Cool-Off
                                            </button>
                                        </CardFooter>
                                    </Card>
                                    */}
                                    {/* COOL OFF PERIOD MODAL */}
                                    {/*
                                    <Modal isOpen={showCoolOffModal} toggle={toggleCoolOffModal} className='text-center'>
                                        <ModalHeader toggle={toggleCoolOffModal}>Adjust Cool Off period</ModalHeader>
                                        <ModalBody>
                                            Propose a new 'CoolOff Period' value:
                                            <InputGroup className='my-3'>
                                                <InputGroupAddon addonType="prepend">
                                                    {param > 0 &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeParam('COOL_OFF')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {param <= 0 &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New CoolOff Value'} onChange={event => setParam(event.target.value)} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{param > 0 && <i className='bx bx-check-circle bx-xs text-success' />}{param <= 0 && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            Or vote for / finalize existing proposals:
                                            {paramExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New CoolOff</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paramExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.param}</td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleCoolOffModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                </Col>
                                */}

                                {/* MANAGE GRANTS - ADD WITH DAO V2 / GLOBALUPGRADE  */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>MANAGE GRANTS</CardTitle>
                                        <CardSubtitle>Propose Grants</CardSubtitle>
                                        <CardBody>
                                            <div className='w-100 m-1 p-1 bg-light rounded'>Proposal Count:</div>
                                        </CardBody>
                                        <CardFooter>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                checkGrantExisting()
                                                toggleGrantModal()
                                            }}>
                                                <i className="bx bx-award bx-xs align-middle"/> Grant
                                            </button>
                                        </CardFooter>
                                    </Card>
                                    */}
                                    {/* GRANTS MODAL */}
                                    {/*
                                    <Modal isOpen={showGrantModal} toggle={toggleGrantModal} className='text-center'>
                                        <ModalHeader toggle={toggleGrantModal}>Propose SPARTA Grant</ModalHeader>
                                        <ModalBody>
                                            Propose a new grant:
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
                                            {(grantAmount <= 0 || validRecipient === false) &&
                                                <button className="btn btn-danger my-1">
                                                    <i className="bx bx-x-circle bx-xs"/> Input Invalid
                                                </button>
                                            }
                                            {grantAmount > 0 && validRecipient === true &&
                                                <button className="btn btn-primary my-1" onClick={()=>{proposeGrant()}}>
                                                    <i className="bx bx-log-in-circle align-middle"/> Propose New Grant
                                                </button>
                                            }
                                            <br/>Or vote for / finalize existing proposals:
                                            {grantExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Address</th>
                                                                <th>SPARTA</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {grantExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td>{i.grant ? i.grant.recipient : 'N/A'}</td>
                                                                    <td>{i.grant ? i.grant.amount : 'N/A'}</td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleGrantModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                </Col>
                                */}

                                {/* MANAGE CONTRACT ADDRESSES */}
                                {/*
                                <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3'>ADDRESSES</CardTitle>
                                        <CardSubtitle>Change Addresses</CardSubtitle>
                                        <CardBody>
                                            <Row>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>DAO: <a href={explorerURL + 'address/' + DAO_ADDR + '#readContract'} target='blank'>{getAddressShort(DAO_ADDR)}</a></div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>ROUTER: <a href={explorerURL + 'address/' + ROUTER_ADDR + '#readContract'} target='blank'>{getAddressShort(ROUTER_ADDR)}</a></div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>UTILS: <a href={explorerURL + 'address/' + UTILS_ADDR + '#readContract'} target='blank'>{getAddressShort(UTILS_ADDR)}</a></div>
                                                </Col>
                                                <Col xs='6' className='d-flex align-items-stretch'>
                                                    <div className='w-100 m-1 p-1 bg-light rounded'>INCENTIVE: <a href={explorerURL + 'address/' + INCENTIVE_ADDR + '#readContract'} target='blank'>{getAddressShort(INCENTIVE_ADDR)}</a></div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                updatePropAddress('')
                                                checkAddressExisting('DAO')
                                                toggleDaoModal()
                                            }}>
                                                <i className="bx bx-group bx-xs align-middle"/> DAO
                                            </button>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                updatePropAddress('')
                                                checkAddressExisting('ROUTER')
                                                toggleRouterModal()
                                            }}>
                                                <i className="bx bx-vector bx-xs align-middle"/> ROUTER
                                            </button>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                updatePropAddress('')
                                                checkAddressExisting('UTILS')
                                                toggleUtilsModal()
                                            }}>
                                                <i className="bx bx-slider-alt bx-xs align-middle"/> UTILS
                                            </button>
                                            <button className="btn btn-primary m-1" onClick={() => {
                                                updatePropAddress('')
                                                checkAddressExisting('INCENTIVE')
                                                toggleIncentiveModal()
                                            }}>
                                                <i className="bx bx-coin-stack bx-xs align-middle"/> INCENTIVE
                                            </button>
                                        </CardFooter>
                                    </Card>
                                    */}
                                    {/* CHANGE DAO ADDRESS */}
                                    {/*
                                    <Modal isOpen={showDaoModal} toggle={toggleDaoModal} className='text-center'>
                                        <ModalHeader toggle={toggleDaoModal}>Change DAO Address</ModalHeader>
                                        <ModalBody>
                                            Propose a new DAO address:
                                            <InputGroup className='my-1'>
                                                <InputGroupAddon addonType="prepend">
                                                    {validAddress === true &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeAddress('DAO')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {validAddress === false &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Address'} onChange={(event) => {updatePropAddress(event.target.value)}} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{validAddress === true && <i className='bx bx-check-circle bx-xs text-success' />}{validAddress === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <br/>Or vote for / finalize existing proposals:
                                            {addressExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Addr</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {addressExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td><a href={explorerURL + 'address/' + i.proposedAddress} target='blank'>{getAddressShort(i.proposedAddress)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleDaoModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}
                                    {/* CHANGE ROUTER ADDRESS */}
                                    {/*
                                    <Modal isOpen={showRouterModal} toggle={toggleRouterModal} className='text-center'>
                                        <ModalHeader toggle={toggleRouterModal}>Change ROUTER Address</ModalHeader>
                                        <ModalBody>
                                            Propose a new ROUTER address:
                                            <InputGroup className='my-1'>
                                                <InputGroupAddon addonType="prepend">
                                                    {validAddress === true &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeAddress('ROUTER')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {validAddress === false &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Address'} onChange={(event) => {updatePropAddress(event.target.value)}} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{validAddress === true && <i className='bx bx-check-circle bx-xs text-success' />}{validAddress === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <br/>Or vote for / finalize existing proposals:
                                            {addressExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Addr</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {addressExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td><a href={explorerURL + 'address/' + i.proposedAddress} target='blank'>{getAddressShort(i.proposedAddress)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleRouterModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}
                                    {/* CHANGE UTILS ADDRESS */}
                                    {/*
                                    <Modal isOpen={showUtilsModal} toggle={toggleUtilsModal} className='text-center'>
                                        <ModalHeader toggle={toggleUtilsModal}>Change UTILS Address</ModalHeader>
                                        <ModalBody>
                                            Propose a new UTILS address:
                                            <InputGroup className='my-1'>
                                                <InputGroupAddon addonType="prepend">
                                                    {validAddress === true &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeAddress('UTILS')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {validAddress === false &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Address'} onChange={(event) => {updatePropAddress(event.target.value)}} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{validAddress === true && <i className='bx bx-check-circle bx-xs text-success' />}{validAddress === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <br/>Or vote for / finalize existing proposals:
                                            {addressExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Addr</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {addressExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td><a href={explorerURL + 'address/' + i.proposedAddress} target='blank'>{getAddressShort(i.proposedAddress)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleUtilsModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                    */}
                                    {/* CHANGE INCENTIVE ADDRESS */}
                                    {/*
                                    <Modal isOpen={showIncentiveModal} toggle={toggleIncentiveModal} className='text-center'>
                                        <ModalHeader toggle={toggleIncentiveModal}>Change INCENTIVE Address</ModalHeader>
                                        <ModalBody>
                                            Propose a new INCENTIVE address:
                                            <InputGroup className='my-1'>
                                                <InputGroupAddon addonType="prepend">
                                                    {validAddress === true &&
                                                        <button className="btn btn-primary" onClick={()=>{proposeAddress('INCENTIVE')}}><i className="bx bx-pin align-middle"/> Propose</button>
                                                    }
                                                    {validAddress === false &&
                                                        <button className="btn btn-danger"><i className="bx bx-right-arrow-alt align-middle"/> Input</button>
                                                    }
                                                </InputGroupAddon>
                                                <Input placeholder={'Enter New Address'} onChange={(event) => {updatePropAddress(event.target.value)}} />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{validAddress === true && <i className='bx bx-check-circle bx-xs text-success' />}{validAddress === false && <i className='bx bx-x-circle bx-xs text-danger' />}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <br/>Or vote for / finalize existing proposals:
                                            {addressExisting &&
                                                <>
                                                    <table className='w-100 text-center mt-3 bg-light p-2' style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}} >
                                                        <thead style={{borderStyle:'solid', borderWidth:'1px', borderColor:'rgba(163,173,203,0.15)'}}>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>New Addr</th>
                                                                <th>Votes</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {addressExisting.map(i => 
                                                                <tr key={i.id}>
                                                                    <td>{i.id}</td>
                                                                    <td><a href={explorerURL + 'address/' + i.proposedAddress} target='blank'>{getAddressShort(i.proposedAddress)}</a></td>
                                                                    <td>{formatAllUnits(bn(i.votes).div(bn(wholeDAOWeight)).times(100))} %</td>
                                                                    <td>
                                                                        {i.id !== 'N/A' && i.quorum !== true &&
                                                                            <button style={{width:'100px'}} className="btn btn-primary mt-2 mx-auto p-1" onClick={()=>{voteProposal(i.id)}}>
                                                                                <i className="bx bx-like align-middle "/> Vote 
                                                                            </button>
                                                                        }
                                                                        {i.id !== 'N/A' && i.quorum === true &&
                                                                            <button style={{width:'100px'}} className="btn btn-success mt-2 mx-auto p-1" onClick={()=>{finaliseProposal(i.id)}}>
                                                                                <i className="bx bxs-zap align-middle" /> Finalise 
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr><td colSpan='4'><br/></td></tr>
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <button className="btn btn-danger mt-2 mx-auto" onClick={toggleIncentiveModal}>
                                                <i className="bx bx-window-close align-middle"/> Close 
                                            </button>
                                        </ModalFooter>
                                    </Modal>
                                </Col>
                                */}

                            </Row>

                            <Row className='text-center'>
                                {/*
                                <Col xs="12" md='6' className='d-flex align-items-stretch'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3 mb-0'><h5>Propose Simple Action</h5></CardTitle>
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
                                                    <button className="btn btn-primary my-1 mx-auto" onClick={()=>{proposeAction()}}>
                                                        <i className="bx bx-log-in-circle align-middle"/> Propose Simple Action
                                                    </button>  
                                                }
                                                {simpleActionArray.emitting === false && getActionIndex() !== 'STOP_EMISSIONS' &&
                                                    <button className="btn btn-primary my-1 mx-auto" onClick={()=>{proposeAction()}}>
                                                        <i className="bx bx-log-in-circle align-middle"/> Propose Simple Action
                                                    </button>  
                                                }
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xs="12" md='6' className='d-flex align-items-stretch'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3 mb-0'><h5>Propose Parameter Change</h5></CardTitle>
                                        <CardBody>
                                            <Col xs='12'>
                                                <InputGroup>
                                                    <Input type="select" onChange={event => setParamType(event.target.value)}>
                                                        {paramTypes.map(t => <option key={t.type}>{t.type}</option>)}
                                                    </Input>
                                                </InputGroup>
                                                <InputGroup className='my-1'><Input placeholder={'Enter New Param Value'} onChange={event => setParam(event.target.value)} /></InputGroup>
                                            <button className="btn btn-primary my-1" onClick={()=>{proposeParam()}}>
                                                <i className="bx bx-log-in-circle align-middle"/> Propose Parameter Change
                                            </button>
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xs="12" md='6' className='d-flex align-items-stretch'>
                                    <Card className='w-100'>
                                        <CardTitle className='pt-3 mb-0'><h5>Propose New Address</h5></CardTitle>
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
                                                    <button className="btn btn-primary my-1" onClick={()=>{proposeAddress()}}>
                                                        <i className="bx bx-log-in-circle align-middle"/> Propose New Address
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
                                        <CardTitle className='pt-3 mb-0'><h5>Propose New Grant</h5></CardTitle>
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
                                                    <button className="btn btn-primary my-1" onClick={()=>{proposeGrant()}}>
                                                        <i className="bx bx-log-in-circle align-middle"/> Propose New Grant
                                                    </button>
                                                }
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                                */}

                                <Col xs='12' className='mb-2'><h3>Pending Proposals</h3></Col>

                                {proposalArray.filter(x => x.type !== '').filter(x => x.finalised === false).sort((a, b) => (parseFloat(a.votes) > parseFloat(b.votes)) ? -1 : 1).map(c =>
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
                                        coolOff={coolOff}
                                    />
                                )}

                                <Col xs='12' className='mb-2'>
                                    {proposalArrayLoading !== true && proposalArrayComplete === true &&
                                        <div className="text-center m-2">All proposals loaded</div>
                                    }

                                    {context.sharesDataLoading === true &&
                                        <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                                    }

                                    {context.sharesDataLoading !== true && !context.walletData &&
                                        <div className="text-center m-2">Please connect your wallet to proceed</div>
                                    }
                                </Col>
                
                            </Row>
                        </>
                    }
                    {!proposalArray &&
                        loader
                    }
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(DAOProposals));