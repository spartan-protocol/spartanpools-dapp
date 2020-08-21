import React, { useEffect, useState, useContext} from 'react'
import { Context } from '../../context'
import {Link} from 'react-router-dom'
import { Row, Col } from 'antd'
import { HR, H1, H2, Text, LabelGroup, Button, Gap } from '../components/elements';
import { rowStyles } from '../components/styles'

import {getRouterContract} from '../../client/web3'
import { formatUSD, convertFromWei } from '../../utils'

const Overview = (props) => {
    const context = useContext(Context)

    const [networkData, setNetworkData] = useState({
        'pools' : 0,
        'totalVolume': 0,
        'totalStaked': 0,
        'totalTx': 0,
        'totalRevenue': 0,
    })

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {

        var contract = getRouterContract()
        let SPARTA = await contract.methods.SPARTA().call() 
        console.log(SPARTA)

        // let networkData = await getNetworkData(context.poolsData)
        // context.setContext({'networkData': networkData})
        // setNetworkData(networkData)
    }

    // const volume = () => {
    //     return `$${().toFixed(2)}`
    // }


    return (
        <div>
            <H1>Overview</H1>
            <HR />
            <Gap/>
            <h1>

            </h1>
            {/* <Row  style={rowStyles}>
                <Col xs={3}>
                    <LabelGroup size={24} label={'POOLS'} title={networkData?.pools} />
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'VOLUME'} title={formatUSD(convertFromWei(networkData?.totalVolume), context.spartanPrice)} />
                </Col>
                <Col xs={3}>
                    <LabelGroup size={24}  label={'TOTAL TX'} title={networkData?.totalTx}/>
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'TOTAL STAKED'} title={formatUSD(convertFromWei(networkData?.totalStaked), context.spartanPrice)} />
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'TOTAL REVENUE'} title={formatUSD(convertFromWei(networkData?.totalRevenue), context.spartanPrice)} />
                </Col>
            </Row> */}
            {/* <Gap/>
            <H2>POOLS</H2><br></br>
            <Text>You can provide liquidity and trade across pools</Text><br/>
            <Link to={"/pools"}><Button type="primary">POOLS</Button></Link>
            <Gap></Gap> */}
            {/* <H2>CDPs</H2><br></br>
            <Text>You can create debt from pooled tokens</Text><br/>
            <Link to={"/pools"}><Button type="primary">CDPS</Button></Link> */}

        </div>
    )
}

export default Overview