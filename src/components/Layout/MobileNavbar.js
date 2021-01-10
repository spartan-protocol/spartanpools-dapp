import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withNamespaces } from 'react-i18next';

const MobileNavbar = (props) => {

    const [isDropdown1,setIsDropdown1] = useState(false)
    const [isDropdown2,setIsDropdown2] = useState(false)

    const toggleDropdown1 = () => {
        setIsDropdown1(!isDropdown1)
        setIsDropdown2(false)
    }

    const toggleDropdown2 = () => {
        setIsDropdown2(!isDropdown2)
        setIsDropdown1(false)
    }

    const closeDropdowns = () => {
        props.setNavIsOpen(false)
        setIsDropdown2(false)
        setIsDropdown1(false)
    }

    return (
        <React.Fragment>
            <div className="topnav d-block d-lg-none">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown" onClick={()=>closeDropdowns()}>
                                <Link to="/pools" className="nav-link dropdown-toggle arrow-none"><i className="bx bx-swim mr-2 align-middle"/>{props.t('Pools')}</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" onClick={()=>toggleDropdown1()} to="#">
                                    <i className="bx bx-group mr-2 align-middle"/>{props.t('DAO')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu", { show: isDropdown1  })}>
                                    <Link to="/dao/lock" className="dropdown-item" onClick={()=>closeDropdowns()}><i className='mr-1 bx bx-lock' />{props.t('Lock+Earn')}</Link>
                                    <Link to="/dao/proposals" className="dropdown-item" onClick={()=>closeDropdowns()}><i className='mr-1 bx bx-pin' />{props.t('Proposals')}</Link>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle arrow-none" onClick={()=>toggleDropdown2()} to="#">
                                    <i className="bx bx-info-circle mr-2 align-middle"/>{props.t('Info')} <div className="arrow-down ml-2"></div>
                                </Link>
                                <div className={classname("dropdown-menu", { show: isDropdown2  })}>
                                    <Link to="/faq" className="dropdown-item" onClick={()=>closeDropdowns()}>{props.t('FAQ')}</Link>
                                    <a className="dropdown-item" target="_blank" href="https://github.com/spartan-protocol" rel="noopener noreferrer" onClick={()=>closeDropdowns()}>
                                        <span>GitHub</span>
                                    </a>
                                    <a className="dropdown-item" target="_blank" href="https://medium.com/spartanprotocol" rel="noopener noreferrer" onClick={()=>closeDropdowns()}>
                                        <span>Medium</span>
                                    </a>
                                    <a className="dropdown-item" target="_blank" href="https://twitter.com/SpartanProtocol" rel="noopener noreferrer" onClick={()=>closeDropdowns()}>
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

export default withRouter(withNamespaces()(MobileNavbar));
