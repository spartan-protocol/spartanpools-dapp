import React from 'react'
import { Link } from "react-router-dom";
import { Row, Col, Layout, Menu } from 'antd';
import '../../App.css';

// import axios from 'axios'


// import logo from '../../assets/spartan-logo-white.png';
import AddressConn from '../components/AddressConn'
import { useWindowSize } from '../components/common'

const { Header } = Layout;

const Headbar = (props) => {

  const size = useWindowSize();
  const width = size.width;

    return (
        <Header>
            <Row>
                {/* <Col xs={4}>
                    <img src={logo} alt="Logo" style={{width:200}}/>
                </Col> */}
                <Col xs={20}>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
                        {/* <Menu.Item key='0'>
                            <Link to={"/overview"}>OVERVIEW</Link>
                        </Menu.Item> */}
                        <Menu.Item key='1'>
                            <Link to={"/pools"}>POOLS</Link>
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
                            <Link to={"/earn"}>EARN</Link>
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
                { width > 767 &&
                  <Col xs={0} md={4} style={{ textAlign: 'right' }}>
                      <AddressConn />
                  </Col>
                }
            </Row>

        </Header>
    )
}

export default Headbar
