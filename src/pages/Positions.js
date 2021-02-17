import React, {useContext, useState} from 'react'
import {Context} from '../context'
import Breadcrumbs from "../components/Common/Breadcrumb";
import {withRouter} from "react-router-dom";
import {withNamespaces} from "react-i18next";
import classnames from 'classnames';

import {bn} from '../utils'
import {
    ROUTERv1_ADDR, ROUTER_ADDR, ROUTERv2a_ADDR, 
    BNB_ADDR, WBNB_ADDR, BONDv1_ADDR, BONDv2_ADDR, 
    BONDv3_ADDR, BONDv3a_ADDR, BONDv3b_ADDR,
    getBondedv2MemberDetails, getBondedv3MemberDetails
} from '../client/web3'

import Web3 from 'web3'

import {Container, Row, TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import {InputGroup, InputGroupAddon, Input, Button} from "reactstrap";
import PositionComponent from "../components/Sections/PositionComponent"

import axios from "axios";

const Positions = (props) => {
    const context = useContext(Context)

    const apiUrl = 'https://blockchain-data.p.rapidapi.com/'
    const header = {
        'content-type': 'application/json',
        'x-rapidapi-key': process.env.REACT_APP_BITQUERY, // create secret key
        'x-rapidapi-host': 'blockchain-data.p.rapidapi.com'
    }

    let allTsfsOut = ''
    let tsfsOut = ''
    let tsfsIn = ''
    let removeLiq = ''
    let addLiq = ''
    const [userPositions, setUserPositions] = useState([])
    const [loading, setLoading] = useState(false)
    const simpleLoader = <div className='m-auto'><i className='bx bx-loader bx-sm align-middle text-warning bx-spin mx-1' /></div>
    const loader = <div className='m-auto pt-3'><i className='bx bx-loader bx-sm align-middle text-warning bx-spin mx-1' />Please wait ~30 seconds for data to compile!</div>

    // useEffect(() => {
    //     if (context.sharesDataComplete && header['x-rapidapi-key'] !== '') {
    //         getData()
    //     }
    //     return function cleanup() {
    //         setLoading(false)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [context.sharesDataComplete])

    const getStarted = (wallet) => {
        setUserPositions([])
        allTsfsOut = ''
        tsfsOut = ''
        tsfsIn = ''
        removeLiq = ''
        addLiq = ''
        getData(wallet)
    }

    const getData = async (wallet) => {
        setLoading(true)
        // Get User's In & Out Transfers
        await Promise.all([getTsfsOut(wallet), getTsfsIn(wallet)])
        // Get all add & remove events and filter users in/outs 
        await Promise.all([getRemoveLiqData(), getAddLiqData()]) 
        // Filter user's in/outs by pool
        let sharesData = context.sharesData
        console.log('sharesData', sharesData)
        let positionsData = context.sharesData.map(x => ({
            'address': x.address,
            'symbol': x.symbol,
        }))
        for (let i= 0; i < sharesData.length; i++) {
            let addr1 = sharesData[i].address
            if (addr1 === WBNB_ADDR) {addr1 = BNB_ADDR}
            let tempFilter = context.poolsData.filter(x => Web3.utils.toChecksumAddress(x.address) === Web3.utils.toChecksumAddress(addr1))
            let userPC = (bn(sharesData[i].locked).plus(bn(sharesData[i].units))).div(bn(tempFilter[0].units))
            let dataBond = await Promise.all([getBondedv2MemberDetails(wallet, addr1), getBondedv3MemberDetails(wallet, addr1)])
            dataBond = bn(dataBond[0].bondedLP).plus(bn(dataBond[1].bondedLP))
            let dataBondPC = bn(dataBond).div(bn(tempFilter[0].units))
            positionsData[i] = ({
                'userLocked': sharesData[i].locked,
                'userHeld': sharesData[i].units,
                'userBonded': dataBond,
                'userBondPC': dataBondPC,
                'userBondSparta': bn(dataBondPC).times(bn(tempFilter[0].baseAmount)),
                'userBondToken': bn(dataBondPC).times(bn(tempFilter[0].tokenAmount)),
                'userPC': userPC,
                'userSparta': bn(userPC).times(bn(tempFilter[0].baseAmount)),
                'userToken': bn(userPC).times(bn(tempFilter[0].tokenAmount)),
                'address': positionsData[i].address,
                'poolSymbol': positionsData[i].symbol,
                'totalSparta': tempFilter[0].baseAmount,
                'totalToken': tempFilter[0].tokenAmount,
                'totalSupply': tempFilter[0].units,
                'removes': removeTsfsByPool(sharesData[i].address),
                'adds': addTsfsByPool(sharesData[i].address),
                'bondAdds': bondTsfsByPool(sharesData[i].address),
            })
        }
        setUserPositions(positionsData)
        console.log('positionsData', positionsData)
        //getPoolPositions()
        setLoading(false)
    }

    const getTsfsOut = async (wallet) => {
        // Get all member transfers out of wallet
        const options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(options: {desc: "block.height", offset: $offset}, date: {since: $from, till: $till}, sender: {is: "' + wallet + '"}, amount: {gt: 0}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      sender {\n        address\n        annotation\n      }\n      receiver {\n        address\n        annotation\n      }\n      currency {\n        address\n        symbol\n      }\n      amount\n      transaction {\n        hash\n      }\n      external\n    }\n  }\n}',
                variables: {offset: 0, network: 'bsc', from: null, till: null, dateFormat: '%Y-%m-%d'}
            }
        }
        await axios.request(options).then(function (response) {
            allTsfsOut = response.data.data.ethereum.transfers
            console.log('All member tsfs out of wallet', allTsfsOut);
        }).catch(function (error) {
            console.error(error);
        })
    }

    const getTsfsIn = async (wallet) => {
        // Get all member transfers receiving to their wallet
        const options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(options: {desc: "block.height", offset: $offset}, date: {since: $from, till: $till}, receiver: {is: "' + wallet + '"}, amount: {gt: 0}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      sender {\n        address\n        annotation\n      }\n      receiver {\n        address\n        annotation\n      }\n      currency {\n        address\n        symbol\n      }\n      amount\n      transaction {\n        hash\n      }\n      external\n    }\n  }\n}',
                variables: {offset: 0, network: 'bsc', from: null, till: null, dateFormat: '%Y-%m-%d'}
            }
        }
        await axios.request(options).then(function (response) {
            tsfsIn = response.data.data.ethereum.transfers
            console.log('all member transfers receiving to their wallet', tsfsIn);
        }).catch(function (error) {
            console.error(error);
        })
    }

    const getRemoveLiqData = async () => {
        // Get all removeLiq Events ROUTERv1
        let options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTERv1_ADDR,
                    caller: '',
                    method: '05fe138b',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            removeLiq = response.data.data.ethereum.smartContractCalls
            console.log('all removeLiq Events ROUTERv1', removeLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all removeLiq Events ROUTERv2a
        options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTERv2a_ADDR, // UPDATE WHEN ROUTER IS UPGRADED
                    caller: '',
                    method: '05fe138b',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            removeLiq.push(...response.data.data.ethereum.smartContractCalls)
            console.log('all removeLiq Events ROUTERv2a', removeLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all removeLiq Events ROUTERv2
        options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTER_ADDR, // UPDATE WHEN ROUTER IS UPGRADED
                    caller: '',
                    method: '05fe138b',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            removeLiq.push(...response.data.data.ethereum.smartContractCalls)
            console.log('all removeLiq Events ROUTERv2', removeLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all relevant remove-liquidity transfers
        removeLiq = removeLiq.map(x => x.transaction.hash)
        tsfsIn = tsfsIn.filter(x => removeLiq.includes(x.transaction.hash))
        console.log('Total/all relevant remove-liquidity transfers', tsfsIn)
    }

    const getAddLiqData = async () => {
        // Get all addLiq Events ROUTERv1
        let options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}\n',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTERv1_ADDR,
                    caller: '',
                    method: '87b21efc',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            addLiq = response.data.data.ethereum.smartContractCalls
            console.log('all addLiq Events ROUTERv1', addLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all addLiq Events ROUTERv2a
        options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}\n',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTERv2a_ADDR, // UPDATE WHEN ROUTER IS UPGRADED
                    caller: '',
                    method: '87b21efc',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            addLiq.push(...response.data.data.ethereum.smartContractCalls)
            console.log('all addLiq Events ROUTERv2a', addLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all addLiq Events ROUTERv2
        options = {
            method: 'POST',
            url: apiUrl,
            headers: header,
            data: {
                query: 'query ($network: EthereumNetwork!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(options: {desc: "block.timestamp.time", offset: $offset}, smartContractAddress: {is: $contract}, smartContractMethod: {is: $method}, date: {since: $from, till: $till}) {\n      block {\n        timestamp {\n          time(format: "%Y-%m-%d %H:%M:%S")\n        }\n        height\n      }\n      transaction {\n        hash\n      }\n    }\n  }\n}\n',
                variables: {
                    offset: 0,
                    network: 'bsc',
                    contract: ROUTER_ADDR, // UPDATE WHEN ROUTER IS UPGRADED
                    caller: '',
                    method: '87b21efc',
                    from: null,
                    till: null,
                    dateFormat: '%Y-%m'
                }
            }
        }
        await axios.request(options).then(function (response) {
            addLiq.push(...response.data.data.ethereum.smartContractCalls)
            console.log('all addLiq Events ROUTERv2', addLiq)
        }).catch(function (error) {
            console.error(error)
        })
        // Get all relevant add-liquidity transfers
        addLiq = addLiq.map(x => x.transaction.hash)
        tsfsOut = allTsfsOut.filter(x => addLiq.includes(x.transaction.hash))
        console.log('Total/all relevant add-liquidity transfers', tsfsOut)
    }

    const removeTsfsByPool = (pool) => {
        let tempData = []
        let dataIn = []
        // ALL REMOVE LIQ TXNS BY POOL IF BNB
        for (let i = 0; i < tsfsIn.length; i+=2) {
            let count = 0
            let addr1 = tsfsIn[i].currency.address
            let addr2 = tsfsIn[i + 1].currency.address
            if (tsfsIn[i].currency.address === '-') {addr1 = WBNB_ADDR}
            if (tsfsIn[i + 1].currency.address === '-') {addr2 = WBNB_ADDR}
            addr1 = Web3.utils.toChecksumAddress(addr1)
            addr2 = Web3.utils.toChecksumAddress(addr2)
            if (tsfsIn[i].currency.symbol === 'SPARTA') {
                tempData.push(tsfsIn[i])
            }
            if (addr1 === Web3.utils.toChecksumAddress(pool)) {
                tempData.push(tsfsIn[i])
                count = 1
            }
            if (tsfsIn[i + 1].currency.symbol === 'SPARTA') {
                tempData.push(tsfsIn[i + 1])
            }
            if (addr2 === Web3.utils.toChecksumAddress(pool)) {
                tempData.push(tsfsIn[i + 1])
                count = 1
            }
            if (count > 0) {dataIn.push(tempData)}
            count = 0
            tempData = []
        }
        return dataIn
    }

    const addTsfsByPool = (pool) => {
        let tempData = []
        let poolAddress = ''
        // ALL ADD LIQ TXNS BY POOL IF BNB
        poolAddress = context.sharesData
        poolAddress = poolAddress.filter(x => Web3.utils.toChecksumAddress(x.address) === Web3.utils.toChecksumAddress(pool))
        poolAddress = poolAddress[0].poolAddress
        let tempArray = []
        if (pool === WBNB_ADDR) {tempArray = tsfsOut.filter(x => Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(poolAddress) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(ROUTER_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(ROUTERv1_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(ROUTERv2a_ADDR))}
        // ALL ADD LIQ TXNS BY POOL IF NOT BNB
        else {tempArray = tsfsOut.filter(x => Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(poolAddress))}
        let dataOut = []
        for (let i = 0; i < tempArray.length; i++) {
            let block1 = tempArray[i].block.height
            let block2 = tempArray[i + 1]?.block.height
            if (block1 === block2) {
                tempData.push(tempArray[i])
                tempData.push(tempArray[i + 1])
                i++
            }
            else {tempData.push(tempArray[i])}
            dataOut.push(tempData)
            tempData = []
        }
        return dataOut
    }

    const bondTsfsByPool = (pool) => {
        // ALL BOND ADD LIQ TXNS BY POOL
        let tempArray = []
        tempArray = allTsfsOut.filter(x => Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(BONDv1_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(BONDv2_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(BONDv3_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(BONDv3a_ADDR) || Web3.utils.toChecksumAddress(x.receiver.address) === Web3.utils.toChecksumAddress(BONDv3b_ADDR))
        let dataOut = []
        for (let i = 0; i < tempArray.length; i++) {
            let addr1 = tempArray[i].currency.address
            if (addr1 === '-') {addr1 = WBNB_ADDR}
            addr1 = Web3.utils.toChecksumAddress(addr1)
            if (addr1 === Web3.utils.toChecksumAddress(pool)) {dataOut.push(tempArray[i])}
        }
        return dataOut
    }

    const [activeTab, setActiveTab] = useState('1');
    const toggle = (tab) => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid className='px-0 px-sm-1'>
                    <Breadcrumbs title={props.t("App")} breadcrumbItem={props.t("Positions")}/>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1'); }}
                            >
                                Open Positions
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2'); }}
                            >
                                Closed Positions
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <p className='pt-3'>Brave Browser Users: Please <a href="https://spartanprotocol.medium.com/disable-brave-browser-shields-4c727cf5a120" target="_blank" rel="noopener noreferrer">disable shields</a> otherwise this data will be incomplete! <br /></p>
                                {context.sharesDataComplete &&
                                    <InputGroup className='py-3'>
                                        <InputGroupAddon addonType="prepend"><Button onClick={() => {getStarted(document.getElementById('walletButton').value)}}>Check Positions</Button></InputGroupAddon>
                                        <Input value={context.account} id='walletButton' readOnly />
                                    </InputGroup>
                                }
                                {!context.sharesDataComplete && simpleLoader}
                                {userPositions.filter((x) => (parseFloat(bn(x.userBondPC).plus(bn(x.userPC))) > 0)).sort((a, b) => (parseFloat(bn(a.userBondPC).plus(bn(a.userPC))) > parseFloat(bn(b.userBondPC).plus(bn(b.userPC)))) ? -1 : 1).map(x => 
                                    <PositionComponent 
                                        key={x.address}
                                        address={x.address}
                                        poolSymbol={x.poolSymbol}
                                        userLocked={x.userLocked}
                                        userHeld={x.userHeld}
                                        userBonded={x.userBonded}
                                        userBondPC={x.userBondPC}
                                        userBondSparta={x.userBondSparta}
                                        userBondToken={x.userBondToken}
                                        userPC={x.userPC}
                                        userSparta={x.userSparta}
                                        userToken={x.userToken}
                                        totalSparta={x.totalSparta}
                                        totalToken={x.totalToken}
                                        totalSupply={x.totalSupply}
                                        removes={x.removes}
                                        adds={x.adds}
                                        bondAdds={x.bondAdds}
                                    />
                                )}
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                {userPositions.filter((x) => ((parseFloat(bn(x.userBondPC).plus(bn(x.userPC))) <= 0) && ((x.adds.length + x.removes.length + x.bondAdds.length) > 0))).map(x => 
                                    <PositionComponent 
                                        key={x.address}
                                        address={x.address}
                                        poolSymbol={x.poolSymbol}
                                        userLocked={x.userLocked}
                                        userHeld={x.userHeld}
                                        userBonded={x.userBonded}
                                        userBondPC={x.userBondPC}
                                        userBondSparta={x.userBondSparta}
                                        userBondToken={x.userBondToken}
                                        userPC={x.userPC}
                                        userSparta={x.userSparta}
                                        userToken={x.userToken}
                                        totalSparta={x.totalSparta}
                                        totalToken={x.totalToken}
                                        totalSupply={x.totalSupply}
                                        removes={x.removes}
                                        adds={x.adds}
                                        bondAdds={x.bondAdds}
                                    />
                                )}
                            </Row>
                        </TabPane>
                    </TabContent>
                    {loading &&
                        <>
                            {loader}
                        </>
                    }
                </Container>
            </div>
        </React.Fragment>
    )

}

export default withRouter(withNamespaces()(Positions));
