import React, {useState} from "react";

import InputPane from "../Sections/InputPane";

import {convertFromWei, formatAllUnits} from "../../utils";
import {LoadingOutlined, UnlockOutlined} from "@ant-design/icons";

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
    InputGroup,
    InputGroupAddon
} from "reactstrap"

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

export const TradePane = (props) => {

    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(!showModal);

    const remainder = convertFromWei(props.tradeData.balance - props.tradeData.input)

    const checkEnoughForGas = () => {
        if (props.tradeData.symbol === 'BNB') { // if input Symbol is BNB
            if (remainder < 0.05) {   //if (wallet BNB balance) minus (transaction BNB amount) < 0.05
                setShowModal(true)
            }    
            else props.trade()
        }

        else {
            props.trade()
        }
    }

    return (
        <>
            <InputPane
                address={props.pool.address}
                pool={props.pool}
                paneData={props.tradeData}
                onInputChange={props.onTradeChange}
                changeAmount={props.changeTradeAmount}
            />
            <br/>

            {/*
            // MAKE SURE THESE ARE ALL VISIBLE TO USER:
            // SWAP FEE | {props.tradeData.fee}
            // RATE SLIP | {props.tradeData.actualSlip}
            // POOL PRICE SLIP |
            // SPOT RATE | {pool.price}
            // OUTPUT | {output}
            // INPUT | {input}
            */}

            <Card>
                <CardBody>

                    <Media>
                        {/*<div className="mr-4">*/}
                        {/*    <i className="mdi mdi-account-circle text-primary h1"></i>*/}
                        {/*</div>*/}

                        {/*<Media body>*/}
                        {/*    <div className="text-muted">*/}
                        {/*        <h5>XX</h5>*/}
                        {/*        <p className="mb-1">xx</p>*/}
                        {/*        <p className="mb-0">xx</p>*/}
                        {/*    </div>*/}

                        {/*</Media>*/}

                        {/*<Dropdown isOpen={this.state.isMenu} toggle={this.toggleMenu} className="ml-2">*/}
                        {/*    <DropdownToggle tag="i" className="text-muted">*/}
                        {/*        <i className="mdi mdi-dots-horizontal font-size-18"></i>*/}
                        {/*    </DropdownToggle>*/}
                        {/*    <DropdownMenu right>*/}
                        {/*        <DropdownItem href="#">Action</DropdownItem>*/}
                        {/*        <DropdownItem href="#">Another action</DropdownItem>*/}
                        {/*        <DropdownItem href="#">Something else</DropdownItem>*/}
                        {/*    </DropdownMenu>*/}
                        {/*</Dropdown>*/}
                    </Media>
                </CardBody>
                <CardBody className="border-top">

                    <Row>
                        <Col sm="6">
                            <div>
                                <p className="text-muted mb-2">XXX</p>
                                <h5>XXX</h5>
                            </div>
                        </Col>
                        <Col sm="6">
                            <div className="text-sm-right mt-4 mt-sm-0">
                                <p className="text-muted mb-2">XXX</p>
                                <h5>XXX  <span className="badge badge-success ml-1 align-bottom">+ 1.3 %</span></h5>

                            </div>
                        </Col>
                    </Row>
                </CardBody>

                <CardBody className="border-top">
                    <p className="text-muted mb-4">In this month</p>
                    <div className="text-center">
                        <Row>
                            <Col sm="4">
                                <div>
                                    <div className="font-size-24 text-primary mb-2">
                                        <i className="bx bx-send"></i>
                                    </div>

                                    <p className="text-muted mb-2">XXX</p>
                                    <h5>XXX</h5>

                                    <div className="mt-3">
                                        {/*<Link to="#" className="btn btn-primary btn-sm w-md">Send</Link>*/}
                                    </div>
                                </div>
                            </Col>
                            <Col sm="4">
                                <div className="mt-4 mt-sm-0">
                                    <div className="font-size-24 text-primary mb-2">
                                        <i className="bx bx-import"></i>
                                    </div>

                                    <p className="text-muted mb-2">XXX</p>
                                    <h5>XXX</h5>

                                    <div className="mt-3">
                                        {/*<Link to="#" className="btn btn-primary btn-sm w-md">Receive</Link>*/}
                                    </div>
                                </div>
                            </Col>
                            <Col sm="4">
                                <div className="mt-4 mt-sm-0">
                                    <div className="font-size-24 text-primary mb-2">
                                        <i className="bx bx-wallet"></i>
                                    </div>

                                    <p className="text-muted mb-2">XXX</p>
                                    <h5>XXX</h5>

                                    <div className="mt-3">
                                        {/*<Link to="#" className="btn btn-primary btn-sm w-md">Withdraw</Link>*/}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </CardBody>
            </Card>

            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>

                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0 text-left">{props.t("Est. Rate")}</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h5 className="mb-0 text-right"> {props.tradeData.estRate} SPARTA</h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="mb-0 text-left">{props.t("Est. Slip")}</p>
                        </td>
                        <td>
                            <h5 className="mb-0 text-right"> {`${((props.tradeData.slip) * 100).toFixed(0)}%`}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0 text-left">{props.t("Est. Fee")}</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h5 className="mb-0 text-right"> {formatAllUnits(convertFromWei(props.tradeData.fee))} {props.tradeData.outputSymbol}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: "100%"}}>
                            <p className="mb-0 text-left">{props.t("Est. Output")}</p>
                        </td>
                        <td style={{width: "10%"}}>
                            <h3 className="mb-0 text-right"> {formatAllUnits(convertFromWei(props.tradeData.output))} {props.tradeData.outputSymbol}</h3>
                        </td>
                    </tr>


                    </tbody>
                </table>
            </div>
            <br/><br/>
            <div className="text-center">
                {!props.approval && (props.tradeData.balance > 0) &&
                    <Button size="lg" color="success" onClick={props.unlock} className="m-1"><UnlockOutlined className='mr-1'/>{props.t("Approve")}</Button>
                }

                {props.approval && props.startTx && !props.endTx &&
                    <Button 
                    size="lg" 
                    color="success" 
                    onClick={checkEnoughForGas}
                    className="m-1"
                    >
                        <LoadingOutlined className='mr-1'/>{`${props.type} ${props.pool.symbol}`}
                    </Button>
                }

                {props.approval && !props.startTx && (props.tradeData.balance > 0) &&
                    <Button 
                    size="lg" 
                    color="success" 
                    onClick={checkEnoughForGas}
                    className="m-1"
                    >
                        {`${props.type} ${props.pool.symbol}`}
                    </Button>
                }

                <Modal isOpen={showModal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>BNB balance will be low after this transaction!</ModalHeader>
                        <ModalBody>
                            {remainder >= 0.05 &&
                                <>
                                    This transaction will now leave you with (~{formatAllUnits(remainder)} BNB)<br/>
                                    This is plenty of gas to interact with the BSC network.<br/>
                                    If you would rather a different amount please cancel txn and manually input your amount.<br/>
                                    Remember though, we recommend leaving ~0.05 BNB in your wallet for gas purposes.<br/>
                                </>
                            }
                            {remainder < 0.05 &&
                                <>
                                    This transaction will leave you with a very low BNB balance (~{formatAllUnits(remainder)} BNB)<br/>
                                    Please ensure you understand that BNB is used as 'gas' for the BSC network.<br/>
                                    If you do not have any/enough BNB in your wallet you may not be able to transfer assets or interact with BSC DApps after this transaction.<br/>
                                    Keep in mind however, gas fees are usually very low (~0.005 BNB).<br/>
                                    0.05 BNB is usually enough for 10+ transactions.<br/>
                                </>
                            }
                        </ModalBody>
                        <ModalFooter>
                            {remainder >= 0.05 &&
                                <Button 
                                color="primary" 
                                onClick={() => {
                                    toggle();
                                    props.trade();
                                }}>
                                    Continue Transaction!
                                </Button>
                            }
                            {remainder < 0.05 &&
                                <>
                                    <Button 
                                    color="primary" 
                                    onClick={() => {
                                        props.changeTradeAmount((0.999 - (0.05 / convertFromWei(props.tradeData.balance))) * 100);
                                    }}>
                                        Change to ~{formatAllUnits(convertFromWei(props.tradeData.balance * (0.999 - (0.05 / convertFromWei(props.tradeData.balance)))))} BNB
                                    </Button>
                                    <Button 
                                        color="danger" 
                                        onClick={() => {
                                            toggle();
                                            props.trade();
                                        }}>
                                            Continue (Might Fail!)
                                    </Button>
                                </>
                            }
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                </Modal>

            </div>
        </>
    )
};


export default withRouter(withNamespaces()(TradePane));