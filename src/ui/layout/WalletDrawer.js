import React, { useEffect, useContext,useState } from 'react';
import { Context } from '../../context'
//  import { convertFromWei } from '../../utils'
import { Tabs, Table, Row, Col, Button, Divider } from 'antd';
 import { Label, Center } from '../components/elements';
import { CoinRow, CDPDetails } from '../components/common';
import { Link } from 'react-router-dom'
import { EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
const { TabPane } = Tabs;

const DrawerContent = (props) => {
    const context = useContext(Context)
    
    useEffect(() => {   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.transaction])


    function callback(key) {
        console.log(key);
    }

    return (
        <>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="ASSETS" key="1">
                    <AssetTable />
                </TabPane>
                <TabPane tab="STAKES" key="2">
                    <StakeTable />
                </TabPane>
                {/* <TabPane tab="CDPS" key="3">
                    <CDPTable />
                </TabPane> */}
            </Tabs>
        </>
    );
};

export default DrawerContent

export const AssetTable = () => {

    const context = useContext(Context)
    useEffect(() => {
        // updateWallet()
        
    }, [context.transaction])
    
    // const updateWallet = async () => {
    //     context.setContext({ walletData: await getWalletData(context.poolArray) })
    // }

    const columns = [
        {
            render: (record) => (
                <div>
                    <CoinRow
                            symbol={record.symbol}
                            name={record.name}
                            balance={record.balance}
                            size={32} />
                </div>
            )
        }
    ]

    return (
        <div>
            <Table dataSource={context.walletData.tokens}
                pagination={false}
                showHeader={false}
                columns={columns}
                rowKey="symbol" />
        </div>
    )
}

export const StakeTable = () => {

    const context = useContext(Context)

    useEffect(() => {
        // getStakes()
        // console.log(context.stakes)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const getStakes = async() => {

    //     context.setContext({stakeData:await getStakeData(context.walletData.address, context.poolArray)})
    // }

    const columns = [
        {
            render: (record) => (
                <div>
                    <CoinRow
                            symbol={record.symbol}
                            name={record.name}
                            balance={record.units}
                            size={32} />
                </div>
            )
        }
    ]

    return (
        <div>
            <Table dataSource={context.stakesData}
                pagination={false}
                showHeader={false}
                columns={columns}
                rowKey="symbol" />
        </div>
    )
}

export const CDPTable = () => {
    const context = useContext(Context)
    const [CDPflag, setCDPFlag] = useState(null)

    useEffect(() => {
        checkCDP()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.accountCDP])
    
    
    const checkCDP = () => {
        if(context.accountCDP){
            setCDPFlag(true)
        }else{
            setCDPFlag(false)
        }
 
    }
  
    return (
        <div>
            {CDPflag && 
            <Row  >
                <Col span={24}>
                <Divider><Label>Collateral</Label></Divider>
            <CDPDetails
            symbol={"ETH"}
            name={"Ethereum"}
            balance={context.accountCDP?.collateral}
            size={32}
            />
            <br></br>
            <Divider><Label>Debt</Label></Divider>
            
            <CDPDetails
            symbol={"MAI"}
            name={"MAI Token"}
            balance={context.accountCDP?.debt}
            size={32} />
            <Link to={"/cdp/manageCDP"}>
            <Center>
                <Button icon={< EditOutlined/>} style={{marginTop: 20}} type="primary"> Manage CDP</Button>
                </Center>
                </Link>
            </Col>

           </Row>
        }
     
        {!CDPflag &&
        <Link to={"/cdp/openCDP"}>
            <Center>
        <Button icon={<PlusCircleOutlined/>}type="primary" >Open a CDP</Button>
        </Center>
        </Link>
        }
        
                
        </div>
    )
}