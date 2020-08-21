import React, { useEffect, useContext } from 'react'
import { Context } from '../../context'
import { Link } from 'react-router-dom'
import { Table } from 'antd'
import { getListedTokens, getListedPools, getPoolsData } from '../../client/web3'
import { formatUSD, formatAPY, convertFromWei } from '../../utils'
import { PlusCircleOutlined, SwapOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';

import { H1, Button } from '../components/elements'
import { ColourCoin } from '../components/common'

const Pools = (props) => {

    return (
        <>
            <H1>POOLS</H1>
            <br />
            <PoolTable />
            <Link to={"/pool/create"}><Button type="primary" icon={<PlusCircleOutlined />}>CREATE POOL</Button>
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
        context.setContext({ tokenArray: tokenArray })
        let poolArray = await getListedPools()
        context.setContext({ poolArray: poolArray })
        context.setContext({ poolsData: await getPoolsData(tokenArray) })
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
        },{
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
                        <Button
                            icon={<LoginOutlined />}>JOIN</Button>
                    </Link>
                    <Link to={`/pool/swap?pool=${record.address}`}>
                        <Button type='primary'
                            icon={<SwapOutlined />}
                        >TRADE</Button>
                    </Link>
                </div>

            )
        }
    ]

    const tableStyles =  {
        margin:0,
        padding:0
    }

    return (
        <>
        {!context.connected &&
            <LoadingOutlined />
        }
        {context.connected &&
            <Table style={tableStyles} dataSource={context.poolsData} columns={columns} rowKey="symbol"/>
        }
            <br/>
        </>
    )
}