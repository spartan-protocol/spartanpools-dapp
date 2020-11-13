import {convertFromWei, formatAllUnits} from "../../utils";
import React from "react";
import {PercentButtonRow} from "../common";

import {translate, withNamespaces} from "react-i18next";

import {
    Col,
    Row,
    FormGroup,
    Input,
    Label,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import { withRouter } from "react-router-dom";

export const InputPaneSwap = (props) => {

    return (
        <div>
            <FormGroup>
                <Row style={{position:'relative'}}>
                    <Col sm="6">
                        <InputGroup className="mb-1 currency-value">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text">Sell {props.paneData?.symbol}</span>
                            </InputGroupAddon>
                            <Input min={0} type="text" className="form-control" onChange={props.onInputChange}
                                placeholder={formatAllUnits(convertFromWei(props.paneData?.input))}
                                bsSize={'large'}
                                // defaultValue={convertFromWei(props.paneData?.input)}
                                // allowClear={true}
                                // addonAfter={<TokenDropDown default={props.paneData?.address}
                                // changeToken={props.changeToken}
                                // tokenList={props.tokenList} />}
                            >
                            </Input>
                        </InputGroup>
                    </Col>
                    <i className='bx bx-sort bx-lg rounded-circle p-1' style={{backgroundColor:'#556ee6',color:'#FFF',zIndex:'5',position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%) rotate(90deg)'}} onClick={props.toggleTab} role='button' />
                    <Col sm="6">
                        <InputGroup className="mb-1">
                            <Input readOnly="readonly" type="text" className="form-control text-right" placeholder={formatAllUnits(convertFromWei(props.paneData?.output))}/>
                            <InputGroupAddon addonType="append">
                                <span className="input-group-text">Buy {props.paneData?.outputSymbol}</span>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <div className="text-center">
                <PercentButtonRow changeAmount={props.changeAmount}/>
            </div>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPaneSwap));