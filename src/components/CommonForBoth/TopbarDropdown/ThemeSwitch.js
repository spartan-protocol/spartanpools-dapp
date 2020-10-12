import React, {useState, useContext} from "react";


import {withNamespaces} from 'react-i18next';
import FormGroup from "reactstrap/es/FormGroup";
import CustomInput from "reactstrap/es/CustomInput";


import {Context} from '../../../context'
import usFlag from "../../../assets/images/flags/united-states.png";
import china from "../../../assets/images/flags/china.png";
import russia from "../../../assets/images/flags/russia.png";
import turkey from "../../../assets/images/flags/turkey.png";
import vietnam from "../../../assets/images/flags/vietnam.png";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import Dropdown from "antd/es/dropdown";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import DropdownItem from "reactstrap/es/DropdownItem";
import BootstrapSwitchButton from "bootstrap-switch-button-react/lib/bootstrap-switch-button-react";


const ThemeSwitch = (props) => {

    const context = useContext(Context);

    let theme = localStorage.getItem("thememode");
    theme = theme || "light";
    const [switchValue, setSwitch] = useState(theme === "light")

    function toggleTheme() {
        theme = switchValue ? "dark" : "light"
        setSwitch(!switchValue)
        localStorage.setItem("thememode", theme)
        context.setContext({'thememode': theme})
        document.documentElement.setAttribute('data-theme', theme);

    }

    return (
        <React.Fragment>
            <div className="d-inline-block">
                <div
                    className="btn header-item waves-effect"
                    tag="button"
                >
                    <img

                    />
                    <span className="align-middle">
                        <FormGroup>
                            <CustomInput
                                label={theme}
                                type="switch"
                                id="CustomSwitch"
                                name="customSwitch"
                                onChange={toggleTheme}/>

                    </FormGroup>
                    </span>
                </div>

            </div>
        </React.Fragment>

    );
}

export default withNamespaces()(ThemeSwitch);
