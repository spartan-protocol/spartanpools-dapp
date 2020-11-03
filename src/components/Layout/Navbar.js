import React from "react";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withNamespaces } from 'react-i18next';

const Navbar = (props) => {

    return (
        <React.Fragment>
            <div className="topnav d-none d-lg-block">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" to="#">
                                    <i className="bx bx-customize mr-2"/>{props.t('Apps')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu")}>
                                    <Link to="/pools" className="dropdown-item">{props.t('Pools')}</Link>
                                    
                                    <Link to="/earn" className="dropdown-item">{props.t('Earn')}</Link>
                                   
                                    {/*
                                    <Link to="/share" className="dropdown-item">{props.t('Shares')}</Link>
                                    <Link to="/dao" className="dropdown-item">{props.t('Dao')}</Link>
                                    <Link to="/swap" className="dropdown-item">{props.t('Swap')}</Link>
                                    */}
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" to="#">
                                    <i className="bx bx-info-circle mr-2"/>{props.t('Info')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu")}>
                                    <Link to="/faq" className="dropdown-item">{props.t('FAQ')}</Link>
                                    <a className="dropdown-item" target="_blank" href="https://github.com/spartan-protocol" rel="noopener noreferrer">
                                        <span>GitHub</span>
                                    </a>
                                    <a className="dropdown-item" target="_blank" href="https://medium.com/spartanprotocol" rel="noopener noreferrer">
                                        <span>Medium</span>
                                    </a>
                                    <a className="dropdown-item" target="_blank" href="https://twitter.com/SpartanProtocol" rel="noopener noreferrer">
                                        <span>Twitter</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(withNamespaces()(Navbar));
