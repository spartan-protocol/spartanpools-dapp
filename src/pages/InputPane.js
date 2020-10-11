import {convertFromWei} from "../utils";
import React from "react";
import {PercentButtonRow} from "../components/common";

import {withNamespaces} from "react-i18next";

import {
    Input,
    Label,
    InputGroup,
    InputGroupAddon,

} from "reactstrap";
import withRouter from "react-router-dom/es/withRouter";

export const InputPane = (props) => {

    return (
        <div>
            <div>
                <p className="text-muted mb-2">
                    <i className="bx bx-wallet mr-1" />
                    {props.t("Wallet Balance")}
                </p>
                <h5>{convertFromWei(props.paneData?.balance)} {props.paneData?.symbol}</h5>
                <br/>
                <Label>{props.t("Add Amount :")}</Label>
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                        <Label className="input-group-text">{props.t("Total")}</Label>
                    </InputGroupAddon>
                    <Input type="text" className="form-control" onChange={props.onInputChange}
                           placeholder={convertFromWei(props.paneData?.input)}
                           size={'large'}
                        // defaultValue={convertFromWei(props.paneData?.input)}
                           allowClear={true}
                        // addonAfter={<TokenDropDown default={props.paneData?.address}
                        //   changeToken={props.changeToken}
                        //   tokenList={props.tokenList} />}
                    ></Input>
                </InputGroup>
            </div>
            <br/>
            <PercentButtonRow changeAmount={props.changeAmount}/>
            <br/>
        </div>
    )
};

export default withRouter(withNamespaces()(InputPane));