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
import { 
  create_kisok, 
  place_item, 
  get_kiosk_items, 
  get_object, 
  list_item, 
  delist_item,
} from './../controller/rpc-client'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import './../App.css'
import { KioskClient, KioskTransaction, Network } from '@mysten/kiosk';
import TakeButton from './TakeButton';
import PlaceListButton from './PlaceListButton';
import Purchase from './Purchase';
import ListITemButton from './ListItemButton';
import SideBar from './sidebar/SideBar';
import clsx from 'clsx';
function Home() {
  const [placeItems, setPlaceItems] = useState<any[]>([])
  const [listItems, setListItems] = useState<any[]>([])
  const [input, setInput] = useState("");
  const [itemTypes, setItemTypes] = useState("")
  const [itemId, setItemId] = useState("")  
  const [price, setPrice] = useState(0n)
  const [show, setShow] = useState (false)
  //sign

  const currentAccount = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  console.log(currentWallet)
  console.log(currentAccount?.address)
  

  //sign
  const handle_data = () =>{
    setPlaceItems([])
    setListItems([])
    get_kiosk_items()
        .then(res => {
        let list_data = res.map(item => {
            get_object(`${item?.objectId}`)
            .then(obj => {
              console.log(item)
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
    delist_item(itemId, itemTypes)
    .then(res => {
      handle_data()
    })
  }
  const handle_list = () => {
    list_item(itemId, itemTypes)
    .then(res => {
      handle_data()
    })
  }
  const autoConnectionStatus = useAutoConnectWallet();
  return (
        <div className='wrapper'>
          <div className='f_1'> 
          <input type="text" value={input}  onChange={(e)=> {
          setInput(e.target.value)
        }} />
        {/* <PlaceListButton /> */}
        <TakeButton itemType={itemTypes} itemId={itemId}/>
        <Purchase itemId={itemId} itemType={itemTypes} price={price} />
          <span className='label'>Place</span>
          <div className='place_wrapper'>
            {placeItems.map(item =>{
              return <div className='card' key={item.fields.name} onClick={()=> {
                setItemTypes(item.type)
                setItemId(item.fields.id.id)

              }}>
                <span className='card_info'>Hero name: {item.fields.name}</span>
                <span className='card_info'>id: {item.fields.id.id}</span>
                <span className='card_info'>History: {item.fields.profile}</span>
                <span className='card_info'>Health: {item.fields.heal}</span>
                <span className='card_info'>Damage: {item.fields.damage}</span>
              </div>
            
            })}
          </div>
                
          <span className='label'>List for sell</span>
          <div className='place_wrapper'>
            {listItems.map(item =>{
              return <div className='card' key={item.fields.name}
                onClick={() => {
                  // setSeller()
                  setItemId(item.fields.id.id)
                  setPrice(BigInt(item.price))
                  setItemTypes(item.type)
                }}
              >
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
          {/* <button onClick={handle_list}>List item</button> */}
          <ListITemButton itemType={itemTypes} itemId={input} price={price}/>
          <button onClick={() => 
            place_item()
            .then(res => {
              console.log(res)
            })
            }>get kiosk</button>
          <button onClick={handle_data}>get kiosk items</button>
          <button onClick={handle_delist}>Delist</button>
          <ConnectButton />

          <div>auto connect status: {autoConnectionStatus}</div>
       </div>
         {<div className='sidebar_wrapper' onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}>
            {!show&&<span className='sidebar_switch'></span>}
              { show&&<SideBar />}
          </div>}
       </div>

  )
}

export default Home
