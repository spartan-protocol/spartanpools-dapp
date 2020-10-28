import {convertFromWei, formatAllUnits} from "../../utils";
import React from "react";
import {PercentButtonRow} from "../common";

import {withNamespaces} from "react-i18next";

import {
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    Col,
    Row,
} from "reactstrap";
import { withRouter } from "react-router-dom";

export const InputPane = (props) => {

    return (
        <div>
            <div>
                <Row>
                <Col xs="6">
                    <p className="mb-2 mt-2 text-left" style={{fontSize:'1.2em'}}><i className="bx bx-wallet mr-1" />{props.t("Wallet Balance")}</p>
                </Col>
                <Col xs="6">
                    {props.paneData.balance > 0 &&
                    <>
                        <h5 className="mb-2 mt-2 text-right">{formatAllUnits(convertFromWei(props.paneData?.balance))}</h5><p className='mb-0 text-right'> {props.paneData?.symbol}</p>
                    </>
                    }    
                    {props.paneData.balance <= 0 &&
                    <>
                        <h5 className="mb-2 mt-2 text-right">0.00</h5><p className='mb-0 text-right'> {props.paneData?.symbol}</p>
                    </>
                    }  
                    {props.activeTab === "1" &&
                        <>
                            <h5 className="mb-2 mt-2 text-right">{formatAllUnits(convertFromWei(props.paneData?.baseBalance))}</h5> <p className='mb-0 text-right'> SPARTA</p>
                        </>
                    }
                </Col>
                </Row>

                <Label>{props.t("Add Amount :")}</Label>
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                        <Label className="input-group-text">{props.paneData?.symbol} {props.t("Total")}</Label>
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
            </div>
            <br/>
            <div className="text-center">
                <PercentButtonRow changeAmount={props.changeAmount}/>
            </div>
            <br/>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPane));