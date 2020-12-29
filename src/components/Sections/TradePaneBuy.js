import React, {useState} from "react";

import InputPaneSwap from "./InputPaneSwap";

import {bn, convertFromWei, formatAllUnits, formatGranularUnits} from "../../utils";

import {
    Button, UncontrolledCollapse,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Row, Col,
} from "reactstrap"

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";

export const TradePaneBuy = (props) => {

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
            <InputPaneSwap
                address={props.pool.address}
                pool={props.pool}
                paneData={props.tradeData}
                onInputChange={props.onTradeChange}
                changeAmount={props.changeTradeAmount}
                toggleTab={props.toggleTab}
                name={props.type}
            />

            {/*
            // MAKE SURE THESE ARE ALL VISIBLE TO USER:
            // SWAP FEE | {props.tradeData.fee}
            // RATE SLIP | {props.tradeData.actualSlip}
            // POOL PRICE SLIP | {props.tradeData.slip}
            // SPOT RATE | {pool.price}
            // OUTPUT | {output}
            // INPUT | {input}
            */}
            <Row className='align-items-center'>
                <Col xs={4} className='py-1'>
                    <h6 className='font-weight-light m-0'>{props.t("Input")} <i className="bx bx-info-circle align-middle" id="tooltipBuyInput" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipBuyInput">Estimated input amount</UncontrolledTooltip>
                </Col>
                <Col xs={8} className='py-1'><h6 className="text-right font-weight-light m-0">{formatGranularUnits(convertFromWei(props.tradeData.input))} {props.tradeData.symbol}*</h6></Col>

                <Col xs={4} className='py-1'>
                    <h6 className='font-weight-light m-0'>{props.t("Rate")} <i className="bx bx-info-circle align-middle" id="tooltipBuyRate" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipBuyRate">Estimated output rate (after fees and slippage)</UncontrolledTooltip>
                </Col>
                <Col xs={8} className='py-1'><h6 className="text-right font-weight-light m-0"> <i className="bx bx-plus-circle align-middle" id="outputToggler" role='button'/> {formatGranularUnits(props.tradeData.estRate)} SPARTA*</h6></Col>

                <Col xs={6}>
                    <UncontrolledCollapse toggler="#outputToggler" className='py-1'>
                        <h6 className='font-weight-light m-0'>{props.t("Rate Slip")} <i className="bx bx-info-circle align-middle" id="tooltipBuyRateSlip" role='button'/></h6>
                        <UncontrolledTooltip placement="right" target="tooltipBuyRateSlip">Estimated rate slip; the difference between spot price and the rate you are getting after slippage & fees.</UncontrolledTooltip>
                    </UncontrolledCollapse>
                </Col>
                <Col xs={6}>
                    <UncontrolledCollapse toggler="#outputToggler" className='py-1'>
                        <h6 className="text-right font-weight-light m-0">{`${((props.tradeData.actualSlip) * 100).toFixed(3)}%`}*</h6>
                    </UncontrolledCollapse>
                </Col>


                <Col xs={4} className='py-1'>
                    <h6 className='font-weight-light m-0'>{props.t("Fee")} <i className="bx bx-info-circle align-middle" id="tooltipBuyFee" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipBuyFee">Estimated pool fee for the swap. This fee is awarded to liquidity providers' pool holdings to incentivize deeper pools over time.</UncontrolledTooltip>
                </Col>
                <Col xs={8} className='py-1'><h6 className="text-right font-weight-light m-0">{formatGranularUnits(convertFromWei(props.tradeData.fee))} {props.tradeData.outputSymbol}*</h6></Col>


                <Col xs={4} className='py-1'>
                    <h6 className='font-weight-light m-0'>{props.t("Slip")} <i className="bx bx-info-circle align-middle" id="tooltipBuyPoolSlip" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipBuyPoolSlip">Estimated pool price slip; the difference between asset's price in the pool before/after this swap.</UncontrolledTooltip>
                </Col>
                <Col xs={8} className='py-1'><h6 className="text-right font-weight-light m-0">{`${((props.tradeData.slip) * 100).toFixed(3)}%`}*</h6></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={5} className='py-1'>
                    <h6 className='m-0'>{props.t("Output")} <i className="bx bx-info-circle align-middle" id="tooltipBuyOutput" role='button'/></h6>
                    <UncontrolledTooltip placement="right" target="tooltipBuyOutput">Estimated final output from this swap.</UncontrolledTooltip>
                </Col>
                <Col xs={7} className='py-1'><h5 className="text-right m-0 py-2">{formatGranularUnits(convertFromWei(props.tradeData.output))} {props.tradeData.outputSymbol}*</h5></Col>

                <Col xs={12} className='py-1'><hr className='m-0'/></Col>

                <Col xs={12}><p className='text-right'>Estimated*</p></Col>
            </Row>

            {bn(props.tradeData.balance).comparedTo(0) <= 0 && props.tradeData.symbol !== 'XXX' &&
                <Col xs={12} className='py-1'><h6 className='text-center'>You have no {props.tradeData.symbol} in your wallet.</h6></Col>
            }

            {props.tradeData.symbol === 'XXX' &&
                <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
            }

            <div className="text-center">
                {!props.approval && bn(props.tradeData.balance).comparedTo(0) === 1 &&
                    <Button size="lg" color="success" onClick={props.unlock} className="m-1">
                        <i className="bx bx-lock-open"/>{props.t("Approve")} {props.tradeData.symbol}
                        {props.startTx && !props.endTx &&
                            <i className="bx bx-spin bx-loader ml-1" />
                        }
                    </Button>
                }
                {props.approval && bn(props.tradeData.balance).comparedTo(0) === 1 && bn(props.tradeData.input).comparedTo(bn(props.tradeData.balance)) <= 0 &&
                    <Button size="lg" color="success" onClick={checkEnoughForGas} className="m-1">
                        {`${props.type} ${props.pool.symbol}`}
                        {props.startTx && !props.endTx &&
                            <i className="bx bx-spin bx-loader ml-1" />
                        }
                    </Button>
                }
                {props.approval && bn(props.tradeData.input).comparedTo(props.tradeData.balance) === 1 &&
                    <button className="btn btn-danger btn-lg btn-block waves-effect waves-light">
                        <i className="bx bx-error-circle font-size-20 align-middle mr-2" /> Not Enough {props.tradeData.symbol} in Wallet!
                    </button>
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
                            <Button color="primary" onClick={() => {toggle();props.trade();}}>
                                Continue Transaction!
                            </Button>
                        }
                        {remainder < 0.05 &&
                            <>
                                <Button color="primary" onClick={() => {props.changeTradeAmount((0.999 - (0.05 / convertFromWei(props.tradeData.balance))) * 100);}}>
                                    Change to ~{formatAllUnits(convertFromWei(props.tradeData.balance * (0.999 - (0.05 / convertFromWei(props.tradeData.balance)))))} BNB
                                </Button>
                                <Button color="danger" onClick={() => {toggle();props.trade();}}>
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


export default withRouter(withNamespaces()(TradePaneBuy));