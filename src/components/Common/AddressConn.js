import React, { useEffect, useContext } from 'react'
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

    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    useEffect(() => {
        getTokenArray()
        getSpartaPriceLoop()
        // eslint-disable-next-line
    }, [])

    const getSpartaPriceLoop = async () => {
        let data = await getSpartaPrice()
        context.setContext({'spartanPrice': data})
        await pause(7500)
        getSpartaPriceLoop()
    }

    const getTokenArray = async () => {
        // (tokenArray) LISTED TOKENS | USED: RIGHT-BAR + EARN TABLE + POOL TABLE + ADD LIQ + SWAP
        context.setContext({'tokenArrayLoading': true})
        let tokenArray = await getListedTokens()
        context.setContext({'tokenArray': tokenArray})
        context.setContext({'tokenArrayComplete': true})
        context.setContext({'tokenArrayLoading': false})
        // Connect web3 & load global arrays
        loadingGlobal(tokenArray)
        connectWallet(tokenArray)
    }

    const connectWallet = async (tokenArray, prevAccount) => {
        //console.log('connecting wallet')
        window.web3 = new Web3(window.ethereum)
        if (window.web3._provider) {
            context.setContext({'web3Wallet': true})
            const accounts = await window.web3.eth.requestAccounts()
            const account = accounts[0]
            if (account) {
                if (account !== prevAccount) {
                    context.setContext({'account': account})
                    await loadingTokens(tokenArray, account)
                    await pause(5000)
                    connectWallet(tokenArray, account)
                }
                else {
                    await pause(5000)
                    connectWallet(tokenArray, account)
                }
            } else {
                await pause(3000)
                connectWallet(tokenArray)
            }
        }
        else {
            context.setContext({'web3Wallet': false})
            await pause(3000)
            connectWallet(tokenArray)
        }
    }

    const loadingTokens = async (tokenArray, account) => {
        // (walletData) WALLET DATA | USED: RIGHT-BAR + EARN TABLE + POOL PANE SIDE + POOL TABLE + ADD LIQ + CREATE POOL
        // (sharesData) SHARES DATA | USED: RIGHT-BAR + EARN TABLE + ADD LIQ
        context.setContext({'walletDataLoading': true})
        context.setContext({'sharesDataLoading': true})
        let data = await Promise.all([getWalletData(account), getSharesData(account, tokenArray)])
        let walletData = data[0]
        context.setContext({'walletData': walletData})
        context.setContext({'walletDataLoading': false})
        //console.log(walletData)
        let sharesData = data[1]
        context.setContext({'sharesData': sharesData})
        context.setContext({'sharesDataLoading': false})
        //console.log(sharesData)
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
            //console.log(sharesData)
        }
    }

    const loadingGlobal = async (tokenArray) => {
        // (poolArray) LISTED POOLS | USED: GLOBALLY
        let data = await Promise.all([getListedPools(), loadPoolsData(tokenArray)])
        context.setContext({'poolArray': data[0]})
        //console.log(data[1])
    }

    const loadPoolsData = async (tokenArray) => {
        // (poolsData) POOLS DATA | USED: POOLS TABLE + ADD LIQ + CREATE POOL + SWAP
        if (context.poolsDataLoading !== true) {
            context.setContext({'poolsDataLoading': true})
            const getPools = await getPoolsData(tokenArray)
            context.setContext({'poolsData': getPools})
            context.setContext({'poolsDataLoading': false})
            //console.log(getPools)
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

    const toggleRightbar = () => {
        manageBodyClass("right-bar-enabled");
    }

    return (
        <>
            {!context.walletData && context.walletDataLoading !== true &&
                <>
                    <div className="btn ml-1" onClick={()=>connectWallet(props)}>
                        <i className="bx bx-xs bx-border-circle bx-tada-hover bx-wallet bg-light text-warning float-left" />
                    </div>
                    <div className="btn mr-1" onClick={()=>connectWallet(props)}>
                        <i className="bx bx-xs bx-border-circle bx-tada-hover bx-refresh bg-light text-warning float-right" />
                    </div>
                </>
            }
            {context.walletDataLoading === true &&
                <>
                    <div className="btn ml-1" onClick={toggleRightbar}>
                        <i className="bx bx-xs bx-border-circle bx-wallet bg-light text-secondary float-left" />
                    </div>
                    <div className="btn mr-1" onClick={getTokenArray}>
                        <i className="bx bx-xs bx-border-circle bx-spin bx-loader bg-light text-green float-right" />
                    </div>
                </>
            }
            {context.walletData && context.walletDataLoading !== true &&
                <>
                    <div className="btn ml-1" onClick={toggleRightbar}>
                        <i className="bx bx-xs bx-border-circle bx-wallet bg-light text-secondary float-left d-inline-block" />
                    </div>
                    <div className="btn mr-1" onClick={getTokenArray}>
                        <i className="bx bx-xs bx-border-circle bx-refresh bg-light text-secondary float-right" />
                    </div>
                </>
            }
        </>
    )
}

export default AddressConn
