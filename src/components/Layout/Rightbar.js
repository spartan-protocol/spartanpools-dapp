import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../context'
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table } from "reactstrap";
import classnames from 'classnames';

import {LoadingOutlined} from '@ant-design/icons';

import { connect } from "react-redux";
import { hideRightSidebar } from "../../store/actions";

import {convertFromWei, formatAllUnits} from '../../utils'

import { manageBodyClass, TokenIcon } from '../common';

//SimpleBar
import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../assets/scss/custom/components/_rightbar.scss";

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
                <Nav tabs>
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

  useEffect(() => {
      // updateWallet()

  }, [context.transaction])

  // const updateWallet = async () => {
  //     context.setContext({ walletData: await getWalletData(context.poolArray) })
  // }

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.connected &&
              <div style={{textAlign:"center"}}><LoadingOutlined/></div>
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

  useEffect(() => {
    // getPoolSharess()
    // console.log(context.stakes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <>
      <div>
        <Row>
          <Col>
            {!context.stakesData &&
              <div style={{textAlign:"center"}}><LoadingOutlined/></div>
            }
            {context.stakesData &&
              <Table className="text-center">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                      {context.stakesData.map(c =>
                        <PoolItem 
                          key={c.address}
                          symbol={c.symbol}
                          address={c.address}
                          units={c.units}
                        />
                      )}
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

  return (
    <>
      <tr>
        <td>
          <TokenIcon address={props.address}/>
        </td>
        <td>
          <h5>{formatAllUnits(convertFromWei(props.units))}</h5>
          <h6>{props.symbol}</h6>
        </td>
      </tr>
    </>
  )

}

export default connect(mapStatetoProps, {hideRightSidebar})(RightSidebar);
