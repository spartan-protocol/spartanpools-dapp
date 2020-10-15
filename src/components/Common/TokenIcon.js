import React, {useState} from 'react'

import {BNB_ADDR} from '../../client/web3'

export const TokenIcon = ({address}) => {

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
                style={{height:40,borderRadius:21}}
                alt="BNB Token Icon"
            />
            }
            {addr !== BNB_ADDR &&
            <img
                src={isFallback}
                style={{height:40,borderRadius:21}}
                onError={onFallback}
                alt={addr + " Token Icon"}
            />
            }
        </>
    );
}