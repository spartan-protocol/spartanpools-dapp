import React, {useEffect, useState} from 'react'
import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";

import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";
import {convertFromWei, formatAllUnits, bn, convertToWei} from '../../utils';

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
                            <Col xs='6'>{props.poolSymbol} Position</Col>
                            <Col xs='6'><div className='text-right'>TEST</div></Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        SPARTA Gainz: {formatAllUnits(convertFromWei(bn(props.userSparta).minus(bn(convertToWei(spartaAdds))).plus(bn(convertToWei(spartaRemoves)))))}<br />
                        Token Gainz: {formatAllUnits(convertFromWei(bn(props.userToken).minus(bn(convertToWei(tokenAdds))).plus(bn(convertToWei(tokenRemoves)))))}<br />
                        Total SPARTA Adds: {formatAllUnits(spartaAdds)}<br />
                        Total {symbol} Adds: {formatAllUnits(tokenAdds)}<br />
                        Total SPARTA Removes: {formatAllUnits(spartaRemoves)}<br />
                        Total {symbol} Removes: {formatAllUnits(tokenRemoves)}<br />
                        Total Bond Adds of {symbol}: {formatAllUnits(tokenBondAdds)}<br />
                        Total % Of Pool: {formatAllUnits(props.userPC)}<br />
                        Total SPARTA (exc BOND): {formatAllUnits(convertFromWei(props.userSparta))}<br />
                        Total {symbol} (exc BOND): {formatAllUnits(convertFromWei(props.userToken))}<br />
                        Total SPARTA locked in BOND: {formatAllUnits(convertFromWei(props.userBondSparta))}<br />
                        Total {symbol} locked in BOND: {formatAllUnits(convertFromWei(props.userBondToken))}<br />
                    </CardBody>
                </Card>
            </Col>

        </>
    )
};

export default withRouter(withNamespaces()(PositionComponent));