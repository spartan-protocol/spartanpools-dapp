import React, {useState, useContext} from "react";

import {withNamespaces} from 'react-i18next';
import FormGroup from "reactstrap/es/FormGroup";
import CustomInput from "reactstrap/es/CustomInput";

import {Context} from '../../context'

const ThemeSwitch = (props) => {

    const context = useContext(Context);

    let theme = localStorage.getItem("thememode");
    theme = theme || "dark";
    const [switchValue, setSwitch] = useState("dark")

    function toggleTheme() {
        theme = switchValue ? "light" : "dark"
        setSwitch(!switchValue)
        localStorage.setItem("thememode", theme)
        context.setContext({'thememode': theme})
        document.documentElement.setAttribute('data-theme', theme);
    }

    return (
        <React.Fragment>
                <div
                    className="d-flex justify-content-center align-items-center header-item waves-effect"
                    tag="button"
                >
                    <FormGroup className="m-0">
                        <CustomInput
                            label={<i className="bx bx-sun"></i>}
                            type="switch"
                            id="CustomSwitch"
                            name="customSwitch"
                            onChange={toggleTheme}
                            className="btn"
                        />
                    </FormGroup>
                </div>
        </React.Fragment>

    );
}

export default withNamespaces()(ThemeSwitch);
