import React from 'react'
//import { Context } from '../context'

import Breadcrumbs from "../components/Common/Breadcrumb";

import { TokenIcon } from '../components/Common/TokenIcon';

import {convertFromWei, formatAllUnits} from '../utils'

import {
    Container,
    Row,
    Col,
    Card,
    CardBody, 
    Media,
} from "reactstrap";

import features from "../assets/images/crypto/features-img/img-1.png" //REPLACE WITH IMAGE


const Shares = (props) => {

    //const context = useContext(Context)

    const shares = [ //Use {context.sharesData} when finished testing
        { 
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            baseAmount: "12340301336715504755845",
            locked: "0",
            name: "SpartanPoolV1-Wrapped BNB",
            poolAddress: "0x3de669c4F1f167a8aFBc9993E4753b84b576426f",
            share: 0.011959190958033133,
            symbol: "SPT1-WBNB",
            tokenAmount: "12344411958573823183",
            units: "1234302169549782589959",
        },
        { 
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            baseAmount: "123475175732613302207",
            locked: "0",
            name: "SpartanPoolV1-BUSD Token",
            poolAddress: "0xbF6728454b96A36c720C1bBCAe5773AaafD6959B",
            share: 0.0005575579151425468,
            symbol: "SPT1-BUSD",
            tokenAmount: "12342702076468901918",
            units: "12342293976078536921",
        },
        { 
            address: "0x55d398326f99059fF775485246999027B3197955",
            baseAmount: "123478726789250667972",
            locked: "0",
            name: "SpartanPoolV1-Tether USD",
            poolAddress: "0x2720Ec9809F77e040D4682Cf9f7294276b9cCc56",
            share: 0.0019871937311729806,
            symbol: "SPT1-USDT",
            tokenAmount: "12345110992152294296",
            units: "123417351690025399131",
        },
        { 
            address: "0xcD7C5025753a49f1881B31C48caA7C517Bb46308",
            baseAmount: "123408669333624244867",
            locked: "0",
            name: "SpartanPoolV1-Raven Protocol",
            poolAddress: "0x59742A38d802670449534f3c8B2d8BC077021D8d",
            share: 0.0004397902174187586,
            symbol: "SPT1-RAVEN",
            tokenAmount: "12349999999999997651467",
            units: "123434415680634081929",
        }
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs title="App" breadcrumbItem="Shares"/>
                    <Row>
                        <Col xs="12">
                            <SharesPane/>
                        </Col>
                        <Col xs="12">
                            <br/>
                            {/*{!context.connected &&                                       //RE-ENABLE THESE AFTER INTEGRATING DATA
                                <div style={{textAlign:"center"}}><i className="bx bx-spin bx-loader"/></div>  //RE-ENABLE THESE AFTER INTEGRATING DATA
                            }
                        {context.connected &&                                           //RE-ENABLE THESE AFTER INTEGRATING DATA*/}
                                <PoolShareTable shares={shares} />
                            {/*}                                                //RE-ENABLE THESE AFTER INTEGRATING DATA*/}
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default Shares;

export const SharesPane = (props) => {

    return (

        <React.Fragment>
            <Row>
                <Col sm={12} md={12}>
                    <Card>
                        <div>
                            <Row>
                                <Col lg="9" sm="8">
                                    <div  className="p-4">
                                        <h5 className="text-primary">Welcome to Spartan Protocol!</h5>
                                        <p>Shares overview</p>
                                        <div className="text-muted">
                                            <p className="mb-1"><i className="mdi mdi-circle-medium align-middle text-primary mr-1"/> View your available LP shares</p>
                                            <p className="mb-1"><i className="mdi mdi-circle-medium align-middle text-primary mr-1"/> Assess your gains/losses</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="3" sm="4" className="align-self-center">
                                    <div>
                                        <img src={features} alt="" className="img-fluid d-block"/>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm="3">

                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <Media body>
                                    <p className="text-muted font-weight-medium">YOUR TOTAL ADDED</p>
                                    <h4 className="mb-0">$XXX USD</h4>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <Media body>
                                    <p className="text-muted font-weight-medium">YOUR TOTAL REMOVED</p>
                                    <h4 className="mb-0">$XXX USD</h4>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <Media body>
                                    <p className="text-muted font-weight-medium">YOUR TOTAL AVAILABLE</p>
                                    <h4 className="mb-0">XXX TXNs</h4>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="3">
                    <Card className="mini-stats-wid">
                        <CardBody>
                            <Media>
                                <Media body>
                                    <p className="text-muted font-weight-medium">YOUR TOTAL EARNINGS</p>
                                    <h4 className="mb-0">$XXX USD</h4>
                                </Media>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
};

export const PoolShareTable = (props) => {

    return (
        <div>
            {props.shares.map(c => 
                <PoolShareItem 
                    address={c.address}
                    symbol={c.symbol}
                    baseAmount={c.baseAmount}
                    tokenAmount={c.tokenAmount} 
                    locked={c.locked}
                    name={c.name}
                    poolAddress={c.poolAddress}
                    share={c.share}
                    units={c.units}
                />
            )}
        </div>
    )

}


export const PoolShareItem = (props) => {

    return (
        <>
            <Row>
                <Col xs={6}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs={4}>
                                    <img height="50" alt="SPARTA Token Icon" src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C/logo.png"}/>
                                    <h3>$SPARTA</h3>
                                </Col>
                                <Col xs={4}>
                                    SPARTA ADDED
                                    <h3>XXX</h3>
                                    SPARTA REMOVED
                                    <h3>XXX</h3>
                                </Col>
                                <Col xs={4}>
                                    SPARTA AVAILABLE (SHARE)
                                    <h3>{formatAllUnits(convertFromWei(props.baseAmount))}</h3>
                                    SPARTA GAIN/LOSS
                                    <h3>XXX</h3>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs={6}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs={4}>
                                    <TokenIcon address={props.address}/>
                                    <h3>PAIRED TOKEN NAME</h3>
                                </Col>
                                <Col xs={4}>
                                    PAIRED TOKEN ADDED
                                    <h3>XXX</h3>
                                    PAIRED TOKEN REMOVED
                                    <h3>XXX</h3>
                                </Col>
                                <Col xs={4}>
                                    PAIRED TOKEN AVAILABLE (SHARE)
                                    <h4>{formatAllUnits(convertFromWei(props.tokenAmount))}</h4>
                                    PAIRED TOKEN GAIN/LOSS
                                    <h3>XXX</h3>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}