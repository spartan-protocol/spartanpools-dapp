import React, { useContext, useState } from 'react';
import { Context } from '../../context'
import classnames from 'classnames';

import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Table } from "reactstrap";

import {convertFromWei, formatAllUnits} from '../../utils'

import { manageBodyClass } from '../common';
import { TokenIcon } from '../Common/TokenIcon'
import { TokenIconChart } from '../Common/TokenIconChart'
import { Doughnut } from 'react-chartjs-2';
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

      <SimpleBar style={{ height: "100vh" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-4 pt-4">
              <Link to="#" onClick={toggleRightbar} className="right-bar-toggle float-right">
                <i className="mdi mdi-close noti-icon"/>
              </Link>
              <h5 className="m-0">Wallet</h5>
              {context.account !== undefined &&
                <>
                  <a target="_blank" href={"https://bscscan.com/address/" + context.account} rel="noopener noreferrer" className='d-inline-block'><p>View on BSC Scan</p></a> <span> </span>
                </>
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
                      decimals={c.decimals}
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
          <h5>{formatAllUnits(convertFromWei(props.balance, props.decimals))}</h5>
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
//const lockedPC = locked.dividedBy(total).times(100).toFixed(0)
var symbol = props.symbol
symbol = symbol.substring(symbol.indexOf("-") + 1)

const donutData = {
  labels: [
    "Available",
    "Locked"
  ],
  datasets: [
    {
      data: [convertFromWei(units).toFixed(2), convertFromWei(locked).toFixed(2)],
      backgroundColor: [
        "#a80005",
        "#556ee6"
      ],
      hoverBackgroundColor: [
        "#a80005",
        "#556ee6"
      ],
      borderWidth:1,
      borderColor:'#121212',
      hoverBorderColor: "#fff"
    }
  ]
}

const donutOptions = {
  legend: {
      display: false,
  },
  cutoutPercentage:60,
  tooltips: {
    // Disable the on-canvas tooltip
    enabled: false,

    custom: function(tooltipModel) {
        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            var bodyLines = tooltipModel.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function(title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function(body, i) {
                var colors = tooltipModel.labelColors[i];
                var style = 'background:' + colors.backgroundColor;
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                var span = '<span style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + body + '</td></tr>';
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        var position = this._chart.canvas.getBoundingClientRect();

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset - 20 + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset - 20 + tooltipModel.caretY + 'px';
        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.zIndex = '10000';
        tooltipEl.style.background = 'rgba(0, 0, 0, .7)';
        tooltipEl.style.color = '#fff';
        tooltipEl.style.borderRadius = '3px';
    }
  }
}

  return (
    <>
      <tr>
        <td className="align-middle w-50 p-4" style={{position:'relative'}}>
          <Doughnut width={68} height={68} data={donutData} options={donutOptions}/>
          <TokenIconChart address={props.address}/>
        </td>
        <td className="align-middle w-50 p-1">
          <h6>{symbol}:SPARTA</h6>
          <p className='m-2 font-size-12'>({props.symbol})</p>
          <h5 className='m-2'>{formatAllUnits(convertFromWei(total))}</h5>
        </td>
      </tr>
    </>
  )

}

export default RightSidebar;
