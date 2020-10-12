import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

//i18n
import i18n from '../../../i18n';
import { withNamespaces } from 'react-i18next';
import FormGroup from "reactstrap/es/FormGroup";
import CustomInput from "reactstrap/es/CustomInput";



const ThemeSwitch = (props) => {

    function toggleTheme() {
        // Obtains an array of all <link>
        // elements.
        // Select your element using indexing.
        var theme = document.getElementsByTagName('page-topbar')[0];
    }



    return (
    <React.Fragment>
        <form className="app-search">
            <div >
                <div >
                    <FormGroup>
                        <CustomInput type="switch" id="CustomSwitch"
                                     name="customSwitch"
                                     label="Lightmode"
                                     onChange={toggleTheme}/>
                    </FormGroup>
                </div>
            </div>
        </form>
    </React.Fragment>
  );
}

export default withNamespaces()(ThemeSwitch);
