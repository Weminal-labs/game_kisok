import { useEffect, useState } from 'react'
import { 
    ConnectButton, 
    useAutoConnectWallet, 
    useConnectWallet, 
    useCurrentAccount,
    useCurrentWallet,
    useSignAndExecuteTransactionBlock,
    useSignTransactionBlock
} from '@mysten/dapp-kit';
import { create_kisok, get_owner_key_cap, get_kiosk_items, get_object, list_item, delist_item } from './../controller/rpc-client'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import './../App.css'
import { KioskClient, KioskTransaction, Network } from '@mysten/kiosk';
import { TransactionBlock } from '@mysten/sui.js/transactions';
function Home() {
  const [placeItems, setPlaceItems] = useState<any[]>([])
  const [listItems, setListItems] = useState<any[]>([])
  //sign

  const rpcUrl = getFullnodeUrl('testnet'); 
  const client = new SuiClient({ url: rpcUrl });
  const kioskClient = new KioskClient({
      client,
      network: Network.TESTNET,
  });

  const OWNER_ADDRESS = "0x8d9f68271c525e6a35d75bc7afb552db1bf2f44bb65e860b356e08187cb9fa3d"
  const ITEM_TYPE = "0x4f8a43ebdbce05b2fb2afc3918fa1d5a096193f758fafaa275e71161ccafa587::game::Hero"
  const currentAccount = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  console.log(currentWallet)
  console.log(currentAccount)
  

  //sign
  const handle_data = () =>{
    setPlaceItems([])
    setListItems([])
    get_kiosk_items()
        .then(res => {
        let list_data = res.map(item => {
            get_object(`${item?.objectId}`)
            .then(obj => {
            if(item.listing) {
                let new_obj = obj
                obj.price = item.listing.price
                setListItems(prev => [...prev, new_obj])
            }else {
                setPlaceItems(prev => [...prev, obj])
            }
            })
        })
        }
        )
  }

  const handle_delist = () => {
    delist_item('0x427b2b591d1bfaed99d50981de248bb6819391d7b399177700e8ed7cc09786dd')
    .then(res => {
      handle_data()
    })
  }

  const handle_list = () => {
    list_item('0x427b2b591d1bfaed99d50981de248bb6819391d7b399177700e8ed7cc09786dd')
    .then(res => {
      handle_data()
    })
  }
  const autoConnectionStatus = useAutoConnectWallet();
  return (
        <div>
          <span className='label'>Place</span>
          <div className='place_wrapper'>
            {placeItems.map(item =>{
              return <div className='card' key={item.fields.name}>
                <span className='card_info'>Hero name: {item.fields.name}</span>
                <span className='card_info'>History: {item.fields.profile}</span>
                <span className='card_info'>Health: {item.fields.heal}</span>
                <span className='card_info'>Damage: {item.fields.damage}</span>
              </div>
            
            })}
          </div>

          <span className='label'>List for sell</span>
          <div className='place_wrapper'>
            {listItems.map(item =>{
              return <div className='card' key={item.fields.name}>
                <span className='card_info'>Hero name: {item.fields.name}</span>
                <span className='card_info'>History: {item.fields.profile}</span>
                <span className='card_info'>Health: {item.fields.heal}</span>
                <span className='card_info'>Damage: {item.fields.damage}</span>
                <span className='card_info'>Damage: {item.fields.damage}</span>
                <span className='card_info'>${item.price / 1000000000}</span>
                <button className='btn_buy'>Buy</button>
              </div>
            
            })}
          </div>
          <button onClick={handle_list}>List item</button>
          <button onClick={get_owner_key_cap}>get kiosk</button>
          <button onClick={handle_data}>get kiosk items</button>
          <button onClick={handle_delist}>Delist</button>
          <ConnectButton />

          <div>auto connect status: {autoConnectionStatus}</div>
        </div>
  )
}

export default Home
