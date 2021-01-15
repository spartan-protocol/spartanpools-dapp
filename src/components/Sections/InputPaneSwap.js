import {convertFromWei, formatGranularUnits} from "../../utils";
import React from "react";
import {PercentSlider} from "../common";

import {withNamespaces} from "react-i18next";
import {TokenIcon} from "../Common/TokenIcon"
import {SPARTA_ADDR} from "../../client/web3"

import {
    Col,
    Row,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import { withRouter } from "react-router-dom";

export const InputPaneSwap = (props) => {

    return (
        <div>
            <FormGroup>
                <Row style={{position:'relative'}}>
                    <Col sm="6" className='px-1'>
                        <InputGroup className="mb-1 currency-value">
                            <InputGroupAddon addonType="prepend" className="input-group-text w-100">
                                {props.paneData?.symbol === 'SPARTA' &&
                                <>
                                    <TokenIcon address={SPARTA_ADDR}/><h5 className='mb-0 ml-2'>Sell SPARTA</h5>
                                </>
                                }
                                {props.pool.address !== "XXX" && props.paneData?.symbol !== 'SPARTA' &&
                                <>
                                    <TokenIcon address={props.address}/><h5 className='mb-0 ml-2'>Sell {props.paneData.symbol}</h5>
                                </>
                                }
                                {props.pool.address === "XXX" &&
                                <>
                                    <img src={process.env.PUBLIC_URL + "/fallback.png"} style={{height: 40, borderRadius: 21}} alt={"Fallback Token Icon"}/><h5 className='mb-0 ml-2'><i className="bx bx-spin bx-loader"/></h5>
                                </>
                                }
                            </InputGroupAddon>
                            <Input min={0} type="text" className="form-control" onChange={props.onInputChange}
                                placeholder={formatGranularUnits(convertFromWei(props.paneData?.input))}
                                id={'manualInput-' + props.name}
                            >
                            </Input>

                            {/* ADD DROPDOWN SELECTOR TO CHANGE TOKEN SEE COMMON -> TokenDropDown FOR IDEAS
                            <InputGroupAddon addonType='append'>DROPDOWN TOKEN SELECTOR</InputGroupAddon>
                            */}

                        </InputGroup>
                    </Col>
                    <i className='bx bx-sort bx-md rounded-circle p-1' style={{backgroundColor:'#a80005',color:'#FFF',zIndex:'5',position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%) rotate(90deg)'}} onClick={props.toggleTab} role='button' />
                    <Col sm="6" className='px-1'>
                        <InputGroup className="mb-1">
                            <Input readOnly="readonly" type="text" className="form-control text-right" placeholder={formatGranularUnits(convertFromWei(props.paneData?.output))}/>
                            <InputGroupAddon addonType="append" className="input-group-text w-100 text-right">
                                {props.pool.address !== "XXX" && props.paneData?.outputSymbol === 'SPARTA' &&
                                <>
                                    <h5 className='mb-0 ml-auto mr-2'>Buy SPARTA</h5><TokenIcon address={SPARTA_ADDR}/>
                                </>
                                }
                                {props.pool.address !== "XXX" && props.paneData?.outputSymbol !== 'SPARTA' &&
                                <>
                                    <h5 className='mb-0 ml-auto mr-2'>Buy {props.paneData.outputSymbol}</h5><TokenIcon address={props.address}/>
                                </>
                                }
                                {props.pool.address === "XXX" &&
                                <>
                                    <h5 className='mb-0 ml-auto mr-2'><i className="bx bx-spin bx-loader"/></h5><img src={process.env.PUBLIC_URL + "/fallback.png"} style={{height: 40, borderRadius: 21}} alt={"Fallback Token Icon"}/>
                                </>
                                }
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <div className="text-center">
                {props.paneData?.outputSymbol !== 'SPARTA' && props.paneData.balance > 0 &&
                    <PercentSlider changeAmount={props.changeAmount} paneData={props.paneData} name={props.name} />
                }
                {props.paneData?.outputSymbol === 'SPARTA' && props.paneData.balance > 0 &&
                    <PercentSlider changeAmount={props.changeAmount} paneData={props.paneData} name={props.name} />
                }
            </div>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPaneSwap));