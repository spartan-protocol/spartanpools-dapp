import React, {useContext, useEffect, useState} from 'react'
import {Context} from '../context'
import {withRouter} from "react-router-dom";

import {getGlobalData} from '../client/web3'

import Breadcrumbs from "../components/Common/Breadcrumb";


import {
    Container,
    Row,
    Col,
} from "reactstrap";
import {withNamespaces} from 'react-i18next';
import PoolTable from "../components/Sections/PoolTable";
import PoolsPaneSide from "../components/Sections/PoolsPaneSide";


const Pools = (props) => {

    const context = useContext(Context)
    const [globalData, setGlobalData] = useState({
        totalPooled: 0,
        totalFees: 0,
        totalVolume: 0,
        addLiquidityTx: 0,
        removeLiquidityTx: 0,
        swapTx: 0,
    });

    useEffect(() => {
        if (context.poolsData) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.poolsData])

    const getData = async () => {
        setGlobalData(await getGlobalData())
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("Liquidity Pools")}/>
                    <Row>
                        <Col xs="12">
                            <PoolsPaneSide globalData={globalData}/>
                        </Col>
                        <Col xs="12">
                            <PoolTable/>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};


export default withRouter(withNamespaces()(Pools));


