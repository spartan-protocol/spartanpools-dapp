import React, {useState, useEffect, useContext} from 'react'
import {Context} from '../context'

import {withRouter} from 'react-router-dom'
import InputPaneJoin from "../components/Sections/InputPaneJoin";

import {
    Input,
    Row,
    Col,
} from "reactstrap";

import Notification from '../components/Common/notification'

import {LeftOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined, UnlockOutlined} from '@ant-design/icons';
import {BreadcrumbCombo, CoinRow} from '../components/common'
import {Sublabel} from '../components/elements'


// import { getLiquidityUnits } from '../../math'
import {
    BNB_ADDR, SPARTA_ADDR, ROUTER_ADDR, getTokenContract, getRouterContract,
    getTokenData, getNewTokenData, getAssets, getListedTokens, getListedPools, getPoolsData,
    getTokenDetails, getWalletData, updateWalletData,
} from '../client/web3'

import {convertToWei, formatBN} from '../utils'
// var utils = require('ethers').utils;

const CreatePool = (props) => {

    const context = useContext(Context)

    const [addressSelected, setAddressSelected] = useState(SPARTA_ADDR)
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState("dark");

    // const [tokenList, setTokenList] = useState([SPARTA_ADDR])
    // const [tokenShortList, setTokenShortList] = useState([SPARTA_ADDR])
    const [checkFlag, setCheckFlag] = useState(false)
    const [tokenData, setTokenData] = useState(null)
    // const [mainPool, setMainPool] = useState({
    //     'symbol': 'XXX',
    //     'name': 'XXX',
    //     'address': BNB_ADDR,
    //     'price': 0,
    //     'volume': 0,
    //     'baseAmount': 0,
    //     'tokenAmount': 0,
    //     'depth': 0,
    //     'txCount': 0,
    //     'apy': 0,
    //     'units': 0,
    //     'fees': 0
    // })

    const [stake1Data, setAddLiquidity1Data] = useState({
        address: SPARTA_ADDR,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    const [stake2Data, setAddLiquidity2Data] = useState({
        address: BNB_ADDR,
        symbol: 'XXX',
        balance: 0,
        input: 0,
    })
    // const [liquidityUnits, setLiquidityUnits] = useState(0)

    const [approval1, setApproval1] = useState(false)
    const [approval2, setApproval2] = useState(false)
    // const [addLiquidityTx, setAddLiquidityTx] = useState(null)

    useEffect(() => {
        if (context.connected) {
            getData()
            return function cleanup() {
                getData()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {
        // const tokenList = await filterWalletNotPools(context.poolsData, context.walletData)
        // setTokenList(tokenList)
        // console.log(tokenList)
        // setTokenShortList(await filterTokensNotPoolSelection())
        // setTokenData(await getTokenData(tokenList[0], context.walletData))
        // setMainPool(await getTokenData(tokenList[0], context.walletData))

        const inputTokenData = await getTokenData(SPARTA_ADDR, context.walletData)
        setAddLiquidity1Data(await getPoolSharesInputData(inputTokenData.balance, inputTokenData))
        // const outputTokenData = await getTokenData(BNB_ADDR, context.walletData)
        // setAddLiquidity2Data(await getPoolSharesInputData(outputTokenData.balance, outputTokenData))

    }

    const onInputChange = async (e) => {
        setAddressSelected(e.target.value)
    }

    const checkToken = async () => {
        if (addressSelected !== SPARTA_ADDR) {
            setApproval1(false)
            setApproval2(false)

            if (!context.walletData?.address) {
                setNotifyMessage('Wait for wallet to load first')
                setNotifyType('danger')
            } else {
                try {
                    var tokenData = await getNewTokenData(addressSelected, context.account)
                    setTokenData(tokenData)
                    //console.log(tokenData)
                    if (+tokenData.balance > 0) {
                        setCheckFlag(true)
                        setAddLiquidity2Data(await getPoolSharesInputData(tokenData.balance, tokenData))
                    } else {
                        setNotifyMessage('You do not have that token on your address')
                        setNotifyType('danger')
                    }
                    await Promise.all([checkApproval1(SPARTA_ADDR), checkApproval2(addressSelected)])
                } catch (err) {
                    setNotifyMessage('Not a valid token')
                    setNotifyType('danger')
                }
            }

        }

    }

    // const changeToken = () => {

    // }

    const onAddLiquidity1Change = async (e) => {
        const input = e.target.value
        setAddLiquidity1Data(await getPoolSharesInputData(convertToWei(input), stake1Data))
        // const stake = {
        //     baseAmount: convertToWei(input),
        //     tokenAmount: stake2Data.input
        // }
        // setLiquidityUnits(getLiquidityUnits(stake, stake))
    }

    // const changeAddLiquidity1Token = async (tokenAmount) => {
    //     const inputTokenData = await getTokenData(tokenAmount, context.walletData)
    //     setAddLiquidity1Data(await getPoolSharesInputData(inputTokenData.balance, inputTokenData))
    //     const stake = {
    //         baseAmount: inputTokenData.balance,
    //         tokenAmount: stake2Data.input
    //     }
    //     setLiquidityUnits(getLiquidityUnits(stake, stake))
    // }

    const changeAddLiquidity1Amount = async (amount) => {
        const finalAmt = (amount * stake1Data?.balance) / 100
        setAddLiquidity1Data(await getPoolSharesInputData(finalAmt, stake1Data))
        // const stake = {
        //     baseAmount: finalAmt,
        //     tokenAmount: stake2Data.input
        // }
        // setLiquidityUnits(getLiquidityUnits(stake, stake))
    }

    // const changeAddLiquidity2Token = async (tokenAmount) => {
    //     console.log("changing sell tokens not enabled yet")
    // }

    const onAddLiquidity2Change = async (e) => {
        const input = e.target.value
        setAddLiquidity2Data(await getPoolSharesInputData(convertToWei(input), stake2Data))
        // const stake = {
        //     baseAmount: stake1Data.input,
        //     tokenAmount: convertToWei(input)
        // }
        // console.log(stake)
        // setLiquidityUnits(getLiquidityUnits(stake, stake))
        // console.log(formatBN(getLiquidityUnits(stake, stake)))
    }

    const changeAddLiquidity2Amount = async (amount) => {
        const finalAmt = (amount * stake2Data?.balance) / 100
        setAddLiquidity2Data(await getPoolSharesInputData(finalAmt, stake2Data))
        // const stake = {
        //     baseAmount: stake1Data.input,
        //     tokenAmount: finalAmt
        // }
        // console.log(stake)
        // setLiquidityUnits(getLiquidityUnits(stake, stake))
        // console.log(formatBN(getLiquidityUnits(stake, stake)))
    }

    const getPoolSharesInputData = async (input, inputTokenData) => {
        const liquidityData = {
            address: inputTokenData.address,
            symbol: inputTokenData.symbol,
            balance: inputTokenData.balance,
            input: input,
        }
        return liquidityData
    }

    // const getShare = () => {
    //     const share = (bn(liquidityUnits).div(bn(mainPool.units))).toFixed(2)
    //     return (share*100).toFixed(2)
    // }

    // const getValueOfShare = () => {
    //     return '$1234.54'
    // }

    const checkApproval1 = async (address) => {
        const contract = getTokenContract(address)
        let data = await Promise.all([contract.methods.allowance(context.account, ROUTER_ADDR).call(), getTokenData(address, context.walletData)])
        const approval = data[0]
        const tokenData = data[1]
        if (+approval >= tokenData.balance) {
            setApproval1(true)
        }
    }

    const checkApproval2 = async (address) => {
        if (address === BNB_ADDR) {
            setApproval2(true)
        } else {
            const contract = getTokenContract(address)
            let data = await Promise.all([contract.methods.allowance(context.account, ROUTER_ADDR).call(), getNewTokenData(address, context.account)])
            const approval = data[0]
            var tokenData = data[1]
            if (+approval >= +tokenData.balance) {
                setApproval2(true)
            }
            //console.log(address, +approval, +tokenData.balance)
        }
    }

    const unlockSparta = async () => {
        unlockToken(stake1Data.address)
    }

    const unlockAsset = async () => {
        unlockToken(stake2Data.address)
    }

    const unlockToken = async (address) => {
        //console.log(ROUTER_ADDR, address)
        const contract = getTokenContract(address)
        const supply = await contract.methods.totalSupply().call()
        //console.log(ROUTER_ADDR, supply)
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.account,
            gasPrice: '',
            gas: ''
        })
        await Promise.all([checkApproval1(SPARTA_ADDR), checkApproval2(address)])

        if (context.walletDataLoading !== true) {
            // Refresh BNB balance
            context.setContext({'walletDataLoading': true})
            let walletData = await updateWalletData(context.account, context.walletData, BNB_ADDR)
            context.setContext({'walletData': walletData})
            context.setContext({'walletDataLoading': false})
        }
    }

    const back = () => {
        props.history.push('/pools')
    }

    //0x7fd8b9a2
    //000000000000000000000000000000000000000000000001a055690d9db8
    //00000000000000000000000000000000000000000000000000000de0b6b3a764
    //00000000000000000000000000000000000000000000000000000000000000000000

    const createPool = async () => {
        const poolContract = getRouterContract()
        console.log('Creating pool', formatBN(stake1Data.input, 0), formatBN(stake2Data.input, 0), addressSelected)
        await poolContract.methods.createPool(formatBN(stake1Data.input, 0), formatBN(stake2Data.input, 0), addressSelected).send({
            from: context.account,
            gasPrice: '',
            gas: '',
            value: addressSelected === BNB_ADDR ? formatBN(stake2Data.input, 0) : 0
        })
        // setAddLiquidityTx(tx.transactionHash)
        await reloadData()
        props.history.push('/pools')
    }

    const reloadData = async () => {
        let data = await Promise.all([getAssets(), getListedTokens(), getListedPools()])
        let assetArray = data[0]
        let tokenArray = data[1]
        let poolArray = data[2]
        let poolsData = await getPoolsData(tokenArray)
        var sortedTokens = [...new Set(assetArray.concat(tokenArray))].sort()
        // REWORK BELOW LINE (change tokendetailsarray)
        let tokenDetailsArray = await getTokenDetails(context.account, sortedTokens)
        // REWORK BELOW LINE (change tokendetailsarray)
        let walletData = await getWalletData(context.account, tokenDetailsArray)
        context.setContext({'tokenArray': tokenArray})
        context.setContext({'poolArray': poolArray})
        context.setContext({'poolsData': poolsData})
        // context.setContext({ 'sharesData': sharesData })
        // REWORK BELOW LINE (change tokendetailsarray)
        context.setContext({'tokenDetailsArray': tokenDetailsArray})
        context.setContext({'walletData': walletData})
    }

    return (
        <div>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <BreadcrumbCombo title={'CREATE POOL'} parent={'POOLS'} link={'/pools'} child={'CREATE'}></BreadcrumbCombo>
            <br/>
            <Row type="flex" align="middle" justify="center">

                <Col xs={8} sm={6} md={6} onClick={back} className="btn primary"
                     style={{textAlign: 'left', maxWidth: '90px'}}>
                    {<LeftOutlined/>} BACK
                </Col>
                <Col xs={16} sm={18} md={18}>
                </Col>

                <Col xs={16} md={12}>

                    <Input
                        placeholder={'enter token address'}
                        onChange={onInputChange}></Input>

                    {/* <Input onChange={props.onInputChange}
                        value={tokenList[0]}
                        allowClear={true}
                        // addonAfter={<TokenDropDown default={tokenList[0]}
                        //     changeToken={changeToken}
                        //     tokenList={tokenList} />}
                    ></Input> */}
                </Col>
                <Col xs={8} md={4}>
                    <div className="btn primary" onClick={checkToken}>{<QuestionCircleOutlined/>} CHECK</div>
                </Col>
                <Col xs={0} md={6}>
                </Col>
                {checkFlag &&
                <div className="minimal-card ant-card-bordered cntr">
                    <Col xs={24}>
                        <CoinRow
                            symbol={tokenData.symbol}
                            name={tokenData.name}
                            balance={tokenData.balance}
                            size={30}/>
                    </Col>
                </div>
                }
            </Row>
            {checkFlag &&
            <div className="minimal-card ant-card-bordered cntr">
                <Row type="flex" align="middle" justify="center">
                    <Col xs={24}>
                        <Row type="flex" align="middle" justify="center">
                            <Col xs={12}>
                                <Sublabel size={20}>{'INPUT SPARTA'}</Sublabel><br/>
                                <InputPaneJoin
                                    // mainPool={mainPool}
                                    // tokenList={tokenShortList}
                                    paneData={stake1Data}
                                    onInputChange={onAddLiquidity1Change}
                                    // changeToken={changeAddLiquidity1Token}
                                    changeAmount={changeAddLiquidity1Amount}
                                />
                            </Col>
                            <Col xs={12}>
                                <Sublabel size={20}>{'INPUT TOKEN'}</Sublabel><br/>
                                <InputPaneJoin
                                    // tokenList={[tokenData.address]}
                                    paneData={stake2Data}
                                    onInputChange={onAddLiquidity2Change}
                                    // changeToken={changeAddLiquidity2Token}
                                    changeAmount={changeAddLiquidity2Amount}/>
                            </Col>

                        </Row>
                        <Row type="flex" align="middle" justify="center">
                            {/* <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`${convertFromWei(liquidityUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                </Col>
                                <Col xs={12}>
                                    <Center><LabelGroup size={18} element={`100%`} label={'SHARE'} /></Center>
                                </Col> */}
                            {/* <Col xs={8}>
                                <Center><LabelGroup size={18} element={`${getValueOfShare()}`} label={'STAKED VALUE'} /></Center>
                                </Col> */}
                        </Row>
                        <br></br>
                        <Row type="flex" align="middle" justify="center">
                            <Col xs={8}>
                                {!approval1 &&
                                <div className="btn primary" onClick={unlockSparta}>
                                    <UnlockOutlined/> Approve {stake1Data.symbol}</div>
                                }
                            </Col>
                            <Col xs={8}>
                                {(approval1 && approval2) &&
                                <div className="btn primary" onClick={createPool}>CREATE POOL</div>
                                }
                            </Col>
                            <Col xs={8}>
                                {!approval2 &&
                                <div className="btn primary" onClick={unlockAsset}>
                                    <UnlockOutlined/> Approve {stake2Data.symbol}</div>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            }
        </div>
    )
}

export default withRouter(CreatePool)
