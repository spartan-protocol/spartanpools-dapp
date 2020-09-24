import React from 'react'
import { Link } from "react-router-dom";
import { Row, Col, Layout, Menu } from 'antd';

// import axios from 'axios'


import logo from '../../assets/spartan-coin.png';
import AddressConn from '../components/AddressConn'
import { useWindowSize } from '../components/common'

const { Header } = Layout;

const Headbar = (props) => {

  const size = useWindowSize();
  const width = size.width;

    return (
        <Header className="header">
            <Row>
                <Col className="header-logo" xs={4} sm={4}>
                  <a href="../pools"><img src={logo} alt="Logo" style={{height:'50px'}} /></a>
                </Col>
                <Col xs={20} sm={12}>
                    <Menu id="header" mode="horizontal" defaultSelectedKeys={['1']}>
                        {/* <Menu.Item key='0'>
                            <Link to={"/overview"}>OVERVIEW</Link>
                        </Menu.Item> */}
                        <Menu.Item key='1'>
                            <Link to={"/pools"}>Pools</Link>
                        </Menu.Item>
                        {/* <Menu.Item key='2'>
                            <Link to={"/upgrade"}>UPGRADE</Link>
                        </Menu.Item> */}
                        {/* <Menu.Item key='2'>
                            <Link to={"/swap"}>SWAP</Link>
                        </Menu.Item>
                        <Menu.Item key='3'>
                            <Link to={"/stake"}>STAKE</Link>
                        </Menu.Item> */}
                        <Menu.Item key='3'>
                            <Link to={"/earn"}>Earn</Link>
                        </Menu.Item>
                        {/* <Menu.Item key='4'>
                            <Link to={"/dao"}>DAO</Link>
                        </Menu.Item> */}

                        {/* <Menu.Item key='6'>
                            <Link to={"/about"}>ABOUT</Link>
                        </Menu.Item> */}
                        {/* <Menu.Item key="3">
                            <Link to={"/cdps"}>CDPs</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to={"/anchor"}>PRICE ANCHOR</Link>
                        </Menu.Item>  */}
                        {/* <Menu.Item key="5">
                            <Link to={"/upgrade"}>UPGRADE</Link>
                        </Menu.Item> */}
                    </Menu>
                </Col>
                { width > 575 &&
                  <Col xs={0} sm={8} style={{ textAlign: 'right' }}>
                      <AddressConn />
                  </Col>
                }
            </Row>

        </Header>
    )
}

export default Headbar
