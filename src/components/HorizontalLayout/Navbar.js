import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withNamespaces } from 'react-i18next';

const Navbar = (props) => {

    const [isDropdown1,setIsDropdown1] = useState('false')
    const [isDropdown2,setIsDropdown2] = useState('false')

    const toggleDropdown1 = () => {
        setIsDropdown1(!isDropdown1);
        setIsDropdown2('false');
    }

    const toggleDropdown2 = () => {
        setIsDropdown2(!isDropdown2);
        setIsDropdown1('false');
    }

    const closeDropdowns = () => {
        setIsDropdown2('false');
        setIsDropdown1('false');
    }

    return (
        <React.Fragment>
            <div className="topnav">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" onClick={toggleDropdown1} to="#">
                                    <i className="bx bx-customize mr-2"></i>{props.t('Apps')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu", { show: !isDropdown1 })}>
                                    <Link to="/pools" className="dropdown-item" onClick={closeDropdowns}>{props.t('Pools')}</Link>
                                    {/*
                                    <Link to="/share" className="dropdown-item" onClick={closeDropdowns}>{props.t('Shares')}</Link>
                                    <Link to="/dao" className="dropdown-item" onClick={closeDropdowns}>{props.t('Dao')}</Link>
                                    <Link to="/earn" className="dropdown-item" onClick={closeDropdowns}>{props.t('Earn')}</Link>
                                    <Link to="/swap" className="dropdown-item" onClick={closeDropdowns}>{props.t('Swap')}</Link>
                                    */}
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" onClick={toggleDropdown2} to="#">
                                    <i className="bx bx-info-circle mr-2"></i>{props.t('Info')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu", { show: !isDropdown2  })}>
                                    {/*<Link to="start" className="dropdown-item">{props.t('How to start?')}</Link>*/}
                                    <Link to="/faq" className="dropdown-item" onClick={closeDropdowns}>{props.t('FAQ')}</Link>
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
