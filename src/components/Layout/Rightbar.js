import React, { useContext, useState } from 'react';
import { Context } from '../../context'
import classnames from 'classnames';

import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table, Progress } from "reactstrap";

import {convertFromWei, formatAllUnits} from '../../utils'

import { manageBodyClass } from '../common';

import { TokenIcon } from '../Common/TokenIcon'

import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../assets/scss/custom/components/_rightbar.scss";
import BigNumber from 'bignumber.js';

const RightSidebar = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const context = useContext(Context);

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  /**
  * Toggles the sidebar
  */
 const toggleRightbar = (cssClass) => {
   manageBodyClass("right-bar-enabled");
  }

  return (
    <React.Fragment>
      <div className="right-bar dark-bg">

      <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-4 pt-4">
              <Link to="#" onClick={toggleRightbar} className="right-bar-toggle float-right">
                <i className="mdi mdi-close noti-icon"/>
              </Link>
              <h5 className="m-0">Wallet</h5>
              {context.account !== undefined &&
                <a target="_blank" href={"https://bscscan.com/address/" + context.account} rel="noopener noreferrer"><p>View on BSC Scan</p></a>
              }
            </div>

              <div className="px-4 pt-2">
              <div className="radio-toolbar">
                <Nav  className="nav nav-pills nav-fill bg-light rounded" role="tablist">
                  <NavItem className="text-center w-50">
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => { toggle('1'); }}
                    >
                    Assets
                    </NavLink>
                  </NavItem>
                  
                  <NavItem className="text-center w-50">
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => { toggle('2'); }}
                      >
                      LP Shares
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <AssetTable 
                          walletDataCompleted={props.walletDataCompleted}
                          walletDataLoading={props.walletDataLoading}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <PoolShareTable toggleRightbar={toggleRightbar}/>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
          </SimpleBar>
      </div>
      <div className="rightbar-overlay" onClick={toggleRightbar}></div>
    </React.Fragment>
  );
}

export const AssetTable = () => {

  const context = useContext(Context)

  //useEffect(() => {
      // updateWallet()
      // eslint-disable-next-line
  //}, [])

  // const updateWallet = async () => {
  //     context.setContext({ walletData: await getWalletData(context.poolArray) })
  // }

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.walletData &&
              <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
            }
            {context.walletData &&
              <Table className="text-center">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {context.walletData.filter(x => x.balance > 0).sort((a, b) => (parseFloat(a.balance) > parseFloat(b.balance)) ? -1 : 1).map(c =>
                    <AssetItem 
                      key={c.address}
                      symbol={c.symbol}
                      address={c.address}
                      balance={c.balance}
                    />
                  )}
                  <tr>
                    <td colSpan="5">
                      {context.walletDataLoading === true &&
                          <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                      }
                      {context.walletDataLoading !== true && context.walletDataComplete === true &&
                          <div className="text-center m-2">All Assets Loaded</div>
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
            }
          </Col>
        </Row>
      </div>
    </>
  )
}

export const AssetItem = (props) => {

  return (
    <>
      <tr>
        <td>
          <TokenIcon address={props.address}/>
        </td>
        <td>
          <h5>{formatAllUnits(convertFromWei(props.balance))}</h5>
          <h6>{props.symbol}</h6>
        </td>
      </tr>
    </>
  )

}

export const PoolShareTable = () => {

  const context = useContext(Context)

  //useEffect(() => {
    //console.log(context.sharesData)
    // getPoolSharess()
    // console.log(context.stakes)
    // eslint-disable-next-line
  //}, [])

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.sharesData &&
              <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
            }
            {context.sharesData &&
              <Table className="text-center">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                      {context.sharesData.filter(x => (x.units + x.locked) > 0).sort((a, b) => (parseFloat(a.units + a.locked) > parseFloat(b.units + b.locked)) ? -1 : 1).map(c =>
                        <PoolItem 
                          key={c.address}
                          symbol={c.symbol}
                          address={c.address}
                          units={c.units}
                          locked={c.locked}
                        />
                      )}
                      <tr>
                          <td colSpan="5">
                              {context.sharesDataLoading === true &&
                                  <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                              }
                              {context.sharesDataLoading !== true && context.sharesDataComplete === true &&
                                  <div className="text-center m-2">All LP Tokens Loaded</div>
                              }
                          </td>
                      </tr>
                </tbody>
              </Table>
            }
          </Col>
        </Row>
      </div>
    </>
  )
}

export const PoolItem = (props) => {

const units = new BigNumber(props.units)
const locked = new BigNumber(props.locked)
const total = units.plus(locked)
const lockedPC = locked.dividedBy(total).times(100).toFixed(0)

  return (
    <>
      <tr>
        <td className="align-middle">
          <TokenIcon className="m-1" address={props.address}/>
        </td>
        <td className="align-middle">
          <h6 className='m-2'>{props.symbol}</h6>
          <h5 className='m-2'>{formatAllUnits(convertFromWei(total))}</h5>
          <p className='d-inline-block w-50'>Locked: </p>
          <div className='d-inline-block w-50'>
            <Progress multi className="m-1">
              <Progress bar color="success" value={convertFromWei(locked).toFixed(2)} max={convertFromWei(total).toFixed(2)}>{lockedPC <= 0 && "0%"}{lockedPC > 0 && lockedPC + " %"}</Progress>
              <Progress bar color="danger" value={convertFromWei(units).toFixed(2)} max={convertFromWei(total).toFixed(2)}></Progress>
            </Progress>
          </div>
        </td>
      </tr>
    </>
  )

}

export default RightSidebar;
