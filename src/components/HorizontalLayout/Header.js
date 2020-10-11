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
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

//i18n
import { withNamespaces } from 'react-i18next';

//import components
import AddressConn from '../CommonForBoth/AddressConn';
//import ThemeSwitch from "../CommonForBoth/TopbarDropdown/ThemeSwitch";

const Header = (props) => {

  /**
   * Toggle navbar
   */
  const toggleMenu = () => {
    props.openLeftMenuCallBack();
  }

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
              onClick={toggleMenu}
              >
              <i className="fa fa-fw fa-bars"></i>
            </button>
          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ml-2">
            </div>

            <LanguageDropdown />

            <div clacustom-control custom-switch mb-3>
            </div>

            <UncontrolledDropdown className="d-none d-lg-inline-block ml-1">
              <DropdownToggle className="btn header-item noti-icon waves-effect" caret tag="button">
                <i className="bx bx-customize"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg" right>
                <div className="px-lg-2">
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={github} alt="Github" />
                        <span>GitHub</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={bitbucket} alt="bitbucket" />
                        <span>Bitbucket</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={dribbble} alt="dribbble" />
                        <span>Dribbble</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={dropbox} alt="dropbox" />
                        <span>Dropbox</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={mail_chimp} alt="mail_chimp" />
                        <span>Mail Chimp</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={slack} alt="slack" />
                        <span>Slack</span>
                      </Link>
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

            <div className="dropdown d-inline-block">
              <button type="button" className="btn header-item waves-effect">
                <AddressConn />
              </button>

            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export default (withNamespaces()(Header));
