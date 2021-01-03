import React from "react";

import {convertFromWei, formatAllUnits, getAddressShort, bn} from '../../utils'

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
        let date = new Date(props.timeStart * 1000).toLocaleDateString()
        return date
    }

    return (
        <>
            <tr>
                <td>
                    <h5>{props.type}</h5>
                </td>
                <td>
                    <h5>{formatAllUnits(bn(props.votes).div(bn(props.wholeDAOWeight)).times(100))} %</h5>
                </td>
                <td>
                    <h5>{getDate()}</h5>
                </td>
                <td>
                    <h5>{getStatus()}</h5>
                </td>
                <td>
                    <h5>{getWeight()}</h5>
                </td>
                <td>
                    <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={() => props.voteFor(props.id)}>
                        <i className="bx bx-lock font-size-16 align-middle"/> Vote
                    </button>
                    <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={() => props.finaliseProposal(props.id)}>
                        <i className="bx bx-lock font-size-16 align-middle"/> Finalise
                    </button>
                </td>
            </tr>
            <tr>
                <td colSpan='6' className='border-0'>
                    {props.type === 'START_EMISSIONS' && <h6>Turn on the SPARTA emissions</h6>}
                    {props.type === 'STOP_EMISSIONS' && <h6>Turn off the SPARTA emissions</h6>}
                    {props.type === 'MINT' && <h6>Increase BOND+MINT allocation by {formatAllUnits(convertFromWei(props.bondBurnRate))} SPARTA</h6>}
                    {(props.type === 'DAO' || props.type === 'ROUTER' || props.type === 'UTILS' || props.type === 'INCENTIVE') && 
                        <h6>Change the {props.type} address to: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>
                    }
                    {props.type === 'LIST_BOND' && <h6>List BOND asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                    {props.type === 'DELIST_BOND' && <h6>De-list BOND asset: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                    {props.type === 'ADD_CURATED_POOL' && <h6>Add pool to curated list: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                    {props.type === 'REMOVE_CURATED_POOL' && <h6>Remove pool from curated list: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                    {props.type === 'CHALLENGE_CURATED_POOL' && <h6>Challenge low-depth curated pool: <a href={explorerURL + 'address/' + props.proposedAddress} target='blank'>{getAddressShort(props.proposedAddress)}</a></h6>}
                    {props.type === 'CURVE' && <h6>Change the emissions curve to {formatAllUnits(props.param)}</h6>}
                    {props.type === 'DURATION' && <h6>Change the era duration to {formatAllUnits((props.param))}</h6>}
                    {props.type === 'COOL_OFF' && <h6>Change the cool-off period to {formatAllUnits(props.param)}</h6>}
                    {props.type === 'ERAS_TO_EARN' && <h6>Change the eras-to-earn to {formatAllUnits(props.param)}</h6>}
                    {props.type === 'GRANT' && <h6>Grant of {props.list[2]} SPARTA to: <a href={explorerURL + 'address/' + props.list[0]} target='blank'>{getAddressShort(props.list[0])}</a></h6>}
                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(ProposalItem));