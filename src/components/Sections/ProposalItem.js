import React from "react";

import {convertFromWei, formatAllUnits, getAddressShort, bn} from '../../utils'

import {
    Card, CardBody, CardTitle, CardSubtitle, CardFooter, Col, Row
} from "reactstrap";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";
import { explorerURL } from "../../client/web3";

export const ProposalItem = (props) => {
    const getStatus = () => {
        let status = 'Pending'
        if (props.finalised === true) {status = 'Finalised'}
        else if (props.finalising === true) {status = 'Finalising'}
        return status
    }

    const getWeight = () => {
        let weight = 'Needs more support'
        if (props.majority === true) {weight = 'Majority support'}
        else if (props.quorum === true) {weight = 'Quorum support'}
        else if (props.minority === true) {weight = 'Minorty support'}
        return weight
    }

    const getDate = () => {
        let date = ''
        if (props.timeStart === '') {
            date = new Date(props.timeStart * 1000).toLocaleDateString()
        }
        else date = '-'
        return date
    }

    return (
        <>
            <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                <Card className='w-100'>
                    <CardTitle className='pt-3 mb-3'>#{props.id} - {props.type}</CardTitle>
                    <CardSubtitle className='m-2'>
                        {props.type === 'START_EMISSIONS' && <h6>Turn on the SPARTA emissions</h6>}
                        {props.type === 'STOP_EMISSIONS' && <h6>Turn off the SPARTA emissions</h6>}
                        {props.type === 'MINT' && <h6>Increase BOND+MINT allocation by {formatAllUnits(convertFromWei(props.bondBurnRate))} SPARTA</h6>}
                        {(props.type === 'DAO' || props.type === 'ROUTER' || props.type === 'UTILS' || props.type === 'INCENTIVE') && 
                            <h6>Change the {props.type} address to: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>
                        }
                        {props.type === 'LIST' && <h6>List BOND asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'DELIST' && <h6>De-list BOND asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'ADD_CURATED_POOL' && <h6>Add pool to curated list: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'REMOVE_CURATED_POOL' && <h6>Remove pool from curated list: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'CHALLENGE_CURATED_POOL' && <h6>Challenge low-depth curated pool: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'CURVE' && <h6>Change the emissions curve to {formatAllUnits(props.param)}</h6>}
                        {props.type === 'DURATION' && <h6>Change the era duration to {formatAllUnits((props.param))}</h6>}
                        {props.type === 'COOL_OFF' && <h6>Change the cool-off period to {formatAllUnits(props.param)}</h6>}
                        {props.type === 'ERAS_TO_EARN' && <h6>Change the eras-to-earn to {formatAllUnits(props.param)}</h6>}
                        {props.type === 'GRANT' && <h6>Grant of {props.list[2]} SPARTA to: <a href={explorerURL + 'address/' + props.list[0]} target='blank'>{getAddressShort(props.list[0])}</a></h6>}
                    </CardSubtitle>
                    <CardBody className='pt-2'>
                        <Row>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>VOTES:<br/>{formatAllUnits(bn(props.votes).div(bn(props.wholeDAOWeight)).times(100))} %</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>DATE:<br/>{getDate()}</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>STATUS:<br/>{getStatus()}</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>WEIGHT:<br/>{getWeight()}</div>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <button className="btn btn-primary m-1" onClick={() => {
                            props.voteFor(props.id)
                        }}>
                            <i className="bx bx-like bx-xs align-middle"/> Vote
                        </button>

                        <button className="btn btn-primary m-1" onClick={() => {
                            props.finaliseProposal(props.id)
                        }}>
                            <i className="bx bxs-zap bx-xs align-middle"/> Finalise
                        </button>
                    </CardFooter>
                </Card>
            </Col>
        </>
)
};

export default withRouter(withNamespaces()(ProposalItem));