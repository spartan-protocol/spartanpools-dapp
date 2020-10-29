import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'

import { manageBodyClass } from '../common';

import { getListedTokens, getWalletData, getPoolSharesData, 
    getListedPools, getSpartaPrice, 
    getPoolsData, 
} from '../../client/web3'

const AddressConn = (props) => {

    const context = useContext(Context)
    const [contLoad,setContLoad] = useState(false)

    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    useEffect(() => {
        loadingGlobal(props)
        connectWallet(props)
        // eslint-disable-next-line
    }, [])

    const connectWallet = async (props) => {
        if (contLoad === false) {
            window.web3 = new Web3(window.ethereum)
            if (window.web3._provider) {
                context.setContext({'web3Wallet': true})
                const account = (await window.web3.eth.getAccounts())[0]
                if (account) {
                    setContLoad(false)
                    context.setContext({'account': account})
                    await loadingTokens(account)
                } else {
                    await enableMetaMask(props)
                    setContLoad(true)
                    await pause(3000)
                    connectWallet(props)
                }
            }
            else {
                context.setContext({'web3Wallet': false})
            }
        }
    }

    const enableMetaMask = async () => {
        //console.log('connecting')
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            window.ethereum.enable()
            //await connectWallet()
            return true;
        }
        return false;
    }

    const loadingGlobal = async () => {
        // (spartanPrice) SPARTA PRICE | USED: GLOBALLY
        context.setContext({'spartanPrice': await getSpartaPrice()})

        // (tokenArray) LISTED TOKENS | USED: GLOBALLY
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})

        // (poolArray) LISTED POOLS | USED: GLOBALLY
        let poolArray = await getListedPools();
        context.setContext({'poolArray': poolArray});

        // (stakesData) POOLS DATA | USED: POOLS TABLE + 
        context.setContext({'poolsDataLoading': true})
        const getPools = await getPoolsData(tokenArray)
        context.setContext({'poolsData': getPools})
        context.setContext({'poolsDataLoading': false})
    }

    const loadingTokens = async (account) => {

        // (tokenArray) LISTED TOKENS | USED: GLOBALLY
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})

        // eslint-disable-next-line
        {/*
        //3rd slowest - no longer required (was previously used for 'walletData')
        setNotifyMessage('Loading token details array');
        setNotifyType('dark')
        let tokenDetailsArray = await getTokenDetails(account, tokenArray)
        context.setContext({ 'tokenDetailsArray': tokenDetailsArray })
        */}

        // (walletData) WALLET DATA | USED: RIGHT-BAR + 
        context.setContext({'walletDataLoading': true})
        let walletData = await getWalletData(account)
        context.setContext({'walletData': walletData})
        context.setContext({'walletDataLoading': false})

        // (stakesData) STAKES DATA | USED: RIGHT-BAR + 
        let stakesData = await getPoolSharesData(account, tokenArray)
        context.setContext({'poolSharesDataLoading': true})
        context.setContext({'stakesData': stakesData})
        context.setContext({'poolSharesDataLoading': false})
    }

    /**
   * Toggles the sidebar
   */
    const toggleRightbar = (cssClass) => {
        manageBodyClass("right-bar-enabled");
     }

    return (
        <>
            {!context.walletData && !context.walletDataLoading &&
                <div className="btn header-white mx-1" onClick={()=>connectWallet(props)}>
                        <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-x-circle mx-1 float-right" style={{fontSize:22}}/></div>
                </div>
            }
            <div className="btn header-white mx-1" onClick={toggleRightbar}>
                {context.walletData && context.walletDataLoading &&
                    <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-loader-alt bx-spin mx-1 float-right" style={{fontSize:22}}/></div>
                }
                {context.walletData && !context.walletDataLoading &&
                    <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-check-circle mx-1 float-right" style={{fontSize:22}}/></div>
                }
            </div>
        </>
    )
}

export default AddressConn
