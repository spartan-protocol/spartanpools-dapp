import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { Link } from "react-router-dom";
import { Row, Col, Button, Layout, Menu, Drawer } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import '../../App.css';

import Web3 from 'web3'
import axios from 'axios'

import { message } from 'antd';

import WalletDrawer from './WalletDrawer'
import { getAddressShort, } from '../../utils'
import { getAssets, getAssetDetails, getWalletData, getStakesData } from '../../client/web3'

const { Header } = Layout;

const Headbar = (props) => {



    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        connectWallet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        setConnecting(true)
        window.web3 = new Web3(window.ethereum);
        const account= (await window.web3.eth.getAccounts())[0];
        if (account) {
            message.loading('Loading assets', 3);
            let assetArray = context.assetArray ? context.assetArray : await getAssets()
            context.setContext({ 'assetArray': assetArray })
            let assetDetailsArray = context.assetDetailsArray ? context.assetDetailsArray : await getAssetDetails(account, assetArray)
            context.setContext({ 'assetDetailsArray': assetDetailsArray })

            message.loading('Loading wallet data', 3);
            let walletData = await getWalletData(account, assetDetailsArray)
            context.setContext({ 'walletData': walletData })

            // let poolArray = context.poolArray ? context.poolArray : await getListedPools()
            // let poolsData = context.poolsData ? context.poolsData : await getPoolsData(poolArray)
            // message.loading('Loading stake data', 3);
            // let stakesData = context.stakesData ? context.stakesData : await getStakesData(accountConnected, poolArray)
            // if (!context.poolsData) {
            //     context.setContext({ 'poolArray': poolArray })
            //     context.setContext({ 'poolsData': poolsData })
            //     context.setContext({ 'stakesData': stakesData })
            // }

            
            context.setContext({ 'connected': true })
            // console.log({walletData})
            // await getSpartaPrice()
            setConnecting(false)
            setConnected(true)
            message.success('Loaded!',  2);
        } else {
            await ethEnabled()
            setConnected(false)
        }
    }

    const ethEnabled = () => {
        console.log('connecting')
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            setConnecting(true)
            return true;
        }
        return false;
    }

    // const getSpartaPrice = async () => {
    //     let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan&vs_currencies=usd')
    //     console.log(resp.data.spartan.usd)
    //     context.setContext({ 'spartanPrice': resp.data.spartan.usd })
    //     return
    // }

    const addr = () => {
        return getAddressShort(context.walletData?.address)
    }

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <Header>
            <Row>
                <Col xs={20}>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key='1'>
                            <Link to={"/upgrade"}>UPGRADE</Link>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Link to={"/swap"}>SWAP</Link>
                        </Menu.Item>
                        <Menu.Item key='3'>
                            <Link to={"/dao"}>DAO</Link>
                        </Menu.Item>
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
                <Col xs={4} style={{ textAlign: 'right' }}>
                    {!connected && !connecting &&
                        <Button type="primary" onClick={connectWallet}>CONNECT</Button>
                    }
                    {connecting &&
                        <Button type="primary" icon={<LoadingOutlined />}>CONNECTING</Button>
                    }
                    {connected &&
                        <Button type="primary" icon={<UserOutlined />} onClick={showDrawer}>{addr()}</Button>
                    }
                </Col>
            </Row>
            <Drawer
                title={context.walletData?.address}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={450}
            >
                <WalletDrawer />
            </Drawer>

        </Header>
    )
}

export default Headbar