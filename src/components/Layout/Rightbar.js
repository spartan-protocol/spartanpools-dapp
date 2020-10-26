import React, { useContext, useState } from 'react';
import { Context } from '../../context'
import classnames from 'classnames';

import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table } from "reactstrap";

import {convertFromWei, formatAllUnits} from '../../utils'
import {checkArrayComplete, getNextPoolSharesData, getNextWalletData} from '../../client/web3'

import { manageBodyClass } from '../common';

import { TokenIcon } from '../Common/TokenIcon'

import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../assets/scss/custom/components/_rightbar.scss";
import BigNumber from 'bignumber.js';

const RightSidebar = (props) => {
  const [activeTab, setActiveTab] = useState('1');

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
            <div className="rightbar-title px-3 py-4">
              <Link to="#" onClick={toggleRightbar} className="right-bar-toggle float-right">
                <i className="mdi mdi-close noti-icon"></i>
              </Link>
              <h5 className="m-0">Wallet</h5>
            </div>

              <div className="p-4">
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
                          handleNextWalletDataPage={props.handleNextWalletDataPage}
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

  const nextWalletDataPage = async () => {
    var lastPage = await checkArrayComplete(context.tokenArray, context.walletData)
    context.setContext({'walletDataLoading': true})
    context.setContext({'walletData': await getNextWalletData(context.account, context.tokenArray, context.walletData)})
    context.setContext({'walletDataLoading': false})
    context.setContext({'walletDataComplete': lastPage})
  }

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
                      {!context.walletDataLoading && !context.walletDataComplete &&
                          <button color="primary"
                          className="btn btn-primary waves-effect waves-light m-1"
                          onClick={()=>nextWalletDataPage()}
                          >
                          Load More
                          </button>
                      }
                      {context.walletDataLoading &&
                          <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                      }
                      {!context.walletDataLoading && context.walletDataComplete &&
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

  const nextPoolSharesDataPage = async () => {
    var lastPage = await checkArrayComplete(context.tokenArray, context.stakesData)
    context.setContext({'poolSharesDataLoading': true})
    context.setContext({'stakesData': await getNextPoolSharesData(context.account, context.tokenArray, context.stakesData)})
    context.setContext({'poolSharesDataLoading': false})
    context.setContext({'poolSharesDataComplete': lastPage})
    console.log(context.stakesData)
  }

  //useEffect(() => {
    //console.log(context.stakesData)
    // getPoolSharess()
    // console.log(context.stakes)
    // eslint-disable-next-line
  //}, [])

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.stakesData &&
              <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
            }
            {context.stakesData &&
              <Table className="text-center">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                      {context.stakesData.filter(x => (x.units + x.locked) > 0).sort((a, b) => (parseFloat(a.units + a.locked) > parseFloat(b.units + b.locked)) ? -1 : 1).map(c =>
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
                              {!context.poolSharesDataLoading && !context.poolSharesDataComplete &&
                                  <button color="primary"
                                  className="btn btn-primary waves-effect waves-light m-1"
                                  onClick={()=>nextPoolSharesDataPage()}
                                  >
                                  Load More
                                  </button>
                              }
                              {context.poolSharesDataLoading &&
                                  <div className="text-center m-2"><i className="bx bx-spin bx-loader"/></div>
                              }
                              {!context.poolSharesDataLoading && context.poolSharesDataComplete &&
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

  return (
    <>
      <tr>
        <td className="align-middle">
          <TokenIcon className="m-1" address={props.address}/>
        </td>
        <td className="align-middle">
          <h5 className="m-1">{formatAllUnits(convertFromWei(total))}</h5>
          <h6 className="m-1">{props.symbol}</h6>
        </td>
      </tr>
    </>
  )

}

export default RightSidebar;
