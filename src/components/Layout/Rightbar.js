import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../context'
import { Progress, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table, Tooltip } from "reactstrap";
import classnames from 'classnames';

import {LoadingOutlined} from '@ant-design/icons';

import { connect } from "react-redux";
import { hideRightSidebar } from "../../store/actions";

import {getNextPoolSharesData, getNextTokenDetails, getWalletData} from '../../client/web3'

import {convertFromWei, formatAllUnits} from '../../utils'

import { manageBodyClass } from '../common';

import { TokenIcon } from '../Common/TokenIcon'

//SimpleBar
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
                        <AssetTable />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <PoolShareTable />
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

const mapStatetoProps = state => {
  return { ...state.Layout };
};

export const AssetTable = (props) => {

  const context = useContext(Context);
  const [page,setPage] = useState(2)
  const [loading,setLoading] = useState(false)
  const [completeArray,setCompleteArray] = useState(false)

  const handleNextPage = () => {
    setPage(page + 1)
    getNextTokenDetails(context.walletData.address, context.tokenArray, context.tokenDetailsArray, page, isLoading, isNotLoading, isCompleteArray)
    getWalletData(context.walletData.address, context.tokenDetailsArray)
    console.log(page)
  }

  const isLoading = () => {
    setLoading(true)
    console.log('loading more assets')
  }
  
  const isNotLoading = () => {
    setLoading(false)
    console.log('more assets loaded')
  }

  const isCompleteArray = () => {
    setCompleteArray(true)
    console.log('all assets loaded')
  }

  useEffect(() => {
      // updateWallet()
      console.log(context.walletData)
      // eslint-disable-next-line
  }, [loading])

  // const updateWallet = async () => {
  //     context.setContext({ walletData: await getWalletData(context.poolArray) })
  // }

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.connected &&
              <div className="text-center m-2"><LoadingOutlined/></div>
            }
            {context.connected &&
              <Table className="text-center">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                      {context.walletData.tokens.map(c =>
                        <AssetItem 
                          key={c.address}
                          symbol={c.symbol}
                          address={c.address}
                          balance={c.balance}
                        />
                      )}
                      <tr>
                        <td colSpan="2">
                          {!loading && !completeArray &&
                            <button color="primary"
                            className="btn btn-primary waves-effect waves-light m-1"
                            onClick={handleNextPage}>
                              Load More
                            </button>
                          }
                          {loading &&
                            <div className="text-center m-2"><LoadingOutlined/></div>
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

export const PoolShareTable = (props) => {

  const context = useContext(Context)
  const [page,setPage] = useState(2)
  const [loading,setLoading] = useState(false)
  const [completeArray,setCompleteArray] = useState(false)

  const handleNextPage = () => {
    setPage(page + 1)
    getNextPoolSharesData(context.walletData.address, context.tokenArray, context.stakesData, page, isLoading, isNotLoading, isCompleteArray)
    console.log(page)
  }

  const isLoading = () => {
    setLoading(true)
    console.log('loading more LP shares')
  }
  
  const isNotLoading = () => {
    setLoading(false)
    console.log('LP shares loaded')
  }

  const isCompleteArray = () => {
    setCompleteArray(true)
    console.log('all assets loaded')
  }

  useEffect(() => {
    console.log(context.stakesData)
    // getPoolSharess()
    // console.log(context.stakes)
    // eslint-disable-next-line
  }, [loading])

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.stakesData &&
              <div className="text-center m-2"><LoadingOutlined/></div>
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
                      {context.stakesData.map(c =>
                        <PoolItem 
                          key={c.address}
                          symbol={c.symbol}
                          address={c.address}
                          units={c.units}
                          locked={c.locked}
                        />
                      )}
                      <tr>
                        <td colSpan="2">
                          {!loading && !completeArray &&
                            <button color="primary"
                            className="btn btn-primary waves-effect waves-light m-1"
                            onClick={handleNextPage}>
                              Load More
                            </button>
                          }
                          {loading &&
                            <div className="text-center m-2"><LoadingOutlined/></div>
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

const [tooltipOne, setTooltipOne] = useState(false);
const [tooltipTwo, setTooltipTwo] = useState(false);

const toggleOne = () => setTooltipOne(!tooltipOne);
const toggleTwo = () => setTooltipTwo(!tooltipTwo);

const units = new BigNumber(props.units)
const locked = new BigNumber(props.locked)
const total = units.plus(locked)
const lockedPC = locked.dividedBy(total).times(100).toFixed(0)
const availPC = units.dividedBy(total).times(100).toFixed(0)

  return (
    <>
      <tr>
        <td className="align-middle">
          <TokenIcon className="m-1" address={props.address}/>
          <Progress multi className="m-1 my-2">
            <Progress bar value={convertFromWei(locked).toFixed(2)} max={convertFromWei(total).toFixed(2)} id="tooltipOne">{lockedPC} %</Progress>
            <Progress bar color="success" value={convertFromWei(units).toFixed(2)} max={convertFromWei(total).toFixed(2)} id="tooltipTwo">{availPC} %</Progress>
          </Progress>

          <Tooltip placement="bottom" isOpen={tooltipOne} target="tooltipOne" toggle={toggleOne}>
            Locked
          </Tooltip>

          <Tooltip placement="bottom" isOpen={tooltipTwo} target="tooltipTwo" toggle={toggleTwo}>
            Available
          </Tooltip>
        </td>
        <td className="align-middle">
          <h5 className="m-1">{formatAllUnits(convertFromWei(total))}</h5>
          <h6 className="m-1">{props.symbol}</h6>
        </td>
      </tr>
    </>
  )

}

export default connect(mapStatetoProps, {hideRightSidebar})(RightSidebar);
