import React, {useState, useContext} from "react";

import {withNamespaces} from 'react-i18next';

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
                <div className="btn-darktoggle d-inline-block ml-2" onClick={toggleTheme}>
                    <i className="bx bx-moon float-left dark-icon"/>
                    <i className="bx bx-sun float-right light-icon"/>
                </div>
        </React.Fragment>

    );
}

export default withNamespaces()(ThemeSwitch);
