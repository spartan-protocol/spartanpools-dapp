import React from "react";
import {PercentSlider} from "../common";

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

export const InputPaneJoin = (props) => {

    return (
        <div>
            <FormGroup>
                <Row>
                    <Col sm="12">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <Label className="input-group-text">{props.t("Input")}</Label>
                            </InputGroupAddon>
                            <Input type="text" className="form-control" onChange={props.onInputChange}
                                   bssize={'large'} id={"manualInput-" + props.name}
                                   placeholder={'Manually input ' + props.paneData?.symbol + ' here'}
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
            <div className="text-center">
                <PercentSlider changeAmount={props.changeAmount} name={props.name} />
            </div>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPaneJoin)); 