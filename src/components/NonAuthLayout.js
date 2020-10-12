import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";

const NonAuthLayout = (props) => {
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    useEffect(() => {
        let currentage = capitalizeFirstLetter(props.location.pathname);

        document.title =
          currentage + " | Spartan - Protocol";
    },[])

    return <React.Fragment>
        {props.children}
    </React.Fragment>;
}

export default (withRouter(NonAuthLayout));