import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import axios from 'axios'

import Notification from './notification'

// import logo from '../../assets/spartan-logo-white.png';
import { manageBodyClass } from '../common';

import { getAddressShort, } from '../../utils'
import {
    getTokenDetails, getListedTokens,
    getWalletData, getPoolSharesData, getListedPools
} from '../../client/web3'

const AddressConn = (props) => {

    const context = useContext(Context);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [notifyMessage,setNotifyMessage] = useState("");
    const [notifyType,setNotifyType] = useState("dark");

    useEffect(() => {
        connectWallet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        setConnecting(true)
        window.web3 = new Web3(window.ethereum);
        const account = (await window.web3.eth.getAccounts())[0];
        if (account) {
            await connectingWallet(account)
            setConnecting(false)
            setConnected(true)
            setNotifyMessage('Loaded!');
            setNotifyType('success')
        } else {
            await enableMetaMask()
            setConnected(false)
        }
    }

    const enableMetaMask = async () => {
        console.log('connecting')
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            setConnecting(true)
            connectWallet()
            return true;
        }
        return false;
    }

    const connectingWallet = async (account) => {
        await getSpartaPrice()
        setNotifyMessage('Loading tokens');
        setNotifyType('dark')
        // let assetArray = context.assetArray ? context.assetArray : await getAssets()
        // context.setContext({ 'assetArray': assetArray })
        // let assetDetailsArray = context.assetDetailsArray ? context.assetDetailsArray : await getTokenDetails(account, assetArray)
        // context.setContext({ 'assetDetailsArray': assetDetailsArray })

        let tokenArray = context.tokenArray ? context.tokenArray : await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })
        // context.setContext({ 'poolsData': await getPoolsData(tokenArray) })

        // let allTokens = assetArray.concat(tokenArray)
        // var sortedTokens = [...new Set(allTokens)].sort()

        let poolArray = context.poolArray ? context.poolArray : await getListedPools()
        context.setContext({ 'poolArray': poolArray })

        let tokenDetailsArray = context.tokenDetailsArray ? context.tokenDetailsArray : await getTokenDetails(account, tokenArray)
        context.setContext({ 'tokenDetailsArray': tokenDetailsArray })

        setNotifyMessage('Loading wallet data');
        setNotifyType('dark')
        let walletData = await getWalletData(account, tokenDetailsArray)
        context.setContext({ 'walletData': walletData })

        let stakesData = context.stakesData ? context.stakesData : await getPoolSharesData(account, tokenArray)
        context.setContext({ 'stakesData': stakesData })

        context.setContext({ 'connected': true })
    }

    const getSpartaPrice = async () => {
        let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd')
        console.log(resp.data["spartan-protocol-token"].usd)
        context.setContext({ 'spartanPrice': resp.data["spartan-protocol-token"].usd })
        return
    }

    const addr = () => {
        return getAddressShort(context.walletData?.address)
    }

    /**
   * Toggles the sidebar
   */
    const toggleRightbar = (cssClass) => {
        manageBodyClass("right-bar-enabled");
     }

    return (
        <>
            <Notification
                type={notifyType}
                message={notifyMessage}
            />
            <div >
                {!connected && !connecting &&
                    <div onClick={connectWallet}><i className="bx bx-wallet" /> CONNECT</div>
                }
                {connecting &&
                    <div onClick={toggleRightbar}><i className="bx bx-wallet" /> Connecting <i className="bx bx-loader-alt bx-spin" /></div>
                }
                {connected &&
                    <div onClick={toggleRightbar}><i className="bx bx-wallet" /> {addr()}</div>
                }
            </div>
        </>
    )
}

export default AddressConn
