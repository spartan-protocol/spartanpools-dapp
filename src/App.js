import React from "react";
import Layout from "./components/Layout";
import "./assets/scss/app-dark.scss";
import Pools from './pages/Pools.js'
import Shares from './pages/Shares'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import AddLiquidity from './pages/AddLiquidity'
import Swap from './pages/Swap'
import CreatePool from './pages/CreatePool'
//import Earn from './pages/Earn'
import {ContextProvider} from './context'
import PagesStarter from "./pages/Utility/pages-starter";
import PagesFaqs from "./pages/Utility/pages-faqs";

const App = () => {
    return (
        <Router>
            <ContextProvider>
                <Layout/>
                    <div className="wrapper">
                        <Switch>
                            <Route path="/" exact component={Pools}/>
                            <Route path="/pools" exact component={Pools}/>
                            <Route path="/share" exact component={Shares}/>
                            <Route path="/pool/stake" exact component={AddLiquidity}/>
                            <Route path="/pool/swap" exact component={Swap}/>
                            <Route path="/pool/create" exact component={CreatePool}/>
                            {/* <Route path="/dao" exact component={Dao} />
                            <Route path="/earn" exact component={Earn} />*/}

                            {/*Help*/}
                            <Route path="/start" exact component={PagesStarter}/>
                            <Route path="/faq" exact component={PagesFaqs}/>
                        </Switch>
                    </div>
            </ContextProvider>
        </Router>
    );
};

export default App;
