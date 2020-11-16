import React, {useState} from 'react'

import {BNB_ADDR} from '../../client/web3'

export const TokenIconPane = ({address}) => {

    const addr = address
    const tokenURL = ("https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/" + addr + "/logo.png")
    const [isFallback, setIsFallback] = useState(tokenURL)


    const onFallback = () => {
        setIsFallback(process.env.PUBLIC_URL + "/fallback.png")
    }

    return (
        <>
            {addr === BNB_ADDR &&
            <img
                src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png"}
                style={{height:50,borderRadius:26}}
                alt="BNB Token Icon"
            />
            }
            {addr !== BNB_ADDR &&
            <img
                src={isFallback}
                style={{height:50,borderRadius:26}}
                onError={onFallback}
                alt={addr + " Token Icon"}
            />
            }
        </>
    );
}