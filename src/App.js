import React from "react";
import "./assets/scss/app-dark.scss";
import "./assets/scss/custom/styles.css"

import {ContextProvider} from './context'
import Base from './Base'

const App = () => {
    return (
            <ContextProvider>
                <Base/>
            </ContextProvider>
    );
};

export default App;
