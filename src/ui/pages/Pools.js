import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'
import { Link } from 'react-router-dom'
import { Card, Table, Row, Col } from 'antd'

import { getListedTokens, getListedPools, getPoolsData, getGlobalData } from '../../client/web3'
import { formatUSD, formatAPY, convertFromWei } from '../../utils'

import { PlusCircleOutlined, SwapOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';

import { Button } from '../components/elements'
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
            <Row gutter={[10, 10]} type="flex" justify="center">
                <Col xs={24} className="cntr">
                  <h1>Pools</h1>
                </Col>
                <Col xs={24} md={18}>
                    <PoolsPaneSide globalData={globalData} />
                </Col>
                <Col xs={12} className="cntr">
                  <a href="/pool/create"><Button type="primary" icon={<PlusCircleOutlined />} >CREATE POOL</Button></a>
                </Col>
                <Col xs={12} className="cntr">
                  <a href="/pool/stake"><Button type="primary" disabled icon={<PlusCircleOutlined />} >ADD LIQUIDITY</Button></a>
                </Col>
                <Col xs={24} md={18}>
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
            title: 'Pool',
            render: (record) => (
                <div>
                    <ColourCoin symbol={record.symbol} size={36} />
                </div>
            )
        },
        {
            title: 'Action',
            render: (record) => (
                <Row gutter={[5, 5]} type="flex" justify="center" align="middle">
                  <Col>
                    <Link to={`/pool/stake?pool=${record.address}`}>
                        <Button type={'secondary'}
                            icon={<LoginOutlined />}>JOIN</Button>
                    </Link>
                  </Col>
                  <Col>
                    <Link to={`/pool/swap?pool=${record.address}`}>
                        <Button
                            icon={<SwapOutlined />}
                        >TRADE</Button>
                    </Link>
                  </Col>
                </Row>

            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <h3>{formatUSD(price, context.spartanPrice)}</h3>
            )
        },
        {
            title: 'Depth',
            dataIndex: 'depth',
            key: 'depth',
            render: (depth) => (
                <h3>{formatUSD(convertFromWei(depth), context.spartanPrice)}</h3>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            render: (volume) => (
                <h3>{formatUSD(convertFromWei(volume), context.spartanPrice)}</h3>
            )
        },
        {
            title: 'Txns',
            dataIndex: 'txCount',
            key: 'txCount',
            render: (txCount) => (
                <h3>{txCount.toLocaleString()}</h3>
            )
        },
        {
            title: 'APY',
            dataIndex: 'apy',
            key: 'apy',
            render: (apy) => (
                <h3>{formatAPY(apy)}</h3>
            )
        }, {
            title: 'Revenue',
            dataIndex: 'fees',
            key: 'fees',
            render: (fees) => (
                <h3>{formatUSD(convertFromWei(fees), context.spartanPrice)}</h3>
            )
        }
    ]

    const tableStyles = {
        margin: -20,
        marginRight: -40
    }

    return (
        <>
            {!context.connected &&
                <LoadingOutlined />
            }
            {context.connected &&
                <Row>
                    <Col xs={24} style={{padding: 20}}>
                        <Table style={tableStyles}
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
        <div>
                    <Row gutter={[10, 10]} type="flex" justify="center" align="middle">
                        <Col xs={12} sm={6}>
                          <Card>
                            <h2>Total Staked</h2>
                            <h2>{formatUSD(convertFromWei(props.globalData?.totalPooled), context.spartanPrice)}</h2>
                          </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Card>
                            <h2>Total Volume</h2>
                            <h2>{formatUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice)}</h2>
                          </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Card>
                            <h2>Txn Count</h2>
                            <h2>{+props.globalData?.unstakeTx + +props.globalData?.stakeTx + +props.globalData?.swapTx}</h2>
                          </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Card>
                            <h2>Total Fees</h2>
                            <h2>{formatUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice)}</h2>
                          </Card>
                        </Col>
                    </Row>
        </div>
    )
}
