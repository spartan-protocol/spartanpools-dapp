import {convertFromWei, formatAllUnits} from "../../utils";
import React from "react";
import {PercentButtonRow} from "../common";

import {withNamespaces} from "react-i18next";

import {TokenIcon} from '../Common/TokenIcon'

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
import {SPARTA_ADDR} from "../../client/web3";

export const InputPaneSwap = (props) => {

    return (
        <div>
            <div>
                <Row>
                    <Col xs="12" md="6">
                        <div className="mb-3">
                            <label className="card-radio-label mb-2">
                                <input type="radio" name="currency" id="buycurrencyoption1" className="card-radio-input"/>
                                <div className="card-radio">
                                    <Row>
                                        <Col md={3}>
                                            <TokenIcon address={props.address}/>
                                            <span className="">
                                                {props.paneData?.outputSymbol === 'SPARTA' &&
                                                    props.paneData?.symbol
                                                }
                                                {props.paneData?.outputSymbol !== 'SPARTA' &&
                                                    props.paneData?.outputSymbol
                                                }
                                            </span>
                                        </Col>
                                        <div className="ml-5">
                                            <Col md={4}>
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"/>Available:</p>
                                                <h5 className="font-size-16">
                                                    {props.paneData?.outputSymbol === 'SPARTA' &&
                                                        formatAllUnits(convertFromWei(props.paneData?.balance))
                                                    }
                                                    {props.paneData?.outputSymbol !== 'SPARTA' &&
                                                        formatAllUnits(convertFromWei(props.paneData?.outputBalance))
                                                    }
                                                </h5>
                                            </Col>
                                        </div>
                                    </Row>
                                </div>
                            </label>
                        </div>
                    </Col>
                    <Col xs="12" md="6">
                        <div className="mb-3">
                            <label className="card-radio-label mb-2">
                                <input type="radio" name="currency" id="buycurrencyoption2" className="card-radio-input"/>
                                <div className="card-radio">
                                    <Row>
                                        <Col md={3}>
                                            <TokenIcon address={SPARTA_ADDR}/>
                                            <span className=""> SPARTA</span></Col>
                                        <div className="ml-5">
                                            <Col md={4}>
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"/>Available:</p>
                                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.balance))} SPARTA</h5>
                                            </Col>
                                        </div>
                                    </Row>
                                </div>
                            </label>
                        </div>
                    </Col>
                </Row>
            </div>
            <br/>
            <FormGroup>
                <Label>Amount :</Label>
                <Row>
                    <Col sm="6">
                        <InputGroup className="mb-2 currency-value">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text">Sell {props.paneData?.symbol}</span>
                            </InputGroupAddon>
                            <Input min={0} type="text" className="form-control" onChange={props.onInputChange}
                                   placeholder={formatAllUnits(convertFromWei(props.paneData?.input))}
                                   bsSize={'large'}
                                // defaultValue={convertFromWei(props.paneData?.input)}
                                //   allowClear={true}
                                // addonAfter={<TokenDropDown default={props.paneData?.address}
                                //   changeToken={props.changeToken}
                                //   tokenList={props.tokenList} />}
                            ></Input>
                        </InputGroup>
                    </Col>
                    <Col sm="6">
                        <InputGroup className="mb-2">
                            <Input readOnly="readonly" type="text" className="form-control text-sm-right" placeholder={formatAllUnits(convertFromWei(props.paneData?.output))}/>
                            <InputGroupAddon addonType="append">
                                <span className="input-group-text">Buy {props.paneData?.outputSymbol}</span>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <br/>
            <div className="text-center">
                <PercentButtonRow changeAmount={props.changeAmount}/>
            </div>
            <br/>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPaneSwap));