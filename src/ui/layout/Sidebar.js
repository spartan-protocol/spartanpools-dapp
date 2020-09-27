import React from 'react'
import { Link } from "react-router-dom";
import { Layout, Menu, Row, Col } from 'antd';

import {
  LoginOutlined,
  // DollarOutlined
} from '@ant-design/icons';

import logo from '../../assets/spartan-pools-logo.png';

const { Sider } = Layout;

const Sidebar = (props) => {

  return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Row align="middle" justify="center">
          <Col>
            <a href="../pools"><img src={logo} alt="Logo" style={{width:'150px'}} /></a>
          </Col>
        </Row>

        <Menu className="mainmenu" mode="inline" defaultSelectedKeys={['4']}>
            {/* <Menu.Item key='0'>
                <Link to={"/overview"}>OVERVIEW</Link>
            </Menu.Item> */}
            <Menu.Item key='1'>
                <Link to={"/pools"}><LoginOutlined /> POOLS</Link>
            </Menu.Item>
            {/* <Menu.Item key='2'>
                <Link to={"/upgrade"}>UPGRADE</Link>
            </Menu.Item> */}
            {/* <Menu.Item key='2'>
                <Link to={"/swap"}><SyncOutlined /> SWAP</Link>
            </Menu.Item>
            <Menu.Item key='3'>
                <Link to={"/stake"}>STAKE</Link>
            </Menu.Item> */}
            {/* <Menu.Item key='3'>
                <Link to={"/earn"}><DollarOutlined /> EARN</Link>
            </Menu.Item> */}
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
      </Sider>
  )
}

export default Sidebar
