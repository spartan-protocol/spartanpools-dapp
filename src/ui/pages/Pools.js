import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'
import { Link } from 'react-router-dom'
import { Table, Row, Col } from 'antd'

import { getListedTokens, getListedPools, getPoolsData, getGlobalData } from '../../client/web3'
import { formatUSD, formatAPY, convertFromWei } from '../../utils'

import { paneStyles, colStyles } from '../components/styles'
import { PlusCircleOutlined, SwapOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';

import { H1, Button, LabelGroup } from '../components/elements'
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
            <H1>POOLS</H1>
            <br />
            <Row>
                <Col xs={24} xl={5}>
                    <PoolsPaneSide globalData={globalData} />
                </Col>
                <Col xs={24} xl={19}>
                    <PoolTable />
                </Col>
            </Row>

            <Link to={"/pool/create"}><Button type="primary" icon={<PlusCircleOutlined />} style={{float:"right"}}>CREATE POOL</Button>
            </Link>
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
            render: (record) => (
                <div>
                    <ColourCoin symbol={record.symbol} size={36} />
                </div>
            )
        },
        {
            title: 'Pool',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol) => (
                <h3>{symbol}</h3>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <p>{formatUSD(price, context.spartanPrice)}</p>
            )
        },
        {
            title: 'Depth',
            dataIndex: 'depth',
            key: 'depth',
            render: (depth) => (
                <p>{formatUSD(convertFromWei(depth), context.spartanPrice)}</p>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            render: (volume) => (
                <p>{formatUSD(convertFromWei(volume), context.spartanPrice)}</p>
            )
        },
        {
            title: 'TX Count',
            dataIndex: 'txCount',
            key: 'txCount',
            render: (txCount) => (
                <p>{txCount.toLocaleString()}</p>
            )
        },
        {
            title: 'APY',
            dataIndex: 'apy',
            key: 'apy',
            render: (apy) => (
                <p>{formatAPY(apy)}</p>
            )
        }, {
            title: 'REVENUE',
            dataIndex: 'fees',
            key: 'fees',
            render: (fees) => (
                <p>{formatUSD(convertFromWei(fees), context.spartanPrice)}</p>
            )
        },
        {
            render: (record) => (
                <div style={{ textAlign: 'right' }}>
                    <Link to={`/pool/stake?pool=${record.address}`}>
                        <Button type={'secondary'}
                            icon={<LoginOutlined />}>JOIN</Button>
                    </Link>
                    <Link to={`/pool/swap?pool=${record.address}`}>
                        <Button
                            icon={<SwapOutlined />}
                        >TRADE</Button>
                    </Link>
                </div>

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
                <Row style={paneStyles}>
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

    const rowStylesPane = {
        marginTop: 20
    }

    return (
        <div>
            <Row style={paneStyles}>
                <Col xs={24} style={colStyles}>
                    {/* <Row>
              <Col xs={12}>
                <ColourCoin symbol={props.pool.symbol} size={50} style={{ marginTop: 10 }} />
              </Col>
              <Col xs={12}>
                <LabelGroup size={30} element={props.pool.symbol} label={props.pool.name} />
              </Col>
            </Row> */}

                    <Row>
                        <Col xs={6}  xl={24} style={rowStylesPane}>
                            <LabelGroup size={20} element={formatUSD(convertFromWei(props.globalData?.totalPooled), context.spartanPrice)} label={'Total Staked'} />
                        </Col>
                        <Col xs={6}  xl={24} style={rowStylesPane}>
                            <LabelGroup size={20} element={formatUSD(convertFromWei(props.globalData?.totalVolume), context.spartanPrice)} label={'Total Volume'} />
                        </Col>

                        <Col xs={6} xl={24} style={rowStylesPane}>
                            <LabelGroup size={20} element={+props.globalData?.unstakeTx + +props.globalData?.stakeTx + +props.globalData?.swapTx} label={'TX COUNT'} />
                        </Col>
                        <Col xs={6} xl={24} style={rowStylesPane}>
                            <LabelGroup size={20} element={formatUSD(convertFromWei(props.globalData?.totalFees), context.spartanPrice)} label={'Total Fees'} />
                        </Col>

                    </Row>

                </Col>
            </Row>
        </div>
    )
}