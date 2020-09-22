import React, { useContext, useEffect } from 'react'
import '../../App.css'
import { Context } from '../../context'
import { CoinRow } from '../components/common'
import { Table } from 'antd'

//export const AssetTable = () => {

//    const context = useContext(Context)

//    useEffect(() => {
//        updateWallet()

//    }, [context.transaction])

//     const updateWallet = async () => {
//         context.setContext({ walletData: await getWalletData(context.poolArray) })
//     }

//    const columns = [
//        {
//            render: (record) => (
//                <div>
//                    <CoinRow
//                        symbol={record.symbol}
//                        name={record.name}
//                        balance={record.balance}
//                        address={record.address}
//                        size={32} />
//                </div>
//            )
//        }
//    ]

//    return (
//        <div>
//            <Table dataSource={context.walletData.tokens}
//                pagination={false}
//                showHeader={false}
//                columns={columns}
//                rowKey="symbol" />
//        </div>
//    )
//}



export function openNav() {
    document.getElementById("mySidepanel").style.width = "350px";
}

export function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
} 

const Sidebar = (props) => {     

    return (
        <div>           
            <div id="mySidepanel" class="sidepanel">
                <button class='closebtn' onClick={closeNav}>X</button>
               
            </div>
        </div>
    )
}

export default Sidebar



