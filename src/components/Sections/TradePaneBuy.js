import React, {useState} from "react";

import InputPaneSwap from "./InputPaneSwap";

import {convertFromWei, formatAllUnits} from "../../utils";

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
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

            
            <div className="table-responsive mt-6">
                <table className="table table-centered table-nowrap mb-0">
                    <tbody>
                        <tr>
                            <td style={{width: "100%"}}>
                                <div className="mb-0 text-left">
                                    <span id="tooltipBuyRate">{props.t("Est. Rate")} <i className="bx bx-info-circle align-middle"/></span>
                                    <UncontrolledTooltip placement="right" target="tooltipBuyRate">Estimated rate</UncontrolledTooltip>
                                </div>
                            </td>
                            <td style={{width: "10%"}}>
                                <h5 className="mb-0 text-right"> {props.tradeData.estRate} SPARTA</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="mb-0 text-left">
                                    <span id="tooltipBuySlip">{props.t("Est. Slip")} <i className="bx bx-info-circle align-middle"/></span>
                                    <UncontrolledTooltip placement="right" target="tooltipBuySlip">Estimated rate slip. Difference between market rate and the rate you are getting.</UncontrolledTooltip>
                                </div>
                            </td>
                            <td>
                                <h5 className="mb-0 text-right"><span
                                    className="font-size-16 badge badge-success ml-1 align-bottom">{`${((props.tradeData.slip) * 100).toFixed(0)}%`}</span>
                                </h5>
                            </td>
                        </tr>
                        <tr>
                            <td style={{width: "100%"}}>
                                <div className="mb-0 text-left">
                                    <span id="tooltipBuyFee">{props.t("Est. Fee")} <i className="bx bx-info-circle align-middle"/></span>
                                    <UncontrolledTooltip placement="right" target="tooltipBuyFee">Estimated pool fee for this swap transaction.</UncontrolledTooltip>
                                </div>
                            </td>
                            <td style={{width: "10%"}}>
                                <h5 className="mb-0 text-right"> {formatAllUnits(convertFromWei(props.tradeData.fee))} {props.tradeData.outputSymbol}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td style={{width: "100%"}}>
                                <div className="mb-0 text-left">
                                    <span className="font-size-26" id="tooltipBuyOutput">{props.t("Est. Output")} <i className="bx bx-info-circle align-middle"/></span>
                                    <UncontrolledTooltip placement="right" target="tooltipBuyOutput">Estimated final figure resulting from this swap.</UncontrolledTooltip>
                                </div>
                            </td>
                            <td style={{width: "10%"}}>
                                <h2 className="mb-0 text-right"> {formatAllUnits(convertFromWei(props.tradeData.output))} {props.tradeData.outputSymbol}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br/><br/>
            <div className="text-center">
                {!props.approval && (props.tradeData.balance > 0) &&
                    <Button size="lg" color="success" onClick={props.unlock} className="m-1"> <i className="bx bx-lock-open"/>{props.t("Approve")}</Button>
                }
                {props.approval && props.startTx && !props.endTx &&
                    <Button size="lg" color="success" onClick={checkEnoughForGas} className="m-1">
                        <i className="bx bx-loader-alt bx-spin mx-1 float-right"/>{`${props.type} ${props.pool.symbol}`}
                    </Button>
                }
                {props.approval && !props.startTx && (props.tradeData.balance > 0) &&
                    <Button size="lg" color="success" onClick={checkEnoughForGas} className="m-1">
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