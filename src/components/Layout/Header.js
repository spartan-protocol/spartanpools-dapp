import React from "react";

import { Link } from "react-router-dom";

// Import menuDropdown
import LanguageDropdown from "../Common/LanguageDropdown";

import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/icon-light.png";

//i18n
import { withNamespaces } from 'react-i18next';

import { Row, Col, Container } from 'reactstrap';

//import components
import AddressConn from '../Common/AddressConn';
import ThemeSwitch from "../Common/ThemeSwitch";

const Header = (props) => {

  return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">

            <Container style={{maxWidth:'100%'}}>
              <Row className="align-items-center">

                <Col xs={7} className="px-1 text-left">
                  <Link to="/" className="logo d-block d-sm-none float-left mx-1">
                    <img src={logoLightSvg} alt="" height="40" />
                  </Link>
                  <Link to="/" className="logo d-none d-sm-block float-left mx-1">
                    <img src={logoLight} alt="" height="55" />
                  </Link>
                  <button
                      type="button"
                      className="btn btn-sm font-size-16 d-lg-none header-item waves-effect waves-light float-left mx-1"
                      onClick={props.toggleNav}
                  >
                    <i className="fa fa-fw fa-bars"></i>
                  </button>
                  <ThemeSwitch />
                </Col>

                <Col xs={5} className="px-1 text-right">
                  <LanguageDropdown/>
                  <AddressConn 
                    changeStates={props.changeStates}
                    changeNotification={props.changeNotification}
                    connectedTokens={props.connectedTokens}
                    connectingTokens={props.connectingTokens}
                  />
                </Col>

              </Row>
            </Container>

          </div>
        </header>
      </React.Fragment>
  );
}

export default (withNamespaces()(Header));