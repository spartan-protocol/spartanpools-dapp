import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'
import { Link } from 'react-router-dom'
import { Card, Table, Row, Col } from 'antd'

import { getListedTokens, getListedPools, getPoolsData, getGlobalData } from '../../client/web3'
import { formatUSD, convertFromWei } from '../../utils'

import { PlusCircleOutlined, SwapOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';

import { ColourCoin } from '../components/common'

const Pools = (props) => {

    const context = useContext(Context)
    const [globalData, setGlobalData] = useState({
        totalPooled:0,
        totalFees:0,
        totalVolume:0,
        stakeTx:0,
        unstakeTx:0,
        swapTx:0,
    })

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {
        setGlobalData(await getGlobalData())
    }

    return (
        <>
            <Row type="flex" justify="center" align="middle" style={{textAlign:"center"}}>
                <Col xs={24}>
                  <h1>Pools</h1>
                </Col>
                <Col xs={24}>
                    <PoolsPaneSide globalData={globalData} />
                </Col>
                <Col xs={24}>
                    <PoolTable />
                </Col>
            </Row>
        </>
    )
}

export default Pools

const PoolTable = (props) => {

    const context = useContext(Context)

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        let tokenArray = await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })
        let poolArray = await getListedPools()
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': await getPoolsData(tokenArray) })
    }

    const columns = [
        {
            title: 'POOL',
            render: (record) => (
                <div>
                    <ColourCoin symbol={record.symbol} size={42} />
                </div>
            )
        },
        {
            title: 'PRICE',
            dataIndex: 'price',
            key: 'price',
            responsive: ['sm'],
            render: (price) => (
                <h3>{formatUSD(price, context.spartanPrice)}</h3>
            )
        },
        {
            title: 'DEPTH',
            dataIndex: 'depth',
            key: 'depth',
            responsive: ['sm'],
            render: (depth) => (
                <h3>{formatUSD(convertFromWei(depth), context.spartanPrice)}</h3>
            )
        },
        {
            title: 'VOLUME',
            dataIndex: 'volume',
            key: 'volume',
            responsive: ['sm'],
            render: (volume) => (
                <h3>{formatUSD(convertFromWei(volume), context.spartanPrice)}</h3>
            )
        },
        {
            title: 'TXNS',
            dataIndex: 'txCount',
            key: 'txCount',
            responsive: ['md'],
            render: (txCount) => (
                <h3>{txCount.toLocaleString()}</h3>
            )
        },
        {
            title: 'REVENUE',
            dataIndex: 'fees',
            key: 'fees',
            responsive: ['md'],
            render: (fees) => (
                <h3>{formatUSD(convertFromWei(fees), context.spartanPrice)}</h3>
            )
        },
        {
            title: <a href="/pool/create">
              <Col xs={24} className="cntr btn secondary pool">
                <PlusCircleOutlined /> CREATE POOL
              </Col>
            </a>,
            render: (record) => (
                <Row type="flex" justify="center" align="middle">
                  <Col className="btn primary">
                    <Link to={`/pool/stake?pool=${record.address}`}>
                        <LoginOutlined /> JOIN
                    </Link>
                  </Col>
                  <Col className="btn primary">
                    <Link to={`/pool/swap?pool=${record.address}`}>
                        <SwapOutlined /> TRADE
                    </Link>
                  </Col>
                </Row>

            )
        }
    ]

    return (
        <>
            {!context.connected &&
                <LoadingOutlined />
            }
            {context.connected &&
                <Row>
                    <Col xs={24}>
                        <Table
                        dataSource={context.poolsData}
                        columns={columns} pagination={false}
                        rowKey="symbol" />
                    </Col>
                </Row>
            }
            <br />
        </>
    )
}

export const PoolsPaneSide = (props) => {

    const context = useContext(Context)

    return (
        <div className="wrapper">
                    <Row type="flex" justify="center" align="middle">
                      <Col md={2}>
                      </Col>
                      <Col xs={12} md={5}>
                        <Card className="leftbar">
                          <h5 className="strong">TOTAL STAKED</h5>
                          <h4 className="strong">{formatUSD(convertFromWei(props.globalData.totalPooled), context.spartanPrice)}</h4>
                        </Card>
                      </Col>
                      <Col xs={12} md={5}>
                        <Card className="rightbar">
                          <h5 className="strong">TOTAL VOLUME</h5>
                          <h4 className="strong">{formatUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice)}</h4>
                        </Card>
                      </Col>
                      <Col xs={12} md={5}>
                        <Card className="leftbar">
                          <h5 className="strong">TXN COUNT</h5>
                          <h4 className="strong">{+props.globalData?.addLiquidityTx + +props.globalData?.removeLiquidityTx + +props.globalData?.swapTx}</h4>
                        </Card>
                      </Col>
                      <Col xs={12} md={5}>
                        <Card className="rightbar">
                          <h5 className="strong">TOTAL FEES</h5>
                          <h4 className="strong">{formatUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice)}</h4>
                        </Card>
                      </Col>
                      <Col md={2}>
                      </Col>
                    </Row>
        </div>
    )
}
