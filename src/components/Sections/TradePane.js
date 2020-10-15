import React, {useState} from "react";

import InputPane from "../Sections/InputPane";

import {convertFromWei, formatAllUnits} from "../../utils";
import {LoadingOutlined, UnlockOutlined} from "@ant-design/icons";

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap"

import {withNamespaces} from "react-i18next";
import {withRouter} from "react-router-dom";

export const TradePane = (props) => {

    const [showModal, setShowModal] = useState(false);

    const toggle = () => setShowModal(!showModal);

    const checkEnoughForGas = () => {
        if (props.tradeData.symbol === 'BNB') { // if input Symbol is BNB
            if (convertFromWei(props.tradeData.balance - props.tradeData.input) < 0.05) {   //if (wallet BNB balance) minus (transaction BNB amount) < 0.05
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
                pool={props.pool}
                paneData={props.tradeData}
                onInputChange={props.onTradeChange}
                changeAmount={props.changeTradeAmount}
            />
            <br/>

                    {/*
                    // MAKE SURE THESE ARE ALL VISIBLE TO USER:
                    // SWAP FEE | {props.tradeData.fee}
                    // ACTUAL SLIP | {props.tradeData.actualSlip}
                    // SPOT RATE | {pool.price}
                    // OUTPUT | {output}
                    // INPUT | {input}
                    */}

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
                            This transaction will leave you with a very low BNB balance ({convertFromWei(props.tradeData.balance - props.tradeData.input)} BNB)<br/>
                            Please ensure you understand that BNB is used as 'gas' for the BSC network.<br/>
                            If you do not have any/enough BNB in your wallet you may not be able to transfer assets or interact with BSC DApps after this transaction.<br/>
                            Keep in mind however, gas fees are usually very low (~0.005 BNB).<br/>
                            0.05 BNB is usually enough for 10+ transactions.<br/>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                            color="primary" 
                            onClick={() => {
                                toggle();
                                props.trade();
                            }}>
                                Continue Txn Anyway!
                            </Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel Transaction</Button>
                        </ModalFooter>
                </Modal>

            </div>
        </>
    )
};


export default withRouter(withNamespaces()(TradePane));