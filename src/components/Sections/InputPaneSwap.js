import {convertFromWei, formatAllUnits} from "../../utils";
import React, {useState} from "react";
import {PercentButtonRow} from "../common";

import {withNamespaces} from "react-i18next";

import {TokenIcon} from '../Common/TokenIcon'

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    Media,
    Col,
    Row,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroup
} from "reactstrap";
import { withRouter } from "react-router-dom";
import {BNB_ADDR, SPARTA_ADDR} from "../../client/web3";
import TradePaneBuy from "./TradePaneBuy";

export const InputPaneSwap = (props) => {

    const [buyData, setBuyData] = useState({
        address: SPARTA_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0,
        actualSlip: 0,
        fee: 0,
        estRate: 0
    });
    const [sellData, setSellData] = useState({
        address: BNB_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0,
        actualSlip: 0,
        fee: 0,
        estRate: 0
    });

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
                                            <TokenIcon address={props.pool.address}/>
                                            <span className="">  {props.paneData?.outputSymbol}</span></Col>
                                        <div className="ml-5">
                                            <Col md={4}>
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"></i>Available amount:</p>
                                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.output))} {props.paneData?.outputSymbol}</h5>
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
                                                <p className="text-muted mb-1"><i className="bx bx-wallet mr-1"></i>Available
                                                    amount:</p>
                                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.input))} SPARTA</h5>
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
                <Label>Value :</Label>
                <Row>
                    <Col sm="6">
                        <InputGroup className="mb-2 currency-value">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text">{props.paneData?.symbol}</span>
                            </InputGroupAddon>
                            <Input type="text" className="form-control" onChange={props.onInputChange}
                                   placeholder={formatAllUnits(convertFromWei(props.paneData?.input))}
                                   size={'large'}
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
                            <Input type="text" className="form-control text-sm-right" placeholder={formatAllUnits(convertFromWei(props.paneData?.output))}/>
                            <InputGroupAddon addonType="append">
                                <span className="input-group-text">{props.paneData?.outputSymbol}</span>
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