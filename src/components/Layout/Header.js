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
import { getSpartaContract, SPARTA_ADDR, UTILS_ADDR, DAO_ADDR, ROUTER_ADDR, BONDv2_ADDR, BONDv3_ADDR, getTokenContract } from "../../client/web3";

const Header = (props) => {

  const context = useContext(Context)

  const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    getTotalSupply()
    // eslint-disable-next-line
  }, [])

  const [totalSupply, setTotalSupply] = useState('')
  const [circSupply, setCircSupply] = useState('')
  const getTotalSupply = async () => {
    let contract = getSpartaContract()
    contract = contract.methods
    let data = await Promise.all([contract.totalSupply().call(), contract.balanceOf(BONDv3_ADDR).call(), contract.balanceOf(DAO_ADDR).call(), contract.balanceOf(ROUTER_ADDR).call()])
    setTotalSupply(data[0])
    let removeSupply = bn(data[1]).plus(bn(data[2])).plus(bn(data[3]))
    let removeSupplyA = await getLockedBondLP()
    setCircSupply(bn(data[0]).minus(bn(removeSupply)).minus(bn(removeSupplyA)))
    await pause(5000)
    getTotalSupply()
  }

  const getLockedBondLP = async () => {
    // BNB:SPARTA Sum
    let address = '0x3de669c4f1f167a8afbc9993e4753b84b576426f'
    let bondV1ADDR = '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
    let spartaContract = getSpartaContract()
    spartaContract = spartaContract.methods
    let contract = getTokenContract(address)
    contract = contract.methods
    let data = await Promise.all([contract.balanceOf(bondV1ADDR).call(), contract.balanceOf(BONDv2_ADDR).call(), contract.balanceOf(BONDv3_ADDR).call(), contract.totalSupply().call(), spartaContract.balanceOf(address).call()])
    let lockedSparta = ((bn(data[0]).plus(bn(data[1])).plus(bn(data[2]))).div(bn(data[3]))).times(data[4])

    // BUSD:SPARTA Sum
    address = '0xbf6728454b96a36c720c1bbcae5773aaafd6959b'
    contract = getTokenContract(address)
    contract = contract.methods
    data = await Promise.all([contract.balanceOf(BONDv3_ADDR).call(), contract.totalSupply().call(), spartaContract.balanceOf(address).call()])
    lockedSparta = (((bn(data[0]))).div(bn(data[1])).times(data[2])).plus(bn(lockedSparta))

    // USDT:SPARTA Sum
    address = '0x2720ec9809f77e040d4682cf9f7294276b9ccc56'
    contract = getTokenContract(address)
    contract = contract.methods
    data = await Promise.all([contract.balanceOf(BONDv3_ADDR).call(), contract.totalSupply().call(), spartaContract.balanceOf(address).call()])
    lockedSparta = (((bn(data[0]))).div(bn(data[1])).times(data[2])).plus(bn(lockedSparta))
    
    // BTCB:SPARTA Sum
    address = '0x86320acc1169e5a61a8b365aaba0f8ebadc872e0'
    contract = getTokenContract(address)
    contract = contract.methods
    data = await Promise.all([contract.balanceOf(BONDv3_ADDR).call(), contract.totalSupply().call(), spartaContract.balanceOf(address).call()])
    lockedSparta = (((bn(data[0]))).div(bn(data[1])).times(data[2])).plus(bn(lockedSparta))

    // ETH:SPARTA Sum
    address = '0x119c70f4605e07e4bb229e2360e203a1bbd52ce4'
    contract = getTokenContract(address)
    contract = contract.methods
    data = await Promise.all([contract.balanceOf(BONDv3_ADDR).call(), contract.totalSupply().call(), spartaContract.balanceOf(address).call()])
    lockedSparta = (((bn(data[0]))).div(bn(data[1])).times(data[2])).plus(bn(lockedSparta))

    //console.log(convertFromWei(lockedSparta).toFixed(0))
    return lockedSparta
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
                        <img src='/logo192.png' alt="" height='28px' /><h5 className='d-inline block ml-2 align-middle'>${formatGranularUnits(context.spartanPrice)}</h5>
                      </DropdownToggle>
                      <DropdownMenu className='mt-3'>
                        <DropdownItem disabled><i className='bx bx-coin text-success mr-1' />Total Supply: {formatAllUnits(convertFromWei(totalSupply))}</DropdownItem>
                        <DropdownItem disabled><i className='bx bx-refresh text-success mr-1' />Circulating: {formatAllUnits(convertFromWei(circSupply))}</DropdownItem>
                        <DropdownItem disabled><i className='bx bx-coin-stack text-success mr-1' />Max Supply: 300,000,000</DropdownItem>
                        <DropdownItem disabled><i className='bx bxs-badge-dollar text-success mr-1' />Market Cap: ${formatAllUnits(convertFromWei(bn(circSupply).times(context.spartanPrice)))} </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem disabled><div className='text-center'><i className='bx bx-edit text-success mr-1' />Contracts</div></DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + SPARTA_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>SPARTA</div></a>
                          <a href={'https://bscscan.com/address/' + UTILS_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>UTILS</div></a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + DAO_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>DAO</div></a>
                          <a href={'https://bscscan.com/address/' + ROUTER_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>ROUTER</div></a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href={'https://bscscan.com/address/' + BONDv2_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary mr-1 rounded'>BONDv2</div></a>
                          <a href={'https://bscscan.com/address/' + BONDv3_ADDR + '#readContract'} target='_blank' rel="noopener noreferrer" className='text-light'><div className='w-50 d-inline-block text-center bg-secondary rounded'>BONDv3</div></a>
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
