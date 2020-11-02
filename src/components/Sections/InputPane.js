import {convertFromWei, formatAllUnits} from "../../utils";
import React, {useState} from "react";
import {PercentButtonRow} from "../common";

import {withNamespaces} from "react-i18next";

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
import TradePane from "./TradePane";

export const InputPane = (props) => {

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

                    <Col xs="6" md="6">
                        <div className="mb-3">
                            <label className="card-radio-label mb-2">
                                <input type="radio" name="currency"
                                        id="buycurrencyoption1"
                                        className="card-radio-input"
                                        defaultChecked readOnly/>

                                <div className="card-radio">
                                    <div>
                                        <i className="mdi mdi-circle font-size-24 text-warning align-middle mr-2"></i>
                                        <span>XXX</span>
                                    </div>
                                </div>
                            </label>

                            <div>
                                <p className="text-muted mb-1">Current
                                    price
                                    :</p>
                                <h5 className="font-size-16">{formatAllUnits(convertFromWei(props.paneData?.balance))}  {props.paneData?.symbol}</h5>
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="6">
                        <div className="mb-3">
                            <label className="card-radio-label mb-2">
                                <input type="radio" name="currency"
                                        id="buycurrencyoption2"
                                        className="card-radio-input"
                                        defaultChecked readOnly/>

                                <div className="card-radio">
                                    <div>
                                        <i className="mdi mdi-circle font-size-24 text-warning align-middle mr-2"></i>
                                        <span>XXX</span>
                                    </div>
                                </div>
                            </label>

                            <div>
                                <p className="text-muted mb-1">Current
                                    price
                                    :</p>
                                <h5 className="font-size-16">XXX
                                    XX</h5>
                            </div>
                        </div>
                    </Col>

                        {/*<h5 className="mb-2 mt-2 text-right"></h5>*/}
                        {/*<p className='mb-0 text-right'></p>*/}
                    {props.activeTab === "1" &&
                        <>
                            <h5 className="mb-2 mt-2 text-right">{formatAllUnits(convertFromWei(props.paneData?.baseBalance))}</h5><p className='mb-0 text-right'> SPARTA</p>
                        </>
                    }
                
                </Row>

                {/*<Label>{props.t("Add Amount :")}</Label>*/}
                {/*<InputGroup className="mb-3">*/}
                {/*    <InputGroupAddon addonType="prepend">*/}
                {/*        <Label className="input-group-text">{props.t("Total")}</Label>*/}
                {/*    </InputGroupAddon>*/}
                {/*    <Input type="text" className="form-control" onChange={props.onInputChange}*/}
                {/*           placeholder={formatAllUnits(convertFromWei(props.paneData?.input))}*/}
                {/*           size={'large'}*/}
                {/*        // defaultValue={convertFromWei(props.paneData?.input)}*/}
                {/*        //   allowClear={true}*/}
                {/*        // addonAfter={<TokenDropDown default={props.paneData?.address}*/}
                {/*        //   changeToken={props.changeToken}*/}
                {/*        //   tokenList={props.tokenList} />}*/}
                {/*    ></Input>*/}

                {/*</InputGroup>*/}

            </div>
            <FormGroup>
                <Label>Add value :</Label>
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
                            <Input type="text"
                                   className="form-control text-sm-right" placeholder={formatAllUnits(convertFromWei(props.paneData?.output))}/>


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

export default withRouter(withNamespaces()(InputPane));