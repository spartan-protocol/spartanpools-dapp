import React from "react";

import { Link } from "react-router-dom";

// reactstrap
import { Row, Col, DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";

import logo from "../../assets/images/logo-sm-light.png";
import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/icon-light.png";
import logoDark from "../../assets/images/logo-dark.png";

// import images
import github from "../../assets/images/brands/github.png";
import twitter from "../../assets/images/brands/twitter.png";
import medium from "../../assets/images/brands/medium.png";

//i18n
import { withNamespaces } from 'react-i18next';

//import components
import AddressConn from '../CommonForBoth/AddressConn';
//import ThemeSwitch from "../CommonForBoth/TopbarDropdown/ThemeSwitch";

const Header = (props) => {

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="30" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="17" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="40" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="55" />
                </span>
              </Link>
            </div>

          {/*
           <ThemeSwitch/>
          */}

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
              onClick={props.toggleNav}
              >
              <i className="fa fa-fw fa-bars"></i>
            </button>
          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ml-2">
            </div>

            <LanguageDropdown />

            <UncontrolledDropdown className="d-none d-lg-inline-block ml-1">
              <DropdownToggle className="btn header-item noti-icon waves-effect" caret tag="button">
                <i className="bx bx-customize"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg" right>
                <div className="px-lg-2">
                  <Row className="no-gutters">
                    <Col>
                      <a className="dropdown-icon-item" target="_blank" href="https://github.com/spartan-protocol" rel="noopener noreferrer">
                        <img src={github} alt="Github" />
                        <span>GitHub</span>
                      </a>
                    </Col>
                    <Col>
                      <a className="dropdown-icon-item" target="_blank" href="https://medium.com/spartanprotocol" rel="noopener noreferrer">
                        <img src={medium} alt="Medium" />
                        <span>Medium</span>
                      </a>
                    </Col>
                    <Col>
                      <a className="dropdown-icon-item" target="_blank" href="https://twitter.com/SpartanProtocol" rel="noopener noreferrer">
                        <img src={twitter} alt="Twitter" />
                        <span>Twitter</span>
                      </a>
                    </Col>
                  </Row>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>


            <div className="dropdown d-none d-lg-inline-block ml-1">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                onClick={toggleFullscreen}
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen"></i>
              </button>
            </div>

            <NotificationDropdown />

            <div>
                <AddressConn />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export default (withNamespaces()(Header));
