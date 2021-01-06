import React, {useContext, useState, useEffect} from "react";

import { Link } from "react-router-dom";
import {Context} from "../../context";

// Import menuDropdown
import LanguageDropdown from "../Common/LanguageDropdown";

import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/icon-light.png";

//i18n
import { withNamespaces } from 'react-i18next';

import { Row, Col, Container, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//import components
import AddressConn from '../Common/AddressConn';
import ThemeSwitch from "../Common/ThemeSwitch";
import { convertFromWei, formatAllUnits, formatGranularUnits, bn } from "../../utils";
import { getSpartaContract, SPARTA_ADDR, UTILS_ADDR, DAO_ADDR, ROUTER_ADDR, BONDv2_ADDR, BONDv3_ADDR } from "../../client/web3";

const Header = (props) => {

  const context = useContext(Context)

  const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    getTotalSupply()
    // eslint-disable-next-line
  }, [])

  const [totalSupply, setTotalSupply] = useState('')
  const getTotalSupply = async () => {
    const contract = getSpartaContract()
    let supply = await contract.methods.totalSupply().call()
    setTotalSupply(supply)
    await pause(5000)
    getTotalSupply()
  }

  return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">

            <Container style={{maxWidth:'100%'}}>
              <Row className="align-items-center">

                <Col xs={6} className="px-1 text-left">
                  <Link to="/" className="logo d-block d-md-none float-left mx-1">
                    <img src={logoLightSvg} alt="" height="40" />
                  </Link>
                  <Link to="/" className="logo d-none d-md-block float-left mx-1">
                    <img src={logoLight} alt="" height="55" />
                  </Link>
                  <button
                      type="button"
                      className="btn btn-sm font-size-16 d-lg-none header-item waves-effect waves-light float-left mx-1"
                      onClick={props.toggleNav}
                  >
                    <i className="fa fa-fw fa-bars"/>
                  </button>
                  <ThemeSwitch />
                </Col>

                <Col xs={6} className="px-1 text-right">
                  {context.spartanPrice &&
                    <UncontrolledDropdown className='d-none d-sm-inline mr-3 h-100'>
                      <DropdownToggle className='bg-light border-0' caret>
                        <img src='./logo192.png' alt="" height='28px' /><h5 className='d-inline block ml-2 align-middle'>${formatGranularUnits(context.spartanPrice)}</h5>
                      </DropdownToggle>
                      <DropdownMenu className='mt-3'>
                        <DropdownItem disabled><i className='bx bx-coin text-success mr-1' />Total Supply: {formatAllUnits(convertFromWei(totalSupply))}</DropdownItem>
                        {/*<DropdownItem disabled><i className='bx bx-refresh text-success mr-1' />Circulating: *TBA*</DropdownItem>*/}
                        <DropdownItem disabled><i className='bx bx-coin-stack text-success mr-1' />Supply Cap: 300,000,000</DropdownItem>
                        <DropdownItem disabled><i className='bx bxs-badge-dollar text-success mr-1' />Market Cap: ${formatAllUnits(convertFromWei(bn(totalSupply).times(context.spartanPrice)))} </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem disabled><div className='text-center'><i className='bx bx-edit text-success mr-1' />Contracts</div></DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + SPARTA_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>SPARTA</div></a>
                          <a href={'https://bscscan.com/address/' + UTILS_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>UTILS</div></a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + DAO_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>DAO</div></a>
                          <a href={'https://bscscan.com/address/' + ROUTER_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>ROUTER</div></a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + BONDv2_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>BONDv2</div></a>
                          <a href={'https://bscscan.com/address/' + BONDv3_ADDR + '#readContract'} target='blank' className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>BONDv3</div></a>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  }
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