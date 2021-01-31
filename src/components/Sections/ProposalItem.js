import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../context";

import {convertFromWei, formatAllUnits, getAddressShort, bn, formatGranularUnits} from '../../utils'

import {
    Card, CardBody, CardTitle, CardSubtitle, CardFooter, Col, Row, Progress
} from "reactstrap";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";
import { explorerURL, getBondv3Contract, getDaoContract } from "../../client/web3";

export const ProposalItem = (props) => {

    const context = useContext(Context)

    useEffect(() => {
        if (context.account && context.account > 0) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.account])

    const [weightData, setWeightData] = useState('')
    const getData = async () => {
        let bondContract = getBondv3Contract()
        let daoContract = getDaoContract()
        let data = await Promise.all([
            bondContract.methods.mapPIDMember_votes(props.id, context.account).call(), bondContract.methods.totalWeight().call(),
            daoContract.methods.mapMember_weight(context.account).call(), daoContract.methods.totalWeight().call()
        ])
        let output = {
            'memberVote': data[0],
            'bondWeight': data[1],
            'memberVotePC': bn(data[0]).div(bn(data[1])),
            'memberWeight': data[2],
            'daoWeight': data[3],
            'memberWeightPC': bn(data[2]).div(bn(data[3])),

        }
        setWeightData(output)
    }

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
        else if (props.minority === true) {weight = 'Minority support'}
        return weight
    }

    const getDate = () => {
        let interval = ''
        let date = ''
        let now = new Date().getTime() / 1000
        now = now.toFixed(0)
        if (+props.timeStart !== 0) {
            interval = ' seconds'
            date = +props.timeStart + +props.coolOff
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

    const getSymbol = () => {
        let symbol = ''
        if (context.poolsData) {
            symbol = context.poolsData.filter(i => i.address === props.proposedAddress)
            if (symbol[0]) {symbol = symbol[0].symbol}
        }
        return symbol
    }

    return (
        <>
            <Col xs='12' md='6' className='d-flex align-items-stretch px-1 px-md-2'>
                <Card className='w-100'>
                    <CardTitle className='pt-3 mb-3'>{props.type} {(props.type === 'LIST' || props.type === 'DELIST') && 'BOND ASSET: ' + getSymbol()} [ID: {props.id}]</CardTitle>
                    <CardSubtitle className='m-2'>
                        {props.type === 'START_EMISSIONS' && <h6>Turn on the SPARTA emissions</h6>}
                        {props.type === 'STOP_EMISSIONS' && <h6>Turn off the SPARTA emissions</h6>}
                        {props.type === 'MINT' && <h6>Increase BOND+MINT allocation by {formatAllUnits(convertFromWei(props.bondBurnRate))} SPARTA</h6>}
                        {(props.type === 'DAO' || props.type === 'ROUTER' || props.type === 'UTILS' || props.type === 'INCENTIVE') && 
                            <h6>Change the {props.type} address to: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>
                        }
                        {props.type === 'LIST' && <h6>List {getSymbol()} as a bond asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                        {props.type === 'DELIST' && <h6>De-list {getSymbol()} as a bond asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
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
                                <div className='w-100 m-1 p-1 bg-light rounded'>Votes:<br/>{formatAllUnits(bn(props.votes).div(bn(props.wholeDAOWeight)).times(100))} %</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>Finalise In:<br/>{getDate()}</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>Status:<br/>{getStatus()}</div>
                            </Col>
                            <Col xs='6' className='d-flex align-items-stretch'>
                                <div className='w-100 m-1 p-1 bg-light rounded'>Weight:<br/>{getWeight()}</div>
                            </Col>
                        </Row>
                        <Progress multi className='mx-3 mt-3'>
                            <Progress bar color="danger" value={+(bn(weightData.memberVotePC).div(bn(weightData.memberWeightPC))).times(100)}></Progress>
                            <Progress bar color="warning" value={100 - +(bn(weightData.memberVotePC).div(bn(weightData.memberWeightPC))).times(100)}></Progress>
                        </Progress>
                        <div className='mt-2'>Your weight: {formatGranularUnits(bn(weightData.memberVotePC).times(100))}% of {formatGranularUnits(bn(weightData.memberWeightPC).times(100))}%</div>
                    </CardBody>
                    <CardFooter>
                        {bn(weightData.memberVotePC).comparedTo(bn(weightData.memberWeightPC)) === -1 &&
                            <button className="btn btn-primary m-1" onClick={() => {props.voteFor(props.id)}}>
                                <i className="bx bx-like bx-xs align-middle"/> Vote
                            </button>
                        }

                        {(bn(weightData.memberVotePC).comparedTo(bn(weightData.memberWeightPC)) === 0 || bn(weightData.memberVotePC).comparedTo(bn(weightData.memberWeightPC)) === 1) &&
                            <button className="btn btn-info m-1 disabled">
                                <i className="bx bx-like bx-xs align-middle"/> Maxed!
                            </button>
                        }

                        {props.majority === true && getDate()[0] === 'Now' &&
                            <button className="btn btn-primary m-1" onClick={() => {
                                props.finaliseProposal(props.id)
                            }}>
                                <i className="bx bxs-zap bx-xs align-middle"/> Finalise
                            </button>
                        }
                    </CardFooter>
                </Card>
            </Col>
        </>
)
}

export default withRouter(withNamespaces()(ProposalItem));