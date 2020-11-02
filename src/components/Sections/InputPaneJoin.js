import {convertFromWei, formatAllUnits} from "../../utils";
import React from "react";
import {PercentButtonRow} from "../common";

import {withNamespaces} from "react-i18next";

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
import {TokenIcon} from "../Common/TokenIcon";
import {SPARTA_ADDR} from "../../client/web3";

export const InputPaneJoin = (props) => {

    return (
        <div>
            <div>
                <br/>
                <Row>
                    <Col xs="12" md="6">
                        <div className="mb-3">
                            <label className="card-radio-label mb-2">
                                <input type="radio" name="currency" id="buycurrencyoption2" className="card-radio-input"/>
                                <div className="card-radio">
                                    <Row>
                                        <Col md={3}>
                                            <TokenIcon address={props.address}/>
                                            <span>  {props.paneData?.symbol}</span></Col>
                                        <div className="ml-5">
                                            <Col md={4}>
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"/>Available:</p>
                                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.balance))} {props.paneData?.symbol}</h5>
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
                                <input type="radio" name="currency"
                                       id="buycurrencyoption2"
                                       className="card-radio-input"/>

                                <div className="card-radio">
                                    <Row>
                                        <Col md={3}>
                                            <TokenIcon address={SPARTA_ADDR}/>
                                            <span>  SPARTA</span></Col>
                                        <div className="ml-5">
                                            <Col md={4}>
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"/>Available:</p>
                                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.baseBalance))} SPARTA</h5>
                                            </Col>
                                        </div>
                                    </Row>
                                </div>
                            </label>
                        </div>
                    </Col>
                    {props.activeTab === "1" && <> </>}
                </Row>
            </div>
            <br/>
            <FormGroup>
                <Row>
                    <Col sm="12">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <Label className="input-group-text">{props.t("Total")}</Label>
                            </InputGroupAddon>
                            <Input type="text" className="form-control" onChange={props.onInputChange}
                                   placeholder={formatAllUnits(convertFromWei(props.paneData?.input))}
                                   bssize={'large'}
                                // defaultValue={convertFromWei(props.paneData?.input)}
                                //   allowClear={true}
                                // addonAfter={<TokenDropDown default={props.paneData?.address}
                                //   changeToken={props.changeToken}
                                //   tokenList={props.tokenList} />}
                            ></Input>
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

export default withRouter(withNamespaces()(InputPaneJoin)); 