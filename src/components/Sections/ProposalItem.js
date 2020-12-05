import React from "react";

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

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

    return (
        <>
            <tr>
                <td>
                    <h5>{props.type}</h5>
                </td>
                <td>
                    <h5>{props.votes}</h5>
                </td>
                <td>
                    <h5>{props.timeStart}</h5>
                </td>
                <td>
                    <h5>{getStatus()}</h5>
                </td>
                <td>
                    <h5>{getWeight()}</h5>
                </td>
                <td>
                    <button type="button" className="btn btn-primary waves-effect waves-light m-1 w-75" onClick={()=>console.log('vote button')}>
                        <i className="bx bx-lock font-size-16 align-middle"/> Vote
                    </button>
                </td>
            </tr>
            <tr>
                <td colSpan='6'>
                    {props.type === 'GRANT' &&
                        <h6>Proposal to Grant {props.list[0]} a {props.list[2]} SPARTA Allocation</h6>
                    }
                    {props.type !== 'GRANT' &&
                        <h6>Proposal to {props.type} {props.list}</h6>
                    }
                </td>
            </tr>
        </>
)
};

export default withRouter(withNamespaces()(ProposalItem));