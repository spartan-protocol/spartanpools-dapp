import React, {useEffect, useState} from 'react'
import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";
import {convertFromWei, formatAllUnits, bn, convertToWei} from '../../utils';
import {TokenIcon} from '../Common/TokenIcon'

const PositionComponent = (props) => {
    useEffect(() => {
        getData()
        // return function cleanup() {
        //     setLoading(false)
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [symbol, setSymbol] = useState('')
    const [spartaAdds, setSpartaAdds] = useState(0)
    const [tokenAdds, setTokenAdds] = useState(0)
    const [spartaRemoves, setSpartaRemoves] = useState(0)
    const [tokenRemoves, setTokenRemoves] = useState(0)
    const [tokenBondAdds, setTokenBondAdds] = useState(0)
    const getData = async () => {
        // GET TOKEN SYMBOL
        let temp = props.poolSymbol.split('-')[1]
        if (temp === 'WBNB') {temp = 'BNB'}
        setSymbol(temp)
        // Get sum of all token adds
        let tempArray = []
        let tempAdd = []
        for (let i = 0; i < props.adds.length; i++) {
            tempAdd = props.adds[i].filter(x => x.currency.symbol === temp)
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenAdds(tempArray)
        tempArray = []
        // Get sum of all sparta adds
        for (let i = 0; i < props.adds.length; i++) {
            tempAdd = props.adds[i].filter(x => x.currency.symbol === 'SPARTA')
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setSpartaAdds(tempArray)
        tempArray = []
        // Get sum of all token removes
        for (let i = 0; i < props.removes.length; i++) {
            tempAdd = props.removes[i].filter(x => x.currency.symbol === temp)
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenRemoves(tempArray)
        tempArray = []
        // Get sum of all sparta removes
        for (let i = 0; i < props.removes.length; i++) {
            tempAdd = props.removes[i].filter(x => x.currency.symbol === 'SPARTA')
            if (tempAdd.length > 0) {
                tempArray.push(tempAdd)
            }
        }
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setSpartaRemoves(tempArray)
        tempArray = []
        // Get sum of all token bond-adds
        tempArray = props.bondAdds
        tempArray = tempArray.flat(Infinity)
        tempArray = tempArray.reduce((a, b) => bn(a).plus(bn(b.amount)), 0)
        tempArray = tempArray.toString()
        setTokenBondAdds(tempArray)
        tempArray = []
    }

    return (
        <>
            <Col xs="12" md='6' key={props.key}>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col xs='4 px-1 text-center my-auto'>
                                <h5>SPARTA</h5>
                            </Col>
                            <Col xs='4 px-1 text-center'>
                                <img src={"./logo192.png"} alt='SPARTA' style={{height:'40px', marginRight:'-15px'}} />
                                <TokenIcon address={props.address} />
                            </Col>
                            <Col xs='4 px-1 text-center my-auto'>
                                <h5>{symbol}</h5>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs='6 text-right'>
                                SPARTA Adds
                                <h5>{formatAllUnits(spartaAdds)}</h5>
                            </Col>
                            <Col xs='6'>
                                {symbol} Adds
                                <h5>{formatAllUnits(tokenAdds)}</h5>
                            </Col>
                            <Col xs='6 text-right'>
                                SPARTA Bonds
                                <h5>0.00</h5>
                            </Col>
                            <Col xs='6'>
                                {symbol} Bonds
                                <h5>{formatAllUnits(tokenBondAdds)}</h5>
                            </Col>
                            <Col xs='6 text-right'>
                                SPARTA<br/>Removals
                                <h5>{formatAllUnits(spartaRemoves)}</h5>
                            </Col>
                            <Col xs='6'>
                                {symbol}<br/>Removals
                                <h5>{formatAllUnits(tokenRemoves)}</h5>
                            </Col>
                            <Col xs='6 text-right'>
                                Redeemable SPARTA<br/>exc. locked in Bond
                                <h5>{formatAllUnits(convertFromWei(props.userSparta))}</h5>
                            </Col>
                            <Col xs='6'>
                                Redeemable {symbol}<br/>exc. locked in Bond
                                <h5>{formatAllUnits(convertFromWei(props.userToken))}</h5>
                            </Col>
                            {convertFromWei((bn(props.userBondSparta).plus(bn(props.userBondToken))).comparedTo(0)) > 0  &&
                                <>
                                    <Col xs='6 text-right'>
                                        SPARTA Gains<br/>
                                        exc. Locked in BOND
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userSparta).minus(bn(convertToWei(spartaAdds))).plus(bn(convertToWei(spartaRemoves)))))}</h5>
                                    </Col>
                                    <Col xs='6'>
                                        {symbol} Gains<br/>
                                        exc. Locked in BOND
                                        <h5>{formatAllUnits(convertFromWei(bn(props.userToken).minus(bn(convertToWei(tokenAdds))).plus(bn(convertToWei(tokenRemoves)))))}</h5>
                                    </Col>
                                    <Col xs='6 text-right'>
                                        SPARTA value<br/>
                                        Locked in BOND
                                        <h5>{formatAllUnits(convertFromWei(props.userBondSparta))}</h5>
                                    </Col>
                                    <Col xs='6'>
                                        {symbol} value<br/>
                                        Locked in BOND
                                        <h5>{formatAllUnits(convertFromWei(props.userBondToken))}</h5>
                                    </Col>
                                </>
                            }
                            <Col xs='6 text-right'>
                                SPARTA Gains<br/>
                                inc. Locked in BOND
                                <h5>{formatAllUnits(convertFromWei(bn(props.userSparta).plus(bn(props.userBondSparta)).minus(bn(convertToWei(spartaAdds))).plus(bn(convertToWei(spartaRemoves)))))}</h5>
                            </Col>
                            <Col xs='6'>
                                {symbol} Gains<br/>
                                inc. Locked in BOND
                                <h5>{formatAllUnits(convertFromWei(bn(props.userToken).plus(props.userBondToken).minus(bn(convertToWei(tokenAdds))).plus(bn(convertToWei(tokenRemoves)))))}</h5>
                            </Col>
                            <Col xs='12 text-center'>
                            {convertFromWei((bn(props.userBondSparta).plus(bn(props.userBondToken))).comparedTo(0)) > 0  &&
                                <>
                                    Pool ownership inc. Bond-locked: <h5>{formatAllUnits((bn(props.userPC).plus(bn(props.userBondPC))) * 100)} %</h5>
                                </>
                            }
                                Current redeemable ownership: <h5>{formatAllUnits(props.userPC * 100)} %</h5>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>

        </>
    )
};

export default withRouter(withNamespaces()(PositionComponent));