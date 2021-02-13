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
                            {/* <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" to="#">
                                    <i className="bx bx-customize mr-2"/>{props.t('Apps')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu")}>
                                    <Link to="/pools" className="dropdown-item">{props.t('Pools')}</Link>
                                    <Link to="/earn" className="dropdown-item">{props.t('Earn')}</Link>
                                    <Link to="/lock" className="dropdown-item">{props.t('Deposit & Mint')}</Link>
                                   
                                    
                                    <Link to="/share" className="dropdown-item">{props.t('Shares')}</Link>
                                    <Link to="/dao" className="dropdown-item">{props.t('Dao')}</Link>
                                    <Link to="/swap" className="dropdown-item">{props.t('Swap')}</Link>
                                   
                                </div>
                            </li> */}
                            <li className="nav-item dropdown">
                                <Link to="#" className="nav-link dropdown-toggle arrow-none" >
                                    <i className="bx bx-swim mr-2 align-middle"/>{props.t('Pools')}<div className="arrow-down ml-1 align-middle"></div>
                                </Link>
                                <div className={classname("dropdown-menu")}>
                                    <Link to="/pools" className="dropdown-item"><i className="bx bx-swim mr-1"/>{props.t('Pools')}</Link>
                                    <Link to="/positions" className="dropdown-item"><i className='mr-1 bx bx-trending-up' />Positions</Link>
                                </div>

                            </li>
                            <li className="nav-item dropdown">
                                <Link to="#" className="nav-link dropdown-toggle arrow-none" >
                                    <i className="bx bx-group mr-2 align-middle"/>{props.t('DAO')}<div className="arrow-down ml-1 align-middle"></div>
                                </Link>
                                <div className={classname("dropdown-menu")}>
                                    <Link to="/dao/lock" className="dropdown-item"><i className='mr-1 bx bx-lock' />{props.t('Lock+Earn')}</Link>
                                    <Link to="/dao/proposals" className="dropdown-item"><i className='mr-1 bx bx-pin' />{props.t('Propose')}</Link>
                                </div>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <Link to="/positions" className="nav-link dropdown-toggle arrow-none"><i className="bx bx-swim mr-2 align-middle"/>Positions</Link>
                            </li> */}
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" to="#">
                                    <i className="bx bx-info-circle mr-2 align-middle"/>{props.t('Info')}<div className="arrow-down ml-1 align-middle"></div>
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
                                    <a className="dropdown-item" target="_blank" href="https://t.me/SpartanProtocolOrg" rel="noopener noreferrer">
                                        <span>Telegram</span>
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
