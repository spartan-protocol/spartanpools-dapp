import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'

import { manageBodyClass } from '../common';

import { getListedTokens, getSpartaPrice, 
    getWalletData, getNextWalletData, 
    getSharesData, getNextSharesData,
    getPoolsData, getNextPoolsData, 
    checkArrayComplete, getListedPools,
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

    const loadingTokens = async (account) => {
        // (tokenArray) LISTED TOKENS | USED: RIGHT-BAR + EARN TABLE + POOL TABLE + ADD LIQ + SWAP
        context.setContext({'tokenArrayLoading': true})
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})
        context.setContext({'tokenArrayComplete': true})
        context.setContext({'tokenArrayLoading': false})

        // (walletData) WALLET DATA | USED: RIGHT-BAR + EARN TABLE + POOL PANE SIDE + POOL TABLE + ADD LIQ + CREATE POOL
        context.setContext({'walletDataLoading': true})
        let walletData = await getWalletData(account)
        context.setContext({'walletData': walletData})
        context.setContext({'walletDataLoading': false})

        // (sharesData) STAKES DATA | USED: RIGHT-BAR + EARN TABLE + ADD LIQ
        let sharesData = await getSharesData(account, tokenArray)
        context.setContext({'sharesDataLoading': true})
        context.setContext({'sharesData': sharesData})
        context.setContext({'sharesDataLoading': false})

        nextWalletDataPage(tokenArray, walletData, account)
        nextSharesDataPage(tokenArray, sharesData, account)
    }

    const nextWalletDataPage = async (tokenArray, walletData, account) => {
        if (walletData && context.walletDataLoading !== true) {
            var lastPage = await checkArrayComplete(tokenArray, walletData)
            context.setContext({'walletDataLoading': true})
            context.setContext({'walletData': await getNextWalletData(account, tokenArray, walletData)})
            context.setContext({'walletDataLoading': false})
            context.setContext({'walletDataComplete': lastPage})
        }
    }

    const nextSharesDataPage = async (tokenArray, sharesData, account) => {
        if (sharesData && context.sharesDataLoading !== true) {
            var lastPage = await checkArrayComplete(tokenArray, sharesData)
            context.setContext({'sharesDataLoading': true})
            context.setContext({'sharesData': await getNextSharesData(account, tokenArray, sharesData)})
            context.setContext({'sharesDataLoading': false})
            context.setContext({'sharesDataComplete': lastPage})
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

        // (tokenArray) LISTED TOKENS | USED: RIGHT-BAR + EARN TABLE + POOL TABLE + ADD LIQ + SWAP
        context.setContext({'tokenArrayLoading': true})
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})
        context.setContext({'tokenArrayComplete': true})
        context.setContext({'tokenArrayLoading': false})

        // (poolArray) LISTED POOLS | USED: GLOBALLY
        let poolArray = await getListedPools()
        context.setContext({'poolArray': poolArray})

        // (poolsData) POOLS DATA | USED: POOLS TABLE + ADD LIQ + CREATE POOL + SWAP
        if (context.poolsDataLoading !== true) {
            context.setContext({'poolsDataLoading': true})
            const getPools = await getPoolsData(tokenArray)
            context.setContext({'poolsData': getPools})
            context.setContext({'poolsDataLoading': false})
            nextPoolsDataPage(tokenArray, getPools)
        }
    }

    const nextPoolsDataPage = async (tokenArray, poolsData) => {
        var lastPage = await checkArrayComplete(tokenArray, poolsData)
        if (context.poolsDataLoading !== true) {
            context.setContext({'poolsDataLoading': true})
            context.setContext({'poolsData': await getNextPoolsData(tokenArray, poolsData)})
            context.setContext({'poolsDataLoading': false})
            context.setContext({'poolsDataComplete': lastPage})
        }
    }

    /**
   * Toggles the sidebar
   */
    const toggleRightbar = (cssClass) => {
        manageBodyClass("right-bar-enabled");
    }

    return (
        <>
            {!context.walletData && context.walletDataLoading !== true &&
                <div className="btn header-white mx-1" onClick={()=>connectWallet(props)}>
                    <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-x-circle mx-1 float-right" style={{fontSize:22}}/></div>
                </div>
            }
            <div className="btn header-white mx-1" onClick={toggleRightbar}>
                {context.walletData && context.walletDataLoading === true &&
                    <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-loader-alt bx-spin mx-1 float-right" style={{fontSize:22}}/></div>
                }
                {context.walletData && context.walletDataLoading !== true &&
                    <div><i className="bx bx-wallet float-left" style={{fontSize:22}}/><i className="bx bx-check-circle mx-1 float-right" style={{fontSize:22}}/></div>
                }
            </div>
        </>
    )
}

export default AddressConn
