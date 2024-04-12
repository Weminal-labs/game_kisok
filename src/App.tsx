import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { create_kisok, get_owner_key_cap, get_kiosk_items, get_object, list_item, delist_item } from './controller/rpc-client'



function App() {
  const [count, setCount] = useState(0)
  const [placeItems, setPlaceItems] = useState<any[]>([])
  const [listItems, setListItems] = useState<any[]>([])

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
  
  return (
    <>
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
      </div>
    </>
  )
}

export default App
