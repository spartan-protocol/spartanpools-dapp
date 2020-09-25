import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../context'
import { Link } from 'react-router-dom'

import { getAllCDPs,getSafeCDPs, getUnSafeCDPs,getAccountCDP, getWalletTokenData } from '../../client/web3'
import { convertFromWei, ETH_ADDRESS, SPARTA_ADDRESS, getAddressShort } from '../../utils'
// import { getLiquidationFee } from '../../math'

import { BreadcrumbCombo} from '../components/common'
import { H1, HR, Colour, Text, Center, Label, Sublabel } from '../components/elements'

import { EditOutlined, PlusCircleOutlined, AimOutlined,WarningOutlined } from '@ant-design/icons';
import { Row, Col, Card, Divider, Button, Table, Form, Input, Tabs,Tag, Alert } from "antd"

const { TabPane } = Tabs;
const CDPs = () => {
    const context = useContext(Context)
    const [visible, setVisible] = useState(false);
    const [connected, setConnected] = useState(false)
    const [CDPExist, setCDPExist] = useState(null)

    useEffect(() => {
        checkConnected()
        checkForCDP()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])
    useEffect(() => {
        checkForCDP()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.accountCDP])

    const checkConnected = async () => {
        if(context.connected){
            const address = context.wallet?.address
            context.setContext({ accountCDP: await getAccountCDP(address) })
            setConnected(true)
        } else {
            setConnected(false)
        }
    }
    const checkForCDP = () => {
        if(context.accountCDP){
            setCDPExist(true)
        }
    }
const alert = () => {
    setVisible(true)
}
    function callback(key) {
        console.log(key);
    }
    return (
        <div>
            <H1>CDPs</H1>
            <br />
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={<span> All CDPs
                </span>} key="1">
                    <CDPTable />
                </TabPane>
                <TabPane tab="Safe" key="2">
                    <CDPSafeTable />
                </TabPane>
                <TabPane tab={<span>UnSafe <WarningOutlined /></span>} key="3">
                    <CDPUnsafeTable />
                </TabPane>
            </Tabs>
            {connected &&
            <Row>
            {CDPExist &&
            <Link to={"/cdp/manageCDP"}><Button type="primary"icon={< EditOutlined/>}>Manage Your CDP</Button>
            </Link>
            }
            {!CDPExist &&
            <Link to={"/cdp/openCDP"}><Button type="primary"icon={<PlusCircleOutlined />}>Open CDP</Button>
            </Link>
            }
            </Row>
            }
            {!connected &&
                <Row>
                <Button onClick={alert} type="primary" icon={<PlusCircleOutlined />}>Open CDP</Button>
                {visible &&
                    <Alert type="error" message="Please Connect Your Wallet" banner />
                    }
                  </Row>  
            }


        </div>
    )
}
export default CDPs

export const CDPTable = () => {
    const context = useContext(Context)
    const [liquidFee, setLiquidFee] = useState(null)

    useEffect(() => {
        getCDPs()
    }, [])

    const getCDPs = async () => {
        context.setContext({ CDPData: await getAllCDPs() })

    }

    const columns = [
        {
            title: 'CDP ',
            dataIndex: 'cdp',
            key: 'cdp',
            render: (cdp) => (
                <h3>{cdp}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address) => (
                <p>{getAddressShort(address)}</p>
            )
        },
        {
            title: 'Collateral Size (BNB)',
            dataIndex: 'collateral',
            key: 'Collateral',
            render: (collateral) => (
                <p>{convertFromWei(collateral)}</p>
            )
        }, {
            title: 'Amount Owing (MAI)',
            dataIndex: 'debt',
            key: 'debt',
            render: (debt) => (
                <p>{convertFromWei(debt)}</p>
            )
        },
        // {
        //     title: 'Status',
        //     key: 'canLiquidate',
        //     dataIndex: 'canLiquidate',
        //     render: (canLiquidate) => (

        //         <Tag color={canLiquidate === 'UnSafe'? 'red' : 'green'} key={canLiquidate}>
        //         {canLiquidate.toUpperCase()}
        //       </Tag>
        //     )
        //   }
    ]

    return (
        <div>
            <Table dataSource={context.CDPData} columns={columns} rowKey="cdp" />
        </div>
    )
}
export const CDPSafeTable = () => {
    const context = useContext(Context)
    const [liquidFee, setLiquidFee] = useState(null)

    useEffect(() => {
        getCDPs()
    }, [])

    const getCDPs = async () => {
        context.setContext({ SafeCDPData: await getSafeCDPs() })

    }


    const columns = [
        {
            title: 'CDP ',
            dataIndex: 'cdp',
            key: 'cdp',
            render: (cdp) => (
                <h3>{cdp}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address) => (
                <p>{getAddressShort(address)}</p>
            )
        },
        {
            title: 'Collateral Size (BNB)',
            dataIndex: 'collateral',
            key: 'Collateral',
            render: (collateral) => (
                <p>{convertFromWei(collateral)}</p>
            )
        }, {
            title: 'Amount Owing (MAI)',
            dataIndex: 'debt',
            key: 'debt',
            render: (debt) => (
                <p>{convertFromWei(debt)}</p>
            )
        }
    ]

    return (
        <div>
            <Table dataSource={context.SafeCDPData} columns={columns} rowKey="cdp" />
        </div>
    )
}
export const CDPUnsafeTable = () => {
    const context = useContext(Context)
    const [liquidFee, setLiquidFee] = useState(null)

    useEffect(() => {
        getCDPs()
    }, [])

    const getCDPs = async () => {
        context.setContext({ UnSafeCDPData: await getUnSafeCDPs() })

    }


    const columns = [
        {
            title: 'CDP ',
            dataIndex: 'cdp',
            key: 'cdp',
            render: (cdp) => (
                <h3>{cdp}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address) => (
                <p>{getAddressShort(address)}</p>
            )
        },
        {
            title: 'Collateral Size (BNB)',
            dataIndex: 'collateral',
            key: 'Collateral',
            render: (collateral) => (
                <p>{convertFromWei(collateral)}</p>
            )
        }, {
            title: 'Amount Owing (MAI)',
            dataIndex: 'debt',
            key: 'debt',
            render: (debt) => (
                <p>{convertFromWei(debt)}</p>
            )
        },
        {
            title: 'Potential Fee (USD)',
            dataIndex: 'liquidateFee',
            key: 'liquidateFee',
            render: (liquidateFee) => (
                <p>{convertFromWei(liquidateFee)}</p>
            )
        },{
            render: (record) => (
                <div style={{ textAlign: 'right' }}>
                    <Link to={"/cdp/Liquidate"}>
                        <Button
                            icon={<AimOutlined />}>Liquidate CDP</Button>
                    </Link>
                </div>

            )
        }
    ]

    return (
        <div>
            <Table dataSource={context.UnSafeCDPData} columns={columns} rowKey="cdp" />
        </div>
    )
}


// export const addCollateral = () => {
//     const { TabPane } = Tabs;

//     useEffect(() => {
//         getBalances()
//     }, [])

//     const getBalances = async () => {
//         setTokenData(await getWalletTokenData(ETH_ADDRESS))
//     }


//     return (
//         <div>

//         </div>
//     )
// }
