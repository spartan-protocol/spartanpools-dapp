
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { getDaoContract, getRewards, getStakesData, getListedTokens } from '../../client/web3'

import { Table, Row, Col, Card, message } from 'antd';

import { ColourCoin } from '../components/common'
import { H1, Center } from '../components/elements';

import { convertFromWei } from '../../utils'

const Earn = (props) => {

    // Show Spartan Token Info
    // Show Spartan Balance
    // Input field of token, upgrade button


    const context = useContext(Context)
    // const [connecting, setConnecting] = useState(false)
    // const [connected, setConnected] = useState(false)
    // const [visible, setVisible] = useState(false);

    const [reward, setReward] = useState(false);

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {

        let rewards = await getRewards(context.walletData.address)
        console.log({rewards})
        setReward(rewards)

    }

    const lock = async (record) => {
        let contract = getDaoContract()
        let tx = await contract.methods.lock(record.poolAddress, record.units).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const unlock = async (record) => {
        let contract = getDaoContract()
        let tx = await contract.methods.unlock(record.poolAddress).send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const harvest = async () => {
        let contract = getDaoContract()
        let tx = await contract.methods.harvest().send({ from: context.walletData.address })
        console.log(tx.transactionHash)
        await refreshData()
    }

    const refreshData = async () => {
        let stakesData = await getStakesData(context.walletData.address, await getListedTokens())
        context.setContext({ 'stakesData': stakesData })
        message.success('Transaction Sent!', 2);
    }

    const columns = [
        {
            render: (record) => (
                <div className="tokenlogo">
                    <ColourCoin symbol={record.symbol} size={36} />
                </div>
            )
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <h3>{name}</h3>
            )
        },
        {
            title: 'BALANCE',
            dataIndex: 'units',
            key: 'units',
            render: (units) => (
                <h3>{convertFromWei(units)}</h3>
            )
        },
        {
            title: 'LOCKED',
            dataIndex: 'locked',
            key: 'locked',
            render: (locked) => (
                <h3>{convertFromWei(locked)}</h3>
            )
        },
        {
            title: <Col xs={24} className="cntr btn secondary pool" onClick={harvest}>
              <LogoutOutlined /> HARVEST YIELD
            </Col>,
            render: (record) => (

                    <Row type="flex" justify="center" align="middle">
                      <Col className="btn primary" onClick={() => lock(record)}>
                            <LoginOutlined /> DEPOSIT
                      </Col>
                      <Col className="btn primary" onClick={() => unlock(record)}>
                            <LogoutOutlined /> WITHDRAW
                      </Col>
                    </Row>

            )
        }
    ]


    return (
        <div>
            <Row>
                <Col xs={24} className="cntr">
                  <h1>Earn</h1>
                  <h2>Earn yield by depositing liquidity in the SPARTAN DAO.</h2>
                </Col>
                <Col xs={24} className="cntr">
                    <Table
                        dataSource={context.stakesData}
                        columns={columns} pagination={false}
                        rowKey="symbol" />
                </Col>
            </Row>
            <br/>

            <Card>
            <Row>
                <Col xs={24}>
                    <Row>
                        <Col xs={24}>
                            <Row>
                                <Col xs={24}>
                                    <Center><h2>CLAIM REWARDS</h2></Center>
                                    <Center><H1>{convertFromWei(reward)}</H1></Center>
                                    <div className="btn primary" onClick={harvest}>HARVEST YIELD</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
          </Card>

        </div>
    )

}

export default Earn
