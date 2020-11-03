import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col, Form, Input } from 'antd';
import { Link, Redirect,useHistory } from 'react-router-dom'
import { BreadcrumbCombo, InputPaneSwap, PoolPane, CLTButtonRow } from '../components/common'
import { Center, HR, Text, Label } from '../components/elements';
import {formatBN, convertFromWei, convertToWei, ETH_ADDRESS, SPARTA_ADDRESS, formatUSD} from '../../utils'
import { getSwapOutput, getSwapSlip, getDoubleSwapOutput, getDoubleSwapSlip } from '../../math'
import { getAccountCDP, getWalletTokenData, getWeb3, getContract  } from '../../client/web3'
import { PlusCircleOutlined, AlertFilled } from '@ant-design/icons';

const OpenCDP = (props) => {
const context = useContext(Context)

    useEffect(() => {
        checkCDPflag()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.transactionOPEN])
    const history = useHistory();

    const checkCDPflag = async ()=>{
        if(context.transactionOPEN){

            history.push("/CDPs")
        }
    }


    return (
        <div>

            <BreadcrumbCombo title={'Open CDP'} parent={'CDPs'} link={'/cdps'} child={'Open CDP'}></BreadcrumbCombo>
            <br />
            <div >
            <CreateCDP/>
            </div>




        </div>
    )
}

export default OpenCDP

export const CreateCDP = (props) => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    const [openCDPFlag, setOpenCDPFlag] = useState(false)
    const [ethAmount, setEthAmount] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [loaded, setLoaded] = useState(null)
    const [setCR, setCollaterisation] = useState('Minimum 102%')

    useEffect(() => {
        getBalances()
        getAccount()
    }, [context.wallet])

    const getBalances = async () => {
       context.setContext({tokenData: await getWalletTokenData(ETH_ADDRESS)})
    }
    const getAccount = () => {
        setAccount(context.wallet?.address)
    }
    const onEthAmountChange = e => {
        setEthAmount(e.target.value)
    }
    const onRatioAmountChange = e => {
        setCollaterisation(e.target.value)
    }
    const onChange = async (amount) => {
        setCollaterisation(amount)
    }
    const openCDP = async () => {
		  const contract = getContract(0)
		  const amount = ethAmount * 1000000000000000000
		  const cltRatio = setCR
		  const tx = await contract.methods.openCDP(cltRatio).send({ from: account, value: amount })
         context.setContext({transactionOPEN : tx})


	}
    const formItemLayout = {
        labelCol: {
            xs: { span: 14 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 10 },
            sm: { span: 10 },
        },
    };

    return (
        <div>

            <Form {...formItemLayout} >
                <Form.Item label="BNB Amount" >
                    <Input size={'large'} allowClear onChange={onEthAmountChange} placeholder={convertFromWei(context.tokenData?.balance) - 0.1} />
                </Form.Item>
                <Form.Item label="Collaterisation" >
                    <Input size={'large'} allowClear onChange={onRatioAmountChange} placeholder={setCR} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 16, offset: 8 },
                    }}
                >
                    <CLTButtonRow changeAmount={onChange} />
                    <Button onClick={openCDP} type ="primary" icon={<PlusCircleOutlined/>}>Open CDP</Button>

                </Form.Item>
                <Text>{ethTx}</Text>
            </Form>


        </div>
    )
}
